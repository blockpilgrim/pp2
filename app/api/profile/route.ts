import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { D365ContactService } from "@/lib/services/d365ContactService";
import { z } from "zod";

// Validation schema for profile updates
const profileUpdateSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string()
    .regex(/^[\d\s\-\(\)\+\.]+$/, "Invalid phone number format")
    .min(7, "Phone number too short")
    .max(25, "Phone number too long")
    .optional()
    .or(z.literal("")), // Allow empty string
  portalRolesRaw: z.string()
    .regex(
      /^((role:\w+|state:\w+)(,(role:\w+|state:\w+))*)?$/,
      "Invalid format. Use: role:name,state:name"
    )
    .optional(),
});

// GET /api/profile - Get current user's profile
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // If user is a D365 user, fetch fresh data from D365
    if (session.user.isD365User && session.user.id) {
      try {
        const freshProfile = await D365ContactService.getContactByAzureADObjectId(session.user.id);
        if (freshProfile) {
          return NextResponse.json({
            id: session.user.id,
            contactId: freshProfile.contactId,
            firstName: freshProfile.firstName || '',
            lastName: freshProfile.lastName || '',
            email: freshProfile.email || '',
            phoneNumber: freshProfile.phoneNumber || '',
            portalRolesRaw: freshProfile.portalRolesRaw || '',
            roles: freshProfile.roles || [],
            states: freshProfile.states || [],
            isD365User: true,
          });
        }
      } catch (d365Error) {
        console.error("Error fetching fresh D365 data:", d365Error);
        // Fall back to session data if D365 fetch fails
      }
    }

    // Fall back to session data
    return NextResponse.json({
      id: session.user.id,
      contactId: session.user.contactId,
      firstName: session.user.d365Profile?.firstName || session.user.name?.split(' ')[0] || '',
      lastName: session.user.d365Profile?.lastName || session.user.name?.split(' ').slice(1).join(' ') || '',
      email: session.user.email || '',
      phoneNumber: session.user.phoneNumber || '',
      portalRolesRaw: session.user.portalRolesRaw || '',
      roles: session.user.roles || [],
      states: session.user.states || [],
      isD365User: session.user.isD365User,
    });
  } catch (error) {
    console.error("Error in GET /api/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update current user's profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!session.user.contactId || !session.user.isD365User) {
      return NextResponse.json(
        { error: "No D365 profile linked to update" },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = profileUpdateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: validationResult.error.flatten() 
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Security check: Validate portal roles changes
    if (updateData.portalRolesRaw !== undefined && updateData.portalRolesRaw !== session.user.portalRolesRaw) {
      // Log the attempt to change roles
      console.warn(`User ${session.user.id} attempting to change portal roles from "${session.user.portalRolesRaw}" to "${updateData.portalRolesRaw}"`);
      
      // For now, we'll allow the change but log it
      // In production, you might want to:
      // 1. Restrict certain role changes
      // 2. Require approval workflow
      // 3. Send notifications to admins
    }

    // Prepare data for D365 update
    const d365UpdateData = {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      email: updateData.email,
      phoneNumber: updateData.phoneNumber || undefined,
      portalRolesRaw: updateData.portalRolesRaw,
    };

    // Update in D365
    const success = await D365ContactService.updateContactProfile(
      session.user.contactId,
      d365UpdateData
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update profile in D365" },
        { status: 500 }
      );
    }

    // Return updated data
    // Note: The session will be refreshed on next request with new data
    return NextResponse.json({
      message: "Profile updated successfully",
      data: {
        ...d365UpdateData,
        contactId: session.user.contactId,
      }
    });

  } catch (error) {
    console.error("Error in PATCH /api/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}