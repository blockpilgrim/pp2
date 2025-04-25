import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Import auth to protect the route

export const runtime = 'nodejs'; // ensure Node.js runtime for env and fetch

export async function GET(_request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch contacts from Dataverse Web API
  const dataverseUrl = process.env.DATAVERSE_URL;
  const clientId = process.env.DATAVERSE_CLIENT_ID;
  const clientSecret = process.env.DATAVERSE_CLIENT_SECRET;
  const tenantId = process.env.DATAVERSE_TENANT_ID || 'common';

  if (!dataverseUrl || !clientId || !clientSecret) {
    console.error('Missing Dataverse configuration.');
    return NextResponse.json({ error: 'Dataverse configuration error' }, { status: 500 });
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
      return NextResponse.json({ error: 'Failed to acquire access token' }, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

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
    console.error('Dataverse API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    // Placeholder: Add logic to create/update lead in Dataverse via d365Client
    console.log("Received lead data:", body);
    return NextResponse.json({ message: "Lead processed successfully", data: body }, { status: 201 });
  } catch (error) {
    console.error("Error processing lead:", error);
    return NextResponse.json({ error: 'Failed to process lead data' }, { status: 500 });
  }
}
