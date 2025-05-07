import { NextResponse } from 'next/server';

/**
 * Error types for better categorization
 */
export enum ErrorType {
  VALIDATION = 'validation_error',
  AUTHENTICATION = 'authentication_error',
  AUTHORIZATION = 'authorization_error',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  API_ERROR = 'api_error',
  NETWORK_ERROR = 'network_error',
  INTERNAL_ERROR = 'internal_error',
  UNKNOWN = 'unknown_error',
}

/**
 * Common application error class with type categorization
 */
export class AppError extends Error {
  type: ErrorType;
  status: number;
  details?: any;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    status: number = 500,
    details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.status = status;
    this.details = details;
  }

  /**
   * Converts the error to a JSON object for API responses
   */
  toJSON() {
    return {
      error: this.message,
      type: this.type,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

/**
 * Creates a standardized validation error
 */
export function createValidationError(message: string, details?: any): AppError {
  return new AppError(message, ErrorType.VALIDATION, 400, details);
}

/**
 * Creates a standardized authentication error
 */
export function createAuthenticationError(message: string = 'Authentication required'): AppError {
  return new AppError(message, ErrorType.AUTHENTICATION, 401);
}

/**
 * Creates a standardized authorization error
 */
export function createAuthorizationError(message: string = 'Insufficient permissions'): AppError {
  return new AppError(message, ErrorType.AUTHORIZATION, 403);
}

/**
 * Creates a standardized not found error
 */
export function createNotFoundError(message: string = 'Resource not found'): AppError {
  return new AppError(message, ErrorType.NOT_FOUND, 404);
}

/**
 * Creates a standardized conflict error
 */
export function createConflictError(message: string, details?: any): AppError {
  return new AppError(message, ErrorType.CONFLICT, 409, details);
}

/**
 * Creates a standardized API error
 */
export function createApiError(message: string, status: number = 500, details?: any): AppError {
  return new AppError(message, ErrorType.API_ERROR, status, details);
}

/**
 * Creates a standardized network error
 */
export function createNetworkError(message: string = 'Network request failed'): AppError {
  return new AppError(message, ErrorType.NETWORK_ERROR, 500);
}

/**
 * Creates a standardized internal error
 */
export function createInternalError(message: string = 'Internal server error', details?: any): AppError {
  return new AppError(message, ErrorType.INTERNAL_ERROR, 500, details);
}

/**
 * Handler function for API route errors
 */
export function handleApiError(error: unknown, defaultMessage: string = 'An unexpected error occurred') {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return NextResponse.json(error.toJSON(), { status: error.status });
  }

  if (error instanceof Error) {
    const appError = new AppError(error.message, ErrorType.UNKNOWN, 500);
    return NextResponse.json(appError.toJSON(), { status: 500 });
  }

  const appError = new AppError(defaultMessage, ErrorType.UNKNOWN, 500);
  return NextResponse.json(appError.toJSON(), { status: 500 });
}

/**
 * Handler function for global client-side errors
 */
export function handleClientError(error: unknown, defaultMessage: string = 'An unexpected error occurred'): {
  message: string;
  type: ErrorType;
  details?: any;
} {
  console.error('Client Error:', error);

  if (error instanceof AppError) {
    return {
      message: error.message,
      type: error.type,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      type: ErrorType.UNKNOWN,
    };
  }

  return {
    message: defaultMessage,
    type: ErrorType.UNKNOWN,
  };
}

/**
 * Safely parses JSON data with error handling
 */
export function safeParseJSON<T>(data: string, defaultValue: T): T {
  try {
    return JSON.parse(data) as T;
  } catch (error) {
    console.error('JSON Parse Error:', error);
    return defaultValue;
  }
}