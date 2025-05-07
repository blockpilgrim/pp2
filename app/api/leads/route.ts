import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { d365Client } from '@/lib/clients/d365Client';
import {
  handleApiError,
  createAuthenticationError,
  createValidationError,
  AppError,
  ErrorType
} from '@/lib/utils/error-handler';

export const runtime = 'nodejs';

// Zod Schema for POST request validation
const leadSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  company: z.string().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
});

// Type for validated lead data
type LeadData = z.infer<typeof leadSchema>;

// GET: Fetch leads
export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      throw createAuthenticationError();
    }

    // Get URL parameters
    const url = new URL(request.url);
    const filter = url.searchParams.get('filter') || undefined;
    const top = url.searchParams.get('top') ? parseInt(url.searchParams.get('top')!) : undefined;
    const select = url.searchParams.get('select')?.split(',') || undefined;

    // Fetch leads from Dataverse
    const leads = await d365Client.getLeads({
      filter,
      top,
      select,
    });

    return NextResponse.json(leads);
  } catch (error) {
    return handleApiError(error, 'Failed to fetch leads');
  }
}

// POST: Create a new lead
export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      throw createAuthenticationError();
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = leadSchema.safeParse(body);

    if (!validationResult.success) {
      throw createValidationError('Invalid lead data', validationResult.error.flatten().fieldErrors);
    }

    // Use the validated data
    const lead = validationResult.data;

    // Transform to Dataverse format
    const dataverseLead = {
      firstname: lead.firstName,
      lastname: lead.lastName,
      emailaddress1: lead.email,
      ...(lead.company ? { companyname: lead.company } : {}),
      ...(lead.phone ? { telephone1: lead.phone } : {}),
      ...(lead.description ? { description: lead.description } : {}),
    };

    // Create lead in Dataverse
    const result = await d365Client.createLead(dataverseLead);

    return NextResponse.json({ 
      message: 'Lead created successfully', 
      leadId: result.leadid || result.id 
    }, { status: 201 });
  } catch (error) {
    return handleApiError(error, 'Failed to create lead');
  }
}

// PATCH: Update an existing lead
export async function PATCH(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      throw createAuthenticationError();
    }

    // Get lead ID from URL
    const url = new URL(request.url);
    const leadId = url.searchParams.get('id');
    
    if (!leadId) {
      throw new AppError('Lead ID is required', ErrorType.VALIDATION, 400);
    }

    // Parse and validate request body
    const body = await request.json();
    const updateSchema = leadSchema.partial(); // All fields optional for updates
    const validationResult = updateSchema.safeParse(body);

    if (!validationResult.success) {
      throw createValidationError('Invalid lead data', validationResult.error.flatten().fieldErrors);
    }

    // Use the validated data
    const lead = validationResult.data;

    // Transform to Dataverse format
    const dataverseLead: Record<string, any> = {};
    
    if (lead.firstName) dataverseLead.firstname = lead.firstName;
    if (lead.lastName) dataverseLead.lastname = lead.lastName;
    if (lead.email) dataverseLead.emailaddress1 = lead.email;
    if (lead.company) dataverseLead.companyname = lead.company;
    if (lead.phone) dataverseLead.telephone1 = lead.phone;
    if (lead.description) dataverseLead.description = lead.description;

    // Update lead in Dataverse
    await d365Client.updateContact(leadId, dataverseLead);

    return NextResponse.json({ message: 'Lead updated successfully' });
  } catch (error) {
    return handleApiError(error, 'Failed to update lead');
  }
}