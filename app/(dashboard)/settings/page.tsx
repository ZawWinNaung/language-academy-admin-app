"use client";

import React from "react";
import HeaderBar from "@/components/ui/HeaderBar";
import AdminProfileCard from "@/components/admin/AdminProfileCard";
import AdminPasswordCard from "@/components/admin/AdminPasswordCard";
import AdminInviteCard from "@/components/admin/AdminInviteCard";
import { useAdminProfile } from "@/hooks/admin/useAdminProfile";
import { useAdminPassword } from "@/hooks/admin/useAdminPassword";
import { useAdminInvite } from "@/hooks/admin/useAdminInvite";

export default function AdminSettingsPage() {
  const {
    formData: profileData,
    setFormData: setProfileData,
    loading: profileLoading,
    updating: updatingProfile,
    message: profileMessage,
    setMessage: setProfileMessage,
    handleUpdate: handleUpdateProfile,
  } = useAdminProfile();

  const {
    formData: passwordData,
    setFormData: setPasswordData,
    updating: updatingPassword,
    message: passwordMessage,
    setMessage: setPasswordMessage,
    handleUpdate: handleUpdatePassword,
  } = useAdminPassword();

  const {
    formData: inviteData,
    setFormData: setInviteData,
    updating: updatingInvite,
    message: inviteMessage,
    setMessage: setInviteMessage,
    handleInvite,
  } = useAdminInvite();

  if (profileLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <HeaderBar
          title="Admin Settings"
          description="Manage your account credentials and personal details."
        />
        <div className="glass-card p-12 text-center text-text-muted text-xs">
          Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <HeaderBar
        title="Admin Settings"
        description="Manage your account credentials and personal details."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <AdminProfileCard
          profileData={profileData}
          setProfileData={setProfileData}
          updating={updatingProfile}
          message={profileMessage}
          setMessage={setProfileMessage}
          onSubmit={handleUpdateProfile}
        />

        <AdminPasswordCard
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          updating={updatingPassword}
          message={passwordMessage}
          setMessage={setPasswordMessage}
          onSubmit={handleUpdatePassword}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <AdminInviteCard
          inviteData={inviteData}
          setInviteData={setInviteData}
          updating={updatingInvite}
          message={inviteMessage}
          setMessage={setInviteMessage}
          onSubmit={handleInvite}
        />
      </div>
    </div>
  );
}
