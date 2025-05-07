import { z } from 'zod';

// Define environment validation schema
export const dataverseEnvSchema = z.object({
  DATAVERSE_URL: z.string().url(),
  DATAVERSE_CLIENT_ID: z.string().min(1),
  DATAVERSE_CLIENT_SECRET: z.string().min(1),
  DATAVERSE_TENANT_ID: z.string().default('common'),
});

// Error types for Dataverse client
export enum DataverseErrorType {
  CONFIGURATION = 'configuration_error',
  AUTHENTICATION = 'authentication_error',
  REQUEST = 'request_error',
  RESPONSE = 'response_error',
  NETWORK = 'network_error',
  UNKNOWN = 'unknown_error',
}

// Custom error class for Dataverse client
export class DataverseError extends Error {
  type: DataverseErrorType;
  status?: number;
  details?: any;

  constructor(
    message: string,
    type: DataverseErrorType = DataverseErrorType.UNKNOWN,
    status?: number,
    details?: any
  ) {
    super(message);
    this.name = 'DataverseError';
    this.type = type;
    this.status = status;
    this.details = details;
  }
}

// Token cache type
type CachedToken = {
  accessToken: string;
  expiresAt: number; // Store expiry time (timestamp in seconds)
};

// D365 Client class
export class D365Client {
  private dataverseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private tenantId: string;
  private cachedToken: CachedToken | null = null;

  constructor(config?: {
    dataverseUrl?: string;
    clientId?: string;
    clientSecret?: string;
    tenantId?: string;
  }) {
    // Try to load from environment if not provided
    const envConfig = this.validateEnvConfig();

    this.dataverseUrl = config?.dataverseUrl || envConfig.DATAVERSE_URL;
    this.clientId = config?.clientId || envConfig.DATAVERSE_CLIENT_ID;
    this.clientSecret = config?.clientSecret || envConfig.DATAVERSE_CLIENT_SECRET;
    this.tenantId = config?.tenantId || envConfig.DATAVERSE_TENANT_ID;
  }

  /**
   * Validates environment variables using Zod
   */
  private validateEnvConfig() {
    try {
      const result = dataverseEnvSchema.safeParse({
        DATAVERSE_URL: process.env.DATAVERSE_URL,
        DATAVERSE_CLIENT_ID: process.env.DATAVERSE_CLIENT_ID,
        DATAVERSE_CLIENT_SECRET: process.env.DATAVERSE_CLIENT_SECRET,
        DATAVERSE_TENANT_ID: process.env.DATAVERSE_TENANT_ID,
      });

      if (!result.success) {
        const formattedErrors = result.error.format();
        throw new DataverseError(
          'Invalid Dataverse environment configuration',
          DataverseErrorType.CONFIGURATION,
          400,
          formattedErrors
        );
      }

      return result.data;
    } catch (error) {
      if (error instanceof DataverseError) {
        throw error;
      }
      throw new DataverseError(
        'Failed to validate Dataverse configuration',
        DataverseErrorType.CONFIGURATION
      );
    }
  }

