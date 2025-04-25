import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Import auth to protect the route

export async function GET(_request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Placeholder: Add logic to fetch leads from Dataverse via d365Client
  console.log("Fetching leads for user:", session.user.email);
  const leads = [{ id: 1, name: "Lead A" }, { id: 2, name: "Lead B" }]; // Dummy data
  return NextResponse.json(leads);
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
