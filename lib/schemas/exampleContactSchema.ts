/**
 * @file Zod schema for an example contact form.
 *
 * This schema defines the validation rules for a simple contact form.
 * It can be used with `react-hook-form` and `@hookform/resolvers/zod`
 * for client-side form validation. Refer to `components/custom/form/form-example.tsx`
 * for an example of this pattern.
 *
 * **Important Reminder:** While Zod is used for client-side validation to provide
 * immediate feedback and improve user experience, server-side validation remains
 * the authoritative source of truth for data integrity and security. Always
 * ensure that any data submitted to the server is also validated on the server-side
 * according to the project guidelines.
 */
import { z } from 'zod';

/**
 * @typedef {object} ExampleContactFormValues
 * @property {string} name - The name of the contact person.
 * @property {string} email - The email address of the contact person.
 * @property {string} message - The message content from the contact person.
 */

/**
 * Zod schema for validating an example contact form.
 */
export const exampleContactSchema = z.object({
  /**
   * The name of the person submitting the form.
   * Must be between 2 and 50 characters.
   */
  name: z.string().min(2, { message: "Name must be at least 2 characters long." }).max(50, { message: "Name cannot exceed 50 characters." }),
  /**
   * The email address of the person submitting the form.
   * Must be a valid email format.
   */
  email: z.string().email({ message: "Invalid email address." }),
  /**
   * The message content.
   * Must be between 10 and 500 characters.
   */
  message: z.string().min(10, { message: "Message must be at least 10 characters long." }).max(500, { message: "Message cannot exceed 500 characters." }),
});

/**
 * Inferred TypeScript type from the exampleContactSchema.
 * Represents the structure of the form values.
 */
export type ExampleContactFormValues = z.infer<typeof exampleContactSchema>;
