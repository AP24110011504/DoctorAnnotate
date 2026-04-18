"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/lib/storage";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push("/");
    }
  }, [router]);

  return getLoggedInUser();
}

export function useAuthRequired() {
  const router = useRouter();

  useEffect(() => {
    const user = getLoggedInUser();
    if (!user) {
      router.push("/");
    }
  }, [router]);
}
