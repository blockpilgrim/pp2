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
      return null;
    }

    console.log(`D365ContactService: Attempting to fetch contact for Azure AD OID: ${azureAdObjectId} using AAD field '${this.AAD_OBJECT_ID_FIELD}' and roles field '${this.APP_ROLES_FIELD}'`);
    
    try {
      const selectFields = [
        "contactid", 
        "firstname", 
        "lastname", 
        "emailaddress1", 
        this.APP_ROLES_FIELD 
      ];
      
      const contacts = await d365Client.getContacts({
        select: selectFields,
        filter: `${this.AAD_OBJECT_ID_FIELD} eq '${azureAdObjectId}'`, 
        top: 1, 
      });

      if (contacts && contacts.length > 0) {
        const d365Contact = contacts[0];
        const appProfile: AppContactProfile = {
          contactId: d365Contact.contactid!, 
          firstName: d365Contact.firstname,
          lastName: d365Contact.lastname,
          email: d365Contact.emailaddress1, 
          roles: this.mapD365RolesToAppRoles(d365Contact[this.APP_ROLES_FIELD]), 
        };
        console.log(`D365ContactService: Found contact profile for AAD OID ${azureAdObjectId}:`, appProfile);
        return appProfile;
      } else {
        console.log(`D365ContactService: No contact found for Azure AD OID: ${azureAdObjectId}`);
        return null;
      }
    } catch (error) {
      console.error(`D365ContactService: Error fetching D365 Contact by Azure AD Object ID ${azureAdObjectId}:`, error);
      return null;
    }
  }

  /**
   * Maps the role data retrieved from D365 to the application's UserRole enum.
   * **ACTION REQUIRED: You MUST adapt this method based on how roles are stored in your D365 APP_ROLES_FIELD.**
   * 
   * @param d365RolesField The raw role data from the D365 Contact record's APP_ROLES_FIELD.
   * @returns An array of UserRole.
   */
  private static mapD365RolesToAppRoles(d365RolesField: any): UserRole[] {
    const mappedRoles: UserRole[] = [];

    if (!d365RolesField) {
      console.log(`D365ContactService: Roles field ('${this.APP_ROLES_FIELD}') is empty or null.`);
      // Fall through to assign default role if no specific roles are found.
    }
    // Example 1: Roles are stored as a comma-separated string (e.g., "admin,partner")
    else if (typeof d365RolesField === 'string') {
      if (d365RolesField.trim().length > 0) {
        const roleStrings = d365RolesField.split(',').map(roleStr => roleStr.trim().toLowerCase());
        for (const roleStr of roleStrings) {
          if (Object.values(UserRole).includes(roleStr as UserRole)) {
            mappedRoles.push(roleStr as UserRole);
          } else {
            console.warn(`D365ContactService: Unknown role string '${roleStr}' encountered from D365 field '${this.APP_ROLES_FIELD}'.`);
          }
        }
      }
    }
    // Example 2: Roles are stored as a single OptionSet value (Choice) - numeric
    // else if (typeof d365RolesField === 'number') {
    //   // Replace these numeric values with the actual OptionSet values from your D365 environment
    //   const D365_ADMIN_ROLE_VALUE = 100000000; // Example value for Admin
    //   const D365_PARTNER_ROLE_VALUE = 100000001; // Example value for Partner
    //   const D365_USER_ROLE_VALUE = 100000002;   // Example value for User
    //
    //   if (d365RolesField === D365_ADMIN_ROLE_VALUE) {
    //     mappedRoles.push(UserRole.ADMIN);
    //   } else if (d365RolesField === D365_PARTNER_ROLE_VALUE) {
    //     mappedRoles.push(UserRole.PARTNER);
    //   } else if (d365RolesField === D365_USER_ROLE_VALUE) {
    //     mappedRoles.push(UserRole.USER);
    //   } else {
    //     console.warn(`D365ContactService: Unknown role OptionSet value '${d365RolesField}' encountered.`);
    //   }
    // }
    // Example 3: Roles are stored as a Multi-Select OptionSet (Choices) - array of numbers
    // else if (Array.isArray(d365RolesField) && d365RolesField.every(item => typeof item === 'number')) {
    //   // Replace these numeric values with the actual OptionSet values from your D365 environment
    //   const D365_ADMIN_ROLE_VALUE = 100000000; // Example value for Admin
    //   const D365_PARTNER_ROLE_VALUE = 100000001; // Example value for Partner
    //   const D365_USER_ROLE_VALUE = 100000002;   // Example value for User
    //
    //   d365RolesField.forEach(roleValue => {
    //     if (roleValue === D365_ADMIN_ROLE_VALUE) {
    //       mappedRoles.push(UserRole.ADMIN);
    //     } else if (roleValue === D365_PARTNER_ROLE_VALUE) {
    //       mappedRoles.push(UserRole.PARTNER);
    //     } else if (roleValue === D365_USER_ROLE_VALUE) {
    //       mappedRoles.push(UserRole.USER);
    //     } else {
    //       console.warn(`D365ContactService: Unknown role Multi-Select OptionSet value '${roleValue}' encountered.`);
    //     }
    //   });
    // }
    else {
      console.warn(`D365ContactService: Roles field ('${this.APP_ROLES_FIELD}') has an unexpected data type: ${typeof d365RolesField}. Value:`, d365RolesField);
    }

    // If no roles are mapped after attempting to parse, assign a default role.
    if (mappedRoles.length === 0) {
      mappedRoles.push(UserRole.USER);
      console.log(`D365ContactService: No specific roles were successfully mapped from D365 field '${this.APP_ROLES_FIELD}', assigning default role: ${UserRole.USER}`);
    }
    
    return mappedRoles;
  }

  /**
   * Updates a Contact's profile in D365.
   * Placeholder for actual implementation.
   */
  static async updateContactProfile(contactId: string, data: Partial<AppContactProfile>): Promise<boolean> {
    console.log(`D365ContactService: Updating D365 Contact ${contactId} with data:`, data);
    try {
      const d365UpdateData: any = {};
      if (data.firstName !== undefined) d365UpdateData.firstname = data.firstName;
      if (data.lastName !== undefined) d365UpdateData.lastname = data.lastName;
      // Add other fields from AppContactProfile to d365UpdateData as needed
      // For example, if you add companyName to AppContactProfile and want to update it:
      // if (data.companyName !== undefined) d365UpdateData.yourd365fieldforcompanyname = data.companyName;

      await d365Client.updateContact(contactId, d365UpdateData);
      console.log(`D365ContactService: Successfully updated contact ${contactId}.`);
      return true; 
    } catch (error) {
      console.error(`D365ContactService: Error updating D365 Contact profile ${contactId}:`, error);
      return false;
    }
  }
}
