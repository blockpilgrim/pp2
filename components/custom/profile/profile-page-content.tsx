"use client";

import { useState, useEffect } from "react";
import { ProfileForm } from "./profile-form";
import { ProfileStatus } from "./profile-status";
import { ProfileSkeleton } from "./profile-skeleton";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  portalRolesRaw?: string;
  isD365User?: boolean;
  roles?: string[];
  states?: string[];
}

interface ProfilePageContentProps {
  initialData: ProfileData;
  sessionError?: string;
}

export function ProfilePageContent({ initialData, sessionError }: ProfilePageContentProps) {
  const [profileData, setProfileData] = useState<ProfileData>(initialData);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state

  // Function to fetch fresh profile data
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Always fetch fresh data on mount to bypass session cache
  // This ensures we always show the latest D365 data, even after browser refresh
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Callback for when profile is successfully updated
  const handleProfileUpdate = () => {
    // Fetch fresh data after successful update
    fetchProfileData();
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Refresh button */}
      {!isLoading && (
        <div className="flex justify-end">
          <button
            onClick={fetchProfileData}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            title="Refresh profile data from Dynamics 365"
          >
            ↻ Refresh
          </button>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Profile Form - Takes 2 columns on desktop */}
        <div className="md:col-span-2">
          <ProfileForm 
            initialData={profileData} 
            onUpdateSuccess={handleProfileUpdate}
          />
        </div>

        {/* Status Card - Takes 1 column on desktop */}
        <div>
          <ProfileStatus
            isD365User={profileData.isD365User}
            states={profileData.states}
            roles={profileData.roles}
            error={sessionError}
          />
        </div>
      </div>
    </div>
  );
}