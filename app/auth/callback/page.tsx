"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

const AuthCallback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      // 🔥 handle cancel
      if (error === "access_denied") {
        toast.info("Google login was cancelled");
      } else {
        toast.error("Google login failed");
      }

      router.replace("/login");
      return;
    }

    // cookies are already set by backend

    toast.success("Login successful");

    // redirect to dashboard
    router.replace("/dashboard");
    router.refresh(); // important for middleware
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-gray-500">Signing you in...</p>
    </div>
  );
};

export default AuthCallback;
