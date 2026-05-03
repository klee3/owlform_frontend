"use client";

import AuthNavbar from "@/components/AuthNavbar";
import { axiosClient } from "@/lib/api/axiosClient";
import { useSessionStore } from "@/store/session.store";
import {
  Button,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  Surface,
  TextField,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const formData = new FormData(e.currentTarget);

    const email = (formData.get("email") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    setLoading(true);

    try {
      const res = await axiosClient.post(
        "/auth/login",
        { email, password },
        {
          withCredentials: true, // IMPORTANT
        },
      );
      await useSessionStore.getState().hydrate();

      toast.success(res.data.message || "Login successful");

      // redirect after login
      router.push("/dashboard");
    } catch (error: any) {
      const code = error?.response?.data?.code;
      const message =
        error?.response?.data?.message?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      // Handle unverified email case
      if (code === "AUTH_102") {
        toast.info("Please verify your email first");
        return router.push("/verify-your-account");
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 px-4 flex items-center justify-center">
      <AuthNavbar />
      <Surface className="w-full max-w-md bg-white rounded-2xl p-8 space-y-6 shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
        </div>

        {/* Form */}
        <Form
          className="w-full space-y-4"
          method="post"
          onSubmit={handleSubmit}
        >
          {/* Email */}
          <TextField
            isRequired
            name="email"
            type="email"
            className="space-y-1"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Please enter a valid email address";
              }
              return null;
            }}
          >
            <Label>Email</Label>
            <Input
              placeholder="john@example.com"
              className="bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <FieldError />
          </TextField>

          {/* Password */}
          <TextField
            isRequired
            name="password"
            type="password"
            className="space-y-1"
          >
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <FieldError />
          </TextField>

          {/* Submit */}
          <Button
            type="submit"
            isPending={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {({ isPending }) => (
              <>
                {isPending ? <Spinner size="sm" /> : null}
                {isPending ? "Signing in..." : "Sign in"}
              </>
            )}
          </Button>
        </Form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        {/* Google login */}
        <Link
          href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/login`}
        >
          <Button className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-50">
            <Icon icon="logos:google-icon" width="256" height="262" />
            Continue with Google
          </Button>
        </Link>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </Surface>
    </div>
  );
};

export default Login;
