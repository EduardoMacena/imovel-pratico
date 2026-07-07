"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthToken } from "../lib/auth-storage";

export function useRequireAuth() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  return {
    isCheckingAuth,
  };
}
