import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Import auth to protect the route
import { z } from 'zod'; // Import Zod

export const runtime = 'nodejs'; // ensure Node.js runtime for env and fetch

// --- Token Caching Logic ---
type CachedToken = {
  accessToken: string;
  expiresAt: number; // Store expiry time (timestamp in seconds)
};

let cachedDataverseToken: CachedToken | null = null;

async function getDataverseAccessToken(): Promise<string | null> {
  const nowInSeconds = Date.now() / 1000;

  // Return cached token if it exists and hasn't expired (with a 60-second buffer)
  if (cachedDataverseToken && cachedDataverseToken.expiresAt > nowInSeconds + 60) {
    return cachedDataverseToken.accessToken;
  }

  // Fetch new token if cache is empty or expired
  const dataverseUrl = process.env.DATAVERSE_URL;
  const clientId = process.env.DATAVERSE_CLIENT_ID;
  const clientSecret = process.env.DATAVERSE_CLIENT_SECRET;
  const tenantId = process.env.DATAVERSE_TENANT_ID || 'common';

  if (!dataverseUrl || !clientId || !clientSecret) {
    console.error('Missing Dataverse configuration for token fetch.');
    // In a real app, might throw a specific error
    return null;
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        scope: `${dataverseUrl}/.default`,
        grant_type: 'client_credentials',
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error('Token request failed:', errText);
      // Consider more specific error handling or re-throwing
      return null;
    }

    const tokenData = await tokenResponse.json();
    const expiresIn = tokenData.expires_in; // typically 3600 seconds (1 hour)
    const accessToken = tokenData.access_token;

    // Cache the new token with its expiry time
    cachedDataverseToken = {
      accessToken: accessToken,
      expiresAt: nowInSeconds + expiresIn,
    };

    return accessToken;
  } catch (error) {
    console.error('Failed to fetch Dataverse token:', error);
    return null;
  }
}
// --- End Token Caching Logic ---

export async function GET(_request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const accessToken = await getDataverseAccessToken();
  if (!accessToken) {
    // Handle error from token function (already logged inside)
    return NextResponse.json({ error: 'Failed to obtain Dataverse access token' }, { status: 500 });
  }

  const dataverseUrl = process.env.DATAVERSE_URL;
  if (!dataverseUrl) {
    // This check might be redundant if token fetch succeeded, but good for clarity
    console.error('Missing Dataverse URL for API call.');
    return NextResponse.json({ error: 'Dataverse configuration error' }, { status: 500 });
  }

  // Fetch contacts from Dataverse Web API using the cached/new token
  try {
    const contactsResponse = await fetch(
      `${dataverseUrl}/api/data/v9.2/contacts?$select=firstname,lastname,emailaddress1&$filter=contains(emailaddress1,'@thecontingent.org')`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );

    if (!contactsResponse.ok) {
      const errText = await contactsResponse.text();
      console.error('Contacts request failed:', errText);
      return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: contactsResponse.status });
    }

    const contactsData = await contactsResponse.json();
    return NextResponse.json(contactsData.value);
  } catch (error) {
    console.error('Dataverse API error during GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// --- Zod Schema for POST --- Define expected lead structure
const leadSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  // Add other fields as needed
});
// --- End Zod Schema ---

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();

    // Validate the request body
    const validationResult = leadSchema.safeParse(body);

    if (!validationResult.success) {
      // Extract validation errors
      const errors = validationResult.error.flatten().fieldErrors;
      console.error("Lead validation failed:", errors);
      return NextResponse.json({ error: 'Invalid input data', details: errors }, { status: 400 });
    }

    // Use the validated data
    const validatedLeadData = validationResult.data;

    // Placeholder: Add logic to create/update lead in Dataverse using validatedLeadData
    console.log("Received valid lead data:", validatedLeadData);
    // Example: await createDataverseLead(validatedLeadData);

    return NextResponse.json({ message: "Lead processed successfully", data: validatedLeadData }, { status: 201 });

  } catch (error) {
    // Handle JSON parsing errors or other unexpected errors
    if (error instanceof SyntaxError) { // Specifically catch JSON parsing errors
        return NextResponse.json({ error: 'Invalid JSON format in request body' }, { status: 400 });
    }
    console.error("Error processing lead POST:", error);
    return NextResponse.json({ error: 'Failed to process lead data' }, { status: 500 });
  }
}
