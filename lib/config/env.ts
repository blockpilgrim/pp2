import { z } from 'zod';

/**
 * Server-side environment variables schema
 */
export const serverEnvSchema = z.object({
  // Authentication
  AUTH_MICROSOFT_ENTRA_ID_ID: z.string().min(1, 'Microsoft Entra ID client ID is required'),
  AUTH_MICROSOFT_ENTRA_ID_SECRET: z.string().min(1, 'Microsoft Entra ID client secret is required'),
  AUTH_MICROSOFT_ENTRA_ID_ISSUER: z.string().url('Microsoft Entra ID issuer must be a valid URL'),
  AUTH_SECRET: z.string().min(32, 'Auth secret must be at least 32 characters long'),
  
  // Dataverse
  DATAVERSE_URL: z.string().url('Dataverse URL must be a valid URL'),
  DATAVERSE_CLIENT_ID: z.string().min(1, 'Dataverse client ID is required'),
  DATAVERSE_CLIENT_SECRET: z.string().min(1, 'Dataverse client secret is required'),
  DATAVERSE_TENANT_ID: z.string().default('common'),
  
  // App
  NEXTAUTH_URL: z.string().url().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Client-side environment variables schema
 * 
 * Note: These should only include PUBLIC environment variables that are safe to expose to the browser.
 * Do not include secrets or sensitive information here.
 */
export const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
});

/**
 * Specify client-side environment variables here
 */
export const clientEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

/**
 * Type inference helpers
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;

/**
 * Validate and parse environment variables on the server side
 */
export function validateEnv() {
  try {
    const result = serverEnvSchema.safeParse(process.env);
    
    if (!result.success) {
      console.error('❌ Invalid environment variables:', result.error.format());
      throw new Error('Invalid environment variables');
    }
    
    return result.data;
  } catch (error) {
    console.error('❌ Error validating environment variables:', error);
    throw error;
  }
}

/**
 * Validates client-side environment variables
 */
export function validateClientEnv() {
  try {
    const result = clientEnvSchema.safeParse(clientEnv);
    
    if (!result.success) {
      console.error('❌ Invalid client environment variables:', result.error.format());
      throw new Error('Invalid client environment variables');
    }
    
    return result.data;
  } catch (error) {
    console.error('❌ Error validating client environment variables:', error);
    throw error;
  }
}