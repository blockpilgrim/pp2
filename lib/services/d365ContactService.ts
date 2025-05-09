import { d365Client } from "@/lib/clients/d365Client"; // Your D365 client
import { UserRole } from "@/lib/auth"; // Assuming UserRole is exported from lib/auth.ts or a central types file

export interface AppContactProfile {
  contactId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles: UserRole[]; // Application-specific roles from D365
  // Add other relevant profile fields from D365 as needed
  // e.g., companyName?: string; phoneNumber?: string;
}

export class D365ContactService {
  /**
   * Fetches a Contact from D365 based on Azure AD Object ID.
   * 
   * @param azureAdObjectId The Azure AD Object ID of the user.
   * @returns A promise that resolves to an AppContactProfile or null if not found.
   */
  static async getContactByAzureADObjectId(azureAdObjectId: string): Promise<AppContactProfile | null> {
    console.log(`D365ContactService: Attempting to fetch contact for Azure AD OID: ${azureAdObjectId}`);
    try {
      // This is a placeholder for your actual Dataverse query.
      // You need to have a custom field on your Contact entity in Dataverse
      // that stores the Azure AD Object ID. Let's assume its logical name is 'crXXX_azureadobjectid'.
      // Adjust 'select' to include all fields you need, especially the field storing roles.
      // Let's assume roles are stored in a field named 'crXXX_approles'.
      const contacts = await d365Client.getContacts({ // Ensure d365Client has a method like getContacts
        select: ["contactid", "firstname", "lastname", "emailaddress1", "crXXX_approles"],
        filters: [`crXXX_azureadobjectid eq '${azureAdObjectId}'`], // Query by the Azure AD Object ID
        top: 1, // We expect at most one contact
      });

      if (contacts && contacts.length > 0) {
        const d365Contact = contacts[0];
        const appProfile: AppContactProfile = {
          contactId: d365Contact.contactid!, // Assuming contactid is always present
          firstName: d365Contact.firstname,
          lastName: d365Contact.lastname,
          email: d365Contact.emailaddress1, // Or another email field as appropriate
          roles: this.mapD365RolesToAppRoles(d365Contact.crXXX_approles),
          // Map other fields from d365Contact to appProfile as needed
        };
        console.log(`D365ContactService: Found contact profile for AAD OID ${azureAdObjectId}:`, appProfile);
        return appProfile;
      } else {
        console.log(`D365ContactService: No contact found for Azure AD OID: ${azureAdObjectId}`);
        return null;
      }
    } catch (error) {
      console.error(`D365ContactService: Error fetching D365 Contact by Azure AD Object ID ${azureAdObjectId}:`, error);
      // Depending on your error handling strategy, you might throw a custom error
      // or return null to indicate failure.
      return null;
    }
  }

  /**
   * Maps the role data retrieved from D365 to the application's UserRole enum.
   * This method needs to be adapted based on how roles are stored in D365
   * (e.g., comma-separated string, option set values, related entity).
   * 
   * @param d365RolesField The raw role data from the D365 Contact record.
   * @returns An array of UserRole.
   */
  private static mapD365RolesToAppRoles(d365RolesField: any): UserRole[] {
    const mappedRoles: UserRole[] = [];

    // Example: If roles are stored as a comma-separated string (e.g., "admin,partner")
    if (typeof d365RolesField === 'string' && d365RolesField.trim().length > 0) {
      const roleStrings = d365RolesField.split(',').map(roleStr => roleStr.trim().toLowerCase());
      for (const roleStr of roleStrings) {
        if (Object.values(UserRole).includes(roleStr as UserRole)) {
          mappedRoles.push(roleStr as UserRole);
        } else {
          console.warn(`D365ContactService: Unknown role string '${roleStr}' encountered.`);
        }
      }
    }
    // Example: If roles are stored as an array of numbers (OptionSet values)
    // else if (Array.isArray(d365RolesField)) {
    //   d365RolesField.forEach(roleValue => {
    //     if (roleValue === 100000000) mappedRoles.push(UserRole.ADMIN); // Example mapping
    //     if (roleValue === 100000001) mappedRoles.push(UserRole.PARTNER);
    //   });
    // }

    // If no roles are mapped, or if the field is empty, assign a default role.
    // This ensures every user has at least a basic role.
    if (mappedRoles.length === 0) {
      mappedRoles.push(UserRole.USER);
      console.log(`D365ContactService: No specific roles found or mapped, assigning default role: ${UserRole.USER}`);
    }
    
    return mappedRoles;
  }

  /**
   * Updates a Contact's profile in D365.
   * Placeholder for actual implementation.
   * 
   * @param contactId The D365 Contact ID.
   * @param data The data to update.
   * @returns A promise that resolves to true if successful, false otherwise.
   */
  static async updateContactProfile(contactId: string, data: Partial<AppContactProfile>): Promise<boolean> {
    console.log(`D365ContactService: Updating D365 Contact ${contactId} with data:`, data);
    try {
      // Map AppContactProfile fields back to D365 entity fields
      const d365UpdateData: any = {};
      if (data.firstName !== undefined) d365UpdateData.firstname = data.firstName;
      if (data.lastName !== undefined) d365UpdateData.lastname = data.lastName;
      // ... map other updatable fields

      // await d365Client.updateRecord("contacts", contactId, d365UpdateData);
      console.warn("D365ContactService.updateContactProfile is a placeholder and not yet implemented.");
      return true; // Placeholder success
    } catch (error) {
      console.error(`D365ContactService: Error updating D365 Contact profile ${contactId}:`, error);
      return false;
    }
  }
}
