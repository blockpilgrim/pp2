import { d365Client } from "@/lib/clients/d365Client"; // Your D365 client
import { UserRole } from "@/lib/auth"; // Assuming UserRole is exported from lib/auth.ts

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
  private static readonly AAD_OBJECT_ID_FIELD = process.env.DATAVERSE_CONTACT_AAD_OBJECT_ID_FIELD;
  private static readonly APP_ROLES_FIELD = process.env.DATAVERSE_CONTACT_APP_ROLES_FIELD;

  /**
   * Fetches a Contact from D365 based on Azure AD Object ID.
   * 
   * @param azureAdObjectId The Azure AD Object ID of the user.
   * @returns A promise that resolves to an AppContactProfile or null if not found.
   */
  static async getContactByAzureADObjectId(azureAdObjectId: string): Promise<AppContactProfile | null> {
    if (!this.AAD_OBJECT_ID_FIELD || !this.APP_ROLES_FIELD) {
      console.error("D365ContactService: Environment variables for D365 field names (DATAVERSE_CONTACT_AAD_OBJECT_ID_FIELD, DATAVERSE_CONTACT_APP_ROLES_FIELD) are not configured.");
      // Potentially throw an error or return null, depending on desired strictness
      // For now, returning null to allow auth flow to assign default roles if this is misconfigured.
      return null;
    }

    console.log(`D365ContactService: Attempting to fetch contact for Azure AD OID: ${azureAdObjectId} using AAD field '${this.AAD_OBJECT_ID_FIELD}' and roles field '${this.APP_ROLES_FIELD}'`);
    
    try {
      const selectFields = [
        "contactid", 
        "firstname", 
        "lastname", 
        "emailaddress1", 
        this.APP_ROLES_FIELD // Dynamically include the roles field
      ];
      
      // Ensure AAD_OBJECT_ID_FIELD is part of select if it's not implicitly returned or needed for other reasons.
      // Typically, it's used in the filter, not necessarily in the select if you already have the value.
      // However, if your d365Client.getContacts requires it or if you want to verify it, add it:
      // if (!selectFields.includes(this.AAD_OBJECT_ID_FIELD)) {
      //   selectFields.push(this.AAD_OBJECT_ID_FIELD);
      // }

      const contacts = await d365Client.getContacts({
        select: selectFields,
        filter: `${this.AAD_OBJECT_ID_FIELD} eq '${azureAdObjectId}'`, // Corrected from 'filters' to 'filter'
        top: 1, // We expect at most one contact
      });

      if (contacts && contacts.length > 0) {
        const d365Contact = contacts[0];
        const appProfile: AppContactProfile = {
          contactId: d365Contact.contactid!, // Assuming contactid is always present
          firstName: d365Contact.firstname,
          lastName: d365Contact.lastname,
          email: d365Contact.emailaddress1, // Or another email field as appropriate
          roles: this.mapD365RolesToAppRoles(d365Contact[this.APP_ROLES_FIELD]), // Access roles field dynamically
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
      // or return null to indicate failure. The auth callback will handle null.
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
          console.warn(`D365ContactService: Unknown role string '${roleStr}' encountered from D365 field '${this.APP_ROLES_FIELD}'.`);
        }
      }
    }
    // Add other mapping logic here if roles are stored differently (e.g., OptionSet values, N:N related entities)
    // Example: If roles are stored as an array of numbers (OptionSet values)
    // else if (Array.isArray(d365RolesField)) { // Assuming d365RolesField is an array of option set values
    //   d365RolesField.forEach(roleValue => {
    //     if (roleValue === 100000000) mappedRoles.push(UserRole.ADMIN); // Example mapping for OptionSet value for Admin
    //     if (roleValue === 100000001) mappedRoles.push(UserRole.PARTNER); // Example mapping for OptionSet value for Partner
    //     // ... etc.
    //   });
    // }

    // If no roles are mapped, or if the field is empty/invalid, assign a default role.
    // This ensures every user has at least a basic role.
    if (mappedRoles.length === 0) {
      mappedRoles.push(UserRole.USER);
      console.log(`D365ContactService: No specific roles found or mapped from D365 field '${this.APP_ROLES_FIELD}', assigning default role: ${UserRole.USER}`);
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
      console.warn("D365ContactService.updateContactProfile is a placeholder and not yet implemented. Needs actual D365 client call.");
      return true; // Placeholder success
    } catch (error) {
      console.error(`D365ContactService: Error updating D365 Contact profile ${contactId}:`, error);
      return false;
    }
  }
}
