import { d365Client } from "@/lib/clients/d365Client"; // Your D365 client
import { UserRole } from "@/lib/auth"; // Assuming UserRole is exported from lib/auth.ts

export interface AppContactProfile {
  contactId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  roles: UserRole[]; // Application-specific roles from D365
  states?: string[]; // State assignments from D365 (e.g., ["arkansas", "tennessee"])
  // Add other relevant profile fields from D365 as needed
  // e.g., companyName?: string; phoneNumber?: string; jobTitle?: string;
}

export class D365ContactService {
  private static readonly AAD_OBJECT_ID_FIELD = process.env.DATAVERSE_CONTACT_AAD_OBJECT_ID_FIELD;
  private static readonly APP_ROLES_FIELD = process.env.DATAVERSE_CONTACT_APP_ROLES_FIELD;
  // Define D365 field names for updatable profile attributes
  // These should correspond to the logical names of the fields in your Contact entity
  private static readonly D365_FIRSTNAME_FIELD = "firstname";
  private static readonly D365_LASTNAME_FIELD = "lastname";
  private static readonly D365_EMAIL_FIELD = "emailaddress1";
  // Add other D365 field names here if you expand AppContactProfile for updates
  // private static readonly D365_JOBTITLE_FIELD = "jobtitle";


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
        this.D365_FIRSTNAME_FIELD, 
        this.D365_LASTNAME_FIELD, 
        this.D365_EMAIL_FIELD, 
        this.APP_ROLES_FIELD 
        // Add other fields like D365_JOBTITLE_FIELD if needed for the profile
      ];
      
      const contacts = await d365Client.getContacts({
        select: selectFields,
        filter: `${this.AAD_OBJECT_ID_FIELD} eq '${azureAdObjectId}'`, 
        top: 1, 
      });

      if (contacts && contacts.length > 0) {
        const d365Contact = contacts[0];
        const rolesAndStates = this.parseRolesAndStates(d365Contact[this.APP_ROLES_FIELD]);
        const appProfile: AppContactProfile = {
          contactId: d365Contact.contactid!, 
          firstName: d365Contact[this.D365_FIRSTNAME_FIELD],
          lastName: d365Contact[this.D365_LASTNAME_FIELD],
          email: d365Contact[this.D365_EMAIL_FIELD], 
          roles: rolesAndStates.roles,
          states: rolesAndStates.states,
          // jobTitle: d365Contact[this.D365_JOBTITLE_FIELD], // Example
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
   * Parses the combined roles and states field from D365.
   * Supports prefix notation: "role:admin,role:partner,state:arkansas"
   * Also supports legacy format for backward compatibility: "admin,partner"
   * 
   * @param d365RolesField The raw data from the D365 Contact's APP_ROLES_FIELD
   * @returns An object containing separated roles and states arrays
   */
  private static parseRolesAndStates(d365RolesField: any): { roles: UserRole[], states: string[] } {
    const result = { roles: [] as UserRole[], states: [] as string[] };
    
    if (!d365RolesField) {
      console.log(`D365ContactService: Roles field ('${this.APP_ROLES_FIELD}') is empty or null.`);
    } else if (typeof d365RolesField === 'string' && d365RolesField.trim().length > 0) {
      const values = d365RolesField.split(',').map(val => val.trim());
      
      for (const value of values) {
        // Handle prefixed values
        if (value.startsWith('role:')) {
          const role = value.substring(5).toLowerCase();
          if (Object.values(UserRole).includes(role as UserRole)) {
            result.roles.push(role as UserRole);
          } else {
            console.warn(`D365ContactService: Unknown role '${role}' in prefixed value '${value}'`);
          }
        } else if (value.startsWith('state:')) {
          const state = value.substring(6).toLowerCase();
          result.states.push(state);
          console.log(`D365ContactService: Found state assignment: ${state}`);
        }
        // Legacy support: unprefixed values are assumed to be roles
        else {
          const lowercaseValue = value.toLowerCase();
          if (Object.values(UserRole).includes(lowercaseValue as UserRole)) {
            result.roles.push(lowercaseValue as UserRole);
            console.log(`D365ContactService: Legacy role format detected: ${lowercaseValue}`);
          } else {
            console.warn(`D365ContactService: Unknown unprefixed value '${value}' - not a recognized role`);
          }
        }
      }
    } else {
      console.warn(`D365ContactService: Roles field ('${this.APP_ROLES_FIELD}') has unexpected type: ${typeof d365RolesField}`);
    }
    
    // Ensure default role if no roles found
    if (result.roles.length === 0) {
      result.roles.push(UserRole.USER);
      console.log(`D365ContactService: No specific roles found, assigning default role: ${UserRole.USER}`);
    }
    
    console.log(`D365ContactService: Parsed roles: ${result.roles.join(',')}, states: ${result.states.join(',') || 'none'}`);
    return result;
  }

  /**
   * DEPRECATED: Use parseRolesAndStates instead
   * Maps the role data retrieved from D365 to the application's UserRole enum.
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
   * Only updates fields that are provided in the data object.
   * 
   * @param contactId The D365 Contact ID.
   * @param data A partial AppContactProfile containing fields to update.
   * @returns A promise that resolves to true if successful, false otherwise.
   */
  static async updateContactProfile(contactId: string, data: Partial<Omit<AppContactProfile, 'contactId' | 'roles'>>): Promise<boolean> {
    console.log(`D365ContactService: Updating D365 Contact ${contactId} with data:`, data);
    try {
      const d365UpdateData: Record<string, any> = {};

      if (data.firstName !== undefined) d365UpdateData[this.D365_FIRSTNAME_FIELD] = data.firstName;
      if (data.lastName !== undefined) d365UpdateData[this.D365_LASTNAME_FIELD] = data.lastName;
      if (data.email !== undefined) d365UpdateData[this.D365_EMAIL_FIELD] = data.email;
      // Add other fields from AppContactProfile to d365UpdateData as needed
      // For example, if you add jobTitle to AppContactProfile and want to update it:
      // if (data.jobTitle !== undefined) d365UpdateData[this.D365_JOBTITLE_FIELD] = data.jobTitle;

      // Do not proceed if there's nothing to update
      if (Object.keys(d365UpdateData).length === 0) {
        console.log(`D365ContactService: No fields to update for contact ${contactId}.`);
        return true; // Or false, depending on desired behavior for no-op
      }

      await d365Client.updateContact(contactId, d365UpdateData);
      console.log(`D365ContactService: Successfully updated contact ${contactId}.`);
      return true; 
    } catch (error) {
      console.error(`D365ContactService: Error updating D365 Contact profile ${contactId}:`, error);
      return false;
    }
  }
}
