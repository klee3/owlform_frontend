"use client";

import { axiosClient } from "@/lib/api/axiosClient";
import { Button, Card } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const VerifyYourAccount = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await axiosClient.get("/auth/verification-status", {
          withCredentials: true,
        });

        const status = res.data.status;

        if (status === "NO_SESSION") {
          router.replace("/login");
        }

        if (status === "VERIFIED") {
          router.replace("/dashboard");
        }

        // if PENDING → stay here
      } catch {
        router.replace("/login");
      }
    };

    checkStatus();
  }, [router]);

  const handleResend = async () => {
    try {
      setLoading(true);

      const res = await axiosClient.post(
        "/auth/resend-verification",
        {},
        {
          withCredentials: true, // IMPORTANT for cookies
        },
      );

      toast.success(res.data.message || "Verification email sent!");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-md shadow-xl border border-slate-200">
        <Card.Content className="flex flex-col items-center text-center gap-5 p-8">
          {/* Icon */}
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <Icon
              icon="lucide:mail-check"
              width="24"
              height="24"
              className="text-green-600"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-slate-800">
            Check your email
          </h1>

          {/* Message */}
          <p className="text-slate-600 text-sm leading-relaxed">
            We’ve sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </p>

          {/* Hint */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
            Didn’t receive the email? Check your spam folder or try resending.
          </div>

          {/* Button */}
          <Button
            variant="primary"
            className="w-full"
            onClick={handleResend}
            // disabled={loading}
            isPending={loading}
          >
            {loading ? "Sending..." : "Resend Email"}
          </Button>

          {/* Footer */}
          <p className="text-xs text-slate-400 mt-2">
            You can close this page after verification.
          </p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default VerifyYourAccount;
