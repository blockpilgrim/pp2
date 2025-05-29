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
                  <FormLabel>Portal Access</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      disabled={!isEditing}
                      rows={3}
                      placeholder="role:admin,state:arkansas"
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    Format: role:name,state:name. Roles: user, partner, admin. 
                    Note: Changing roles or states requires signing out and back in.
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
  );
}