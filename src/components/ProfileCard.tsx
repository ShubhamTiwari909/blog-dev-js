import { useMarkdownStore } from "@/store/useStore";
import Image from "next/image";
import React from "react";

type User = {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

const ProfileCard = ({ user }: { user: User }) => {
  return (
    <div className="min-w-80 h-fit bg-slate-100 text-blue-700 rounded-xl px-4 py-8 text-center lg:sticky lg:top-20">
      <Image
        className="w-24 h-24 rounded-full object-cover mx-auto mb-5"
        src={user.photoURL || ""}
        alt={user.displayName || ""}
        width={96}
        height={96}
        quality={100}
      />
      <h2 className="text-xl lg:text-4xl mb-3">{user.displayName || ""}</h2>
      <p className="text-sm lg:text-lg">{user.email || ""}</p>
    </div>
  );
};

export default ProfileCard;
