import { useMarkdownStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import React, { useLayoutEffect } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useMarkdownStore((state) => state.user);

  const router = useRouter();

  useLayoutEffect(() => {
    if (user.uid === null) {
      // If user is null, it indicates initial loading or no user is logged in
      // No need to redirect yet
      return;
    }

    if (!user?.uid) {
      // Redirect to homepage if there is no user or user has no uid
      router.push("/");
    }
  }, [user]);

  return <>{children}</>;
};

export default ProtectedRoute;
