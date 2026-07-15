"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthToken, getAuthUser } from "../lib/auth-storage";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const user = getAuthUser();
    const precisaTrocarSenha = user?.precisaTrocarSenha === true;
    const estaNaTelaDeTrocaSenha = pathname === "/trocar-senha";

    if (precisaTrocarSenha && !estaNaTelaDeTrocaSenha) {
      router.replace("/trocar-senha");
      return;
    }

    setIsCheckingAuth(false);
  }, [pathname, router]);

  return {
    isCheckingAuth,
  };
}