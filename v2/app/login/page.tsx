"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/login/_lib/stores/auth-store";
import { LoginForm } from "@/app/login/_lib/components";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    console.log("LoginPage state:", { isAuthenticated, isLoading, redirect }); // Debug
    if (!isLoading && isAuthenticated) {
      router.push(decodeURIComponent(redirect));
    }
  }, [isAuthenticated, isLoading, router, redirect]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}