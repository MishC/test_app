"use client";

import { api } from "@/convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const redirect = useQuery(
    api.users.getPostAuthRedirect,
    isAuthenticated ? {} : "skip",
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/sign-in");
      return;
    }

    if (redirect?.redirectTo) {
      router.replace(redirect.redirectTo);
    }
  }, [isAuthenticated, isLoading, redirect?.redirectTo, router]);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-sm text-muted-foreground">Redirecting...</p>
    </div>
  );
}
