"use client";

import { axiosClient } from "@/lib/api/axiosClient";
import { useSessionStore } from "@/store/session.store";
import { Spinner } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";

const VerifyEmailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const tokenId = searchParams.get("tokenId");

  useEffect(() => {
    const verify = async () => {
      if (!token || !tokenId) {
        toast.error("Invalid verification link");
        return router.replace("/login");
      }

      try {
        const res = await axiosClient.post(
          "/auth/verify-email",
          {
            token,
            tokenId,
          },
          {
            withCredentials: true, // important for auth cookies
          },
        );
        await useSessionStore.getState().hydrate();

        toast.success(res.data.message || "Email verified!");

        // redirect to dashboard
        setTimeout(() => {
          router.replace("/dashboard");
        }, 1500);
      } catch (error: any) {
        const message =
          error?.response?.data?.message?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Verification failed";

        toast.error(message);

        // redirect to resend page
        setTimeout(() => {
          router.replace("/verify-your-account");
        }, 2000);
      }
    };

    verify();
  }, [token, tokenId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-gray-600 text-sm">Verifying your email...</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
