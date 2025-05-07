import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { d365Client } from '@/lib/clients/d365Client';
import {
  handleApiError,
  createAuthenticationError,
} from '@/lib/utils/error-handler';

export const runtime = 'nodejs';

/**
 * GET handler to test Dataverse API connection
 */
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      throw createAuthenticationError();
    }

    // Fetch a few contacts as a test
    const contacts = await d365Client.getContacts({
      select: ['firstname', 'lastname', 'emailaddress1'],
      top: 5,
    });

    return NextResponse.json({
      success: true,
      message: 'Dataverse connection successful',
      timestamp: new Date().toISOString(),
      contacts,
    });
  } catch (error) {
    return handleApiError(error, 'Failed to test Dataverse connection');
  }
}