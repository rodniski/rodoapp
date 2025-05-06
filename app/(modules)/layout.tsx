"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/app/login/_lib/stores/auth-store";
import { getAuthState } from "utils";

export default function ModulesLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("ModulesLayout:", { isAuthenticated, isLoading, pathname, authState: getAuthState() });
    if (!isLoading) {
      if (!isAuthenticated) {
        const redirectTo = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : "/login";
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}