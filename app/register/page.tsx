"use client";

import AuthNavbar from "@/components/AuthNavbar";
import { axiosClient } from "@/lib/api/axiosClient";
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
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const passwordStrengthRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&()[\]{}|\\/'"`~#^+=._-])[A-Za-z\d@$!%*?&()[\]{}|\\/'"`~#^+=._-]{8,}$/;

const Register = () => {
  const passwordRef = useRef("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; // prevent double submit

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = (formData.get("password") as string)?.trim();
    const confirmPassword = (formData.get("confirmPassword") as string)?.trim();

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/register", {
        email: email,
        password: password,
        name: name,
      });

      const data = res.data;

      toast.success(data.message);
      router.push("/verify-your-account");
    } catch (error: any) {
      const message =
        error?.response?.data?.message?.message || // nested NestJS
        error?.response?.data?.message ||
        error?.response?.data?.code || // fallback if only code exists
        error?.message ||
        "Registration failed";

      if (error?.response?.data?.code == "AUTH_303") {
        toast.info("Please Verify Your Email");
        return router.push("/verify-your-account");
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthNavbar />

      <div className="py-20 px-4 flex items-center justify-center">
        <Surface className="w-full max-w-md bg-white rounded-2xl p-8 space-y-6 shadow-lg">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="mt-2 text-sm text-gray-500">Sign up to get started</p>
          </div>

          {/* Form */}
          <Form
            method="post"
            className="w-full space-y-4"
            onSubmit={handleSubmit}
          >
            {/* Name */}
            <TextField isRequired name="name" className="space-y-1">
              <Label>Name</Label>
              <Input
                placeholder="John Doe"
                className="bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <FieldError />
            </TextField>

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
              className="space-y-1"
              validate={(value) => {
                passwordRef.current = value;

                if (!passwordStrengthRegex.test(value)) {
                  return "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol";
                }
                return null;
              }}
            >
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <FieldError />
            </TextField>

            {/* Confirm Password */}
            <TextField
              isRequired
              name="confirmPassword"
              className="space-y-1"
              validate={(value) => {
                if (value !== passwordRef.current) {
                  return "Passwords do not match";
                }
                return null;
              }}
            >
              <Label>Confirm Password</Label>
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
                  {isPending ? <Spinner color="current" size="sm" /> : null}
                  {isPending ? "Creating..." : "Create account"}
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

          {/* Google Sign In */}
          <Link
            href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/login`}
          >
            <Button className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black hover:bg-gray-50">
              <Icon icon="logos:google-icon" width="256" height="262" />
              Continue with Google
            </Button>
          </Link>

          {/* Login link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </Surface>
      </div>
    </div>
  );
};

export default Register;
