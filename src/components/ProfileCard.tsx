import { Skeleton } from "@nextui-org/skeleton";
import Image from "next/image";
import React from "react";
import Spotlight, { SpotlightCard } from "./SpotLight";

type User = {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

const ProfileCard = ({ user }: { user: User }) => {
  return (
    <Spotlight className="h-fit">
      <SpotlightCard className="min-w-80 h-fit text-white rounded-xl px-4 py-8 text-center lg:sticky lg:top-20">
        {!user.uid ? (
          <Skeleton className="rounded-lg h-fit min-w-80">
            <div className="w-24 h-24 rounded-full object-cover mx-auto mb-5"></div>
            <div className="w-40 h-10 mb-3"></div>
            <div className="w-40"></div>
          </Skeleton>
        ) : (
          <div className="">
            <Image
              className="w-24 h-24 rounded-full object-cover mx-auto mb-5"
              src={user.photoURL || ""}
              alt={user.displayName || ""}
              width={96}
              height={96}
              quality={100}
            />
            <h2 className="text-xl lg:text-4xl mb-3">
              {user.displayName || ""}
            </h2>
            <p className="text-sm lg:text-lg">{user.email || ""}</p>
          </div>
        )}
      </SpotlightCard>
    </Spotlight>
  );
};

export default ProfileCard;
