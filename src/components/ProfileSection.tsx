"use client";
import ProfileCard from "./ProfileCard";
import BlogsFetch from "./BlogsFetch";
import { useMarkdownStore } from "@/store/useStore";
import React from "react";
import { DocumentData } from "firebase/firestore";
import { getUserBlogsFromDb } from "../../server/dbMethods";

const ProfileSection = () => {
  const user = useMarkdownStore((state) => state.user);
  const [lastDoc, setLastDoc] = React.useState<DocumentData | undefined>(
    undefined,
  );

  return (
    <div className="flex flex-col lg:flex-row justify-center lg:justify-start gap-5 lg:gap-10 px-5">
      <ProfileCard user={user} />
      <BlogsFetch
        qKey={["blogs", user?.uid]}
        queryFunction={() => getUserBlogsFromDb(user?.uid, lastDoc)}
        userId={user.uid as string}
        setLastDoc={setLastDoc}
        filter={{
          filterName: "userId",
          operator: "==",
          value: user.uid as string,
        }}
      />
    </div>
  );
};

export default ProfileSection;
