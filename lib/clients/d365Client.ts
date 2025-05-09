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

let instanceCounter = 0;

// D365 Client class
export class D365Client {
  private dataverseUrl: string;
  private clientId: string;
  private clientSecret: string;
  private tenantId: string;
  private cachedToken: CachedToken | null = null;
  private instanceId: number;

  constructor(config?: {
    dataverseUrl?: string;
    clientId?: string;
    clientSecret?: string;
    tenantId?: string;
  }) {
    this.instanceId = ++instanceCounter;
    console.log(`D365Client[${this.instanceId}]: Initializing...`);
    // Try to load from environment if not provided
    const envConfig = this.validateEnvConfig();

    this.dataverseUrl = config?.dataverseUrl || envConfig.DATAVERSE_URL;
    this.clientId = config?.clientId || envConfig.DATAVERSE_CLIENT_ID;
    this.clientSecret = config?.clientSecret || envConfig.DATAVERSE_CLIENT_SECRET;
    this.tenantId = config?.tenantId || envConfig.DATAVERSE_TENANT_ID;
    console.log(`D365Client[${this.instanceId}]: Initialized successfully.`);
  }

  /**
   * Validates environment variables using Zod
   */
  private validateEnvConfig() {
    try {
      // Log the environment variables as seen by process.env for diagnostics
      console.log(`D365Client[${this.instanceId}]: Validating Dataverse environment configuration...`);
      console.log(`D365Client[${this.instanceId}]: process.env.DATAVERSE_URL = "${process.env.DATAVERSE_URL}"`);
      console.log(`D365Client[${this.instanceId}]: process.env.DATAVERSE_CLIENT_ID = "${process.env.DATAVERSE_CLIENT_ID}"`);
      console.log(`D365Client[${this.instanceId}]: process.env.DATAVERSE_CLIENT_SECRET is ${process.env.DATAVERSE_CLIENT_SECRET ? 'set' : 'NOT SET'}`);
      console.log(`D365Client[${this.instanceId}]: process.env.DATAVERSE_TENANT_ID = "${process.env.DATAVERSE_TENANT_ID}"`);

      const result = dataverseEnvSchema.safeParse({
        DATAVERSE_URL: process.env.DATAVERSE_URL,
        DATAVERSE_CLIENT_ID: process.env.DATAVERSE_CLIENT_ID,
        DATAVERSE_CLIENT_SECRET: process.env.DATAVERSE_CLIENT_SECRET,
        DATAVERSE_TENANT_ID: process.env.DATAVERSE_TENANT_ID,
      });

      if (!result.success) {
        const formattedErrors = result.error.format();
        console.error(`❌ D365Client[${this.instanceId}]: Invalid Dataverse environment configuration. Details:`, formattedErrors);
        throw new DataverseError(
          `D365Client[${this.instanceId}]: Invalid Dataverse environment configuration. Check server logs for details.`,
          DataverseErrorType.CONFIGURATION,
          400,
          formattedErrors
        );
      }
      console.log(`D365Client[${this.instanceId}]: Dataverse environment configuration is valid.`);
      return result.data;
    } catch (error) {
      if (error instanceof DataverseError) {
        throw error;
      }
      console.error(`❌ D365Client[${this.instanceId}]: Unexpected error during Dataverse configuration validation:`, error);
      throw new DataverseError(
        `D365Client[${this.instanceId}]: Failed to validate Dataverse configuration due to an unexpected error. Check server logs.`,
        DataverseErrorType.CONFIGURATION
      );
    }
  }

  /**
   * Gets an access token for Dataverse API, using cache if available
   */
  async getAccessToken(): Promise<string> {
    console.log(`D365Client[${this.instanceId}]: Attempting to get access token...`);
    const nowInSeconds = Math.floor(Date.now() / 1000);

    if (this.cachedToken && this.cachedToken.expiresAt > nowInSeconds + 60) {
      console.log(`D365Client[${this.instanceId}]: Returning cached access token.`);
      return this.cachedToken.accessToken;
    }
    console.log(`D365Client[${this.instanceId}]: No valid cached token. Fetching new token...`);

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
        console.error(`❌ D365Client[${this.instanceId}]: Failed to obtain Dataverse access token. Status: ${tokenResponse.status}. URL: ${tokenUrl}. Response: ${errText}`);
        throw new DataverseError(
          `D365Client[${this.instanceId}]: Failed to obtain Dataverse access token. Check server logs for details.`,
          DataverseErrorType.AUTHENTICATION,
          tokenResponse.status,
          errText
        );
      }

