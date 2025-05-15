"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/app/login/_internal/stores/auth-store";
import { LoginForm } from "@/app/login/_internal/components";
import Logo from "@/public/logo/logo";
import {Background} from "comp";

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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Background/>
      <LoginForm />
    </div>
  );
}
