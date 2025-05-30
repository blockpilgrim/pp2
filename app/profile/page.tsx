import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfilePageContent } from "@/components/custom/profile/profile-page-content";
import { PageContainer } from "@/components/layouts";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Prepare profile data from session
  const profileData = {
    firstName: session.user.d365Profile?.firstName || session.user.name?.split(' ')[0] || "",
    lastName: session.user.d365Profile?.lastName || session.user.name?.split(' ').slice(1).join(' ') || "",
    email: session.user.email || "",
    phoneNumber: session.user.phoneNumber || "",
    portalRolesRaw: session.user.portalRolesRaw || "",
    isD365User: session.user.isD365User || false,
    roles: session.user.roles,
    states: session.user.states,
  };

  return (
    <PageContainer
      title="My Profile"
      description="View and manage your account information"
    >
      <ProfilePageContent 
        initialData={profileData}
        sessionError={session.error}
      />
    </PageContainer>
  );
}