  /**
   * Gets an access token for Dataverse API, using cache if available
   */
  async getAccessToken(): Promise<string> {
    const nowInSeconds = Math.floor(Date.now() / 1000);

    // Return cached token if it exists and hasn't expired (with a 60-second buffer)
    if (this.cachedToken && this.cachedToken.expiresAt > nowInSeconds + 60) {
      return this.cachedToken.accessToken;
    }

    // Fetch new token
    const tokenUrl = `https://login.microsoftonline.com/${this.tenantId}/oauth2/v2.0/token`;
    try {
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          scope: `${this.dataverseUrl}/.default`,
          grant_type: 'client_credentials',
        }),
      });

      if (!tokenResponse.ok) {
        const errText = await tokenResponse.text();
        throw new DataverseError(
          'Failed to obtain Dataverse access token',
          DataverseErrorType.AUTHENTICATION,
          tokenResponse.status,
          errText
        );
      }

      const tokenData = await tokenResponse.json();
      const expiresIn = tokenData.expires_in; // typically 3600 seconds (1 hour)
      const accessToken = tokenData.access_token;

      // Cache the new token with its expiry time
      this.cachedToken = {
        accessToken: accessToken,
        expiresAt: nowInSeconds + expiresIn,
      };

      return accessToken;
    } catch (error) {
      if (error instanceof DataverseError) {
        throw error;
      }
      throw new DataverseError(
        'Failed to fetch Dataverse token',
        DataverseErrorType.AUTHENTICATION
      );
    }
  }

  /**
   * Makes an authenticated request to the Dataverse API
   */
  async request<T = any>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
      headers?: Record<string, string>;
      params?: Record<string, string>;
      body?: any;
    } = {}
  ): Promise<T> {
    try {
      const accessToken = await this.getAccessToken();
      
      // Normalize endpoint - ensure it starts with a slash
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      
      // Build URL with query parameters if provided
      let url = `${this.dataverseUrl}${normalizedEndpoint}`;
      if (options.params && Object.keys(options.params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
          searchParams.append(key, value);
        });
        url += `?${searchParams.toString()}`;
      }

      // Prepare headers with authentication
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        ...options.headers,
      };

      // Add content-type for requests with body
      if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      // Make the request
      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      // Handle non-success responses
      if (!response.ok) {
        const errText = await response.text();
        throw new DataverseError(
          `Dataverse API request failed with status ${response.status}`,
          DataverseErrorType.RESPONSE,
          response.status,
          errText
        );
      }

      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof DataverseError) {
        throw error;
      }
      if (error instanceof TypeError || error instanceof Error) {
        throw new DataverseError(
          `Network error: ${error.message}`,
          DataverseErrorType.NETWORK
        );
      }
      throw new DataverseError(
        'Unknown error occurred during Dataverse request',
        DataverseErrorType.UNKNOWN
      );
    }
  }

  /**
   * Fetches contacts with optional filtering
   */
  async getContacts(options: {
    select?: string[];
    filter?: string;
    top?: number;
  } = {}) {
    const params: Record<string, string> = {};

    if (options.select && options.select.length > 0) {
      params.$select = options.select.join(',');
    }

    if (options.filter) {
      params.$filter = options.filter;
    }

    if (options.top) {
      params.$top = options.top.toString();
    }

    const response = await this.request<{ value: any[] }>('/api/data/v9.2/contacts', {
      params,
    });

    return response.value;
  }

  /**
   * Creates a new contact in Dataverse
   */
  async createContact(contact: {
    firstname: string;
    lastname: string;
    emailaddress1: string;
    [key: string]: any;
  }) {
    return this.request('/api/data/v9.2/contacts', {
      method: 'POST',
      body: contact,
    });
  }

  /**
   * Updates an existing contact in Dataverse
   */
  async updateContact(contactId: string, contact: Record<string, any>) {
    return this.request(`/api/data/v9.2/contacts(${contactId})`, {
      method: 'PATCH',
      body: contact,
    });
  }

  /**
   * Fetches leads with optional filtering
   */
  async getLeads(options: {
    select?: string[];
    filter?: string;
    top?: number;
  } = {}) {
    const params: Record<string, string> = {};

    if (options.select && options.select.length > 0) {
      params.$select = options.select.join(',');
    }

    if (options.filter) {
      params.$filter = options.filter;
    }

    if (options.top) {
      params.$top = options.top.toString();
    }

    const response = await this.request<{ value: any[] }>('/api/data/v9.2/leads', {
      params,
    });

    return response.value;
  }

  /**
   * Creates a new lead in Dataverse
   */
  async createLead(lead: {
    firstname: string;
    lastname: string;
    emailaddress1: string;
    [key: string]: any;
  }) {
    return this.request('/api/data/v9.2/leads', {
      method: 'POST',
      body: lead,
    });
  }
}

// Export a singleton instance for use throughout the application
export const d365Client = new D365Client();

// Default export for when users want to create their own instance
export default D365Client;