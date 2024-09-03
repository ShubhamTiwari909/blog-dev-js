"use client";
import ProfileCard from "./ProfileCard";
import BlogsFetch from "./BlogsFetch";
import { useMarkdownStore } from "@/store/useStore";

const ProfileSection = () => {
  const user = useMarkdownStore((state) => state.user);

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:justify-start gap-5 lg:gap-10 px-5">
      <ProfileCard user={user} />
      <BlogsFetch userId={user.uid as string} />
    </div>
  );
};

export default ProfileSection;
