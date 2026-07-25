"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthToken, getAuthUser, removeAuthToken } from "../lib/auth-storage";

export function useRequireSuperAdmin() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const user = getAuthUser();

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "SUPER_ADMIN") {
      removeAuthToken();
      router.replace("/login");
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  return {
    isCheckingAuth,
  };
}