      const tokenData = await tokenResponse.json();
      const expiresIn = tokenData.expires_in; 
      const accessToken = tokenData.access_token;

      this.cachedToken = {
        accessToken: accessToken,
        expiresAt: nowInSeconds + expiresIn,
      };
      console.log(`D365Client[${this.instanceId}]: Successfully obtained and cached new access token.`);
      return accessToken;
    } catch (error) {
      if (error instanceof DataverseError) {
        throw error;
      }
      console.error(`❌ D365Client[${this.instanceId}]: Exception during Dataverse token fetch:`, error);
      throw new DataverseError(
        `D365Client[${this.instanceId}]: Failed to fetch Dataverse token due to an exception. Check server logs.`,
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
    const requestMethod = options.method || 'GET';
    console.log(`D365Client[${this.instanceId}]: Making ${requestMethod} request to endpoint: ${endpoint}`);
    try {
      const accessToken = await this.getAccessToken();
      
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      let url = `${this.dataverseUrl}${normalizedEndpoint}`;
      if (options.params && Object.keys(options.params).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(options.params).forEach(([key, value]) => {
          searchParams.append(key, value);
        });
        url += `?${searchParams.toString()}`;
      }

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        ...options.headers,
      };

      if (options.body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method: requestMethod,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`❌ D365Client[${this.instanceId}]: Dataverse API request failed. URL: ${url}, Method: ${requestMethod}, Status: ${response.status}. Response: ${errText}`);
        throw new DataverseError(
          `D365Client[${this.instanceId}]: Dataverse API request failed with status ${response.status}. Check server logs for details.`,
          DataverseErrorType.RESPONSE,
          response.status,
          errText
        );
      }

      if (response.status === 204) {
        console.log(`D365Client[${this.instanceId}]: Request to ${url} successful with status 204 No Content.`);
        return undefined as T; 
      }
      const data = await response.json();
      console.log(`D365Client[${this.instanceId}]: Request to ${url} successful.`);
      return data as T;
    } catch (error) {
      if (error instanceof DataverseError) {
        throw error;
      }
      console.error(`❌ D365Client[${this.instanceId}]: Unexpected error during Dataverse request. URL: ${requestMethod} ${endpoint}. Error:`, error);
      if (error instanceof TypeError || (error instanceof Error && error.message.includes('fetch'))) {
        throw new DataverseError(
          `D365Client[${this.instanceId}]: Network error during Dataverse request: ${error.message}. Check server logs.`,
          DataverseErrorType.NETWORK
        );
      }
      throw new DataverseError(
        `D365Client[${this.instanceId}]: Unknown error occurred during Dataverse request. Check server logs.`,
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
    if (options.select && options.select.length > 0) params.$select = options.select.join(',');
    if (options.filter) params.$filter = options.filter;
    if (options.top) params.$top = options.top.toString();

    const response = await this.request<{ value: any[] }>('/api/data/v9.2/contacts', { params });
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
    return this.request('/api/data/v9.2/contacts', { method: 'POST', body: contact });
  }

  /**
   * Updates an existing contact in Dataverse
   */
  async updateContact(contactId: string, contact: Record<string, any>) {
    await this.request(`/api/data/v9.2/contacts(${contactId})`, { method: 'PATCH', body: contact });
    return true; 
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
    if (options.select && options.select.length > 0) params.$select = options.select.join(',');
    if (options.filter) params.$filter = options.filter;
    if (options.top) params.$top = options.top.toString();

    const response = await this.request<{ value: any[] }>('/api/data/v9.2/leads', { params });
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
    return this.request('/api/data/v9.2/leads', { method: 'POST', body: lead });
  }
}

export const d365Client = new D365Client();
export default D365Client;
