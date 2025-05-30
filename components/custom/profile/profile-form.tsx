"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form/form";
import { Pencil, Save, X } from "lucide-react";

// Form validation schema
const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string()
    .regex(/^[\d\s\-\(\)\+\.]*$/, "Invalid phone number format")
    .max(25, "Phone number too long")
    .optional()
    .or(z.literal("")),
  portalRolesRaw: z.string()
    .regex(
      /^((role:\w+|state:\w+)(,(role:\w+|state:\w+))*)?$/,
      "Invalid format. Use: role:name,state:name (e.g., role:admin,state:arkansas)"
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
  initialData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    portalRolesRaw?: string;
    isD365User?: boolean;
  };
  onUpdateSuccess?: () => void;
}

export function ProfileForm({ initialData, onUpdateSuccess }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      email: initialData.email || "",
      phoneNumber: initialData.phoneNumber || "",
      portalRolesRaw: initialData.portalRolesRaw || "",
    },
  });

  // Reset form when initialData changes
  useEffect(() => {
    form.reset({
      firstName: initialData.firstName || "",
      lastName: initialData.lastName || "",
      email: initialData.email || "",
      phoneNumber: initialData.phoneNumber || "",
      portalRolesRaw: initialData.portalRolesRaw || "",
    });
  }, [initialData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);
    setInfoMessage(null);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      // Update the session to reflect changes
      await update();
      
      setSuccess(true);
      setIsEditing(false);
      
      // Check if roles or states were changed
      const rolesOrStatesChanged = data.portalRolesRaw !== initialData.portalRolesRaw;
      
      // Call the success callback to refresh data
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      
      // Show special message if roles/states were changed
      if (rolesOrStatesChanged) {
        setSuccess(false); // Clear generic success message
        setInfoMessage("Role/state changes saved. Please sign out and back in to apply theme and permission changes.");
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
    setError(null);
    setSuccess(false);
    setInfoMessage(null);
  };

  if (!initialData.isD365User) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your profile is not linked to Dynamics 365. Contact support if you need access.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <> {/* Wrap in a Fragment to return multiple Card elements */}
      <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your personal information and portal access
            </CardDescription>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="mb-4">
            <AlertDescription>Profile updated successfully!</AlertDescription>
          </Alert>
        )}
        
        {infoMessage && (
          <Alert className="mb-4">
            <AlertDescription className="flex items-center justify-between">
              <span>{infoMessage}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="(555) 123-4567" disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portalRolesRaw"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portal Roles & State Assignment</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      disabled={!isEditing}
                      rows={3}
                      placeholder="role:admin,state:arkansas"
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription className="mt-1.5">
                    Format: "role:name,state:name" (no quotes)
                  </FormDescription>
                  <FormDescription className="mt-1.5">  
                    Available Roles: user, partner, admin
                  </FormDescription>
                  <FormDescription className="mt-1.5">
                    Available States: Oregon, Arkansas, Kentucky
                  </FormDescription>
                  <FormDescription className="mt-1.5">
                    Note: Changing roles or states requires signing out and back in
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How Your Profile Works</CardTitle>
          <CardDescription>
            A quick look at how your portal access, roles, and state-specific features work.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Your Sign-In & D365 Connection</h3>
            <p className="text-sm text-muted-foreground">
              You sign in to this portal using your Microsoft Entra ID (Azure AD) account. Once you&apos;re in, the portal uses your Azure AD Object ID to find your profile in Dynamics 365. This connection lets us grab your profile details, portal roles, and any state-specific settings that dictate your theme and access to features.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Your Azure AD Object ID is saved in the <code>Microsoft Entra ID</code> field in your D365 Contact record (logical name: <code>msevtmgt_aadobjectid</code>). This ID is what links your portal account to your D365 info.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Portal Roles & State Settings</h3>
            <p className="text-sm text-muted-foreground">
              Your portal roles (like User, Partner, or Admin) and any state assignments (like Arkansas or Oregon) are managed in one text field in your D365 Contact record. Note: A text field was used for <strong>POC testing purposes only</strong>. The values in this field can change your theme or what features you see.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This D365 field (display name: <code>Portal Role(s)</code>, logical name: <code>crda6_portalroles</code>) uses a comma-separated string with prefixes to store this info. For example:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 pl-5 space-y-1">
              <li><code>role:partner,state:arkansas,role:user</code></li>
              <li>This means the user is a &apos;Partner&apos;, linked to &apos;Arkansas&apos;, and also a general &apos;User&apos;.</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              The &apos;Portal Roles & State Assignment&apos; field in the form above lets you see and edit this D365 setting.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Guide: Adding or Updating Users</h3>
            <p className="text-sm text-muted-foreground">
              To add a new user or change someone&apos;s access, here’s what to do:
            </p>
            <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-2 pl-5">
              <li>
                <strong>Get Azure AD Object ID:</strong>
                <br />
                Go to the Microsoft Entra ID (Azure AD) admin center. Find the user and copy their Object ID (sometimes called &apos;oid&apos;).
              </li>
              <li>
                <strong>Update D365 Contact:</strong>
                <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                  <li>In Dynamics 365, find or create the user&apos;s Contact record.</li>
                  <li>
                    Paste their Azure AD Object ID into the <code>Microsoft Entra ID</code> field (logical name: <code>msevtmgt_aadobjectid</code>).
                  </li>
                  <li>
                    Then, in the <code>Portal Role(s)</code> field (logical name: <code>crda6_portalroles</code>), type in their roles and states using the format: <code>role:admin,state:arkansas</code>.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Sign In:</strong>
                <br />
                The user can now sign in with their Microsoft Entra ID. The portal will automatically pick up their new settings from D365.
              </li>
            </ol>
            <p className="text-sm text-muted-foreground mt-3">
              <strong>Heads up:</strong> If roles or states change (in D365 or here), the user needs to sign out and back in for everything (like themes and permissions) to update correctly.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}