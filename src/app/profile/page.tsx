"use client";
import ProfileSection from "@/components/ProfileSection";
import ProtectedRoute from "@/components/ProtectedRoute";
import {  Progress } from "@nextui-org/progress";
import React from "react";

const Profile = () => {
  return (
    <ProtectedRoute>
      <section className="min-h-screen py-10 lg:py-20 relative">
        <div className="max-w-[1300px] mx-auto">
          <ProfileSection />
        </div>
      </section>
    </ProtectedRoute>
  );
};

export default Profile;
