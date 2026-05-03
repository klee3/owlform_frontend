"use client";

import { axiosClient } from "@/lib/api/axiosClient";
import { useSessionStore } from "@/store/session.store";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  className?: string;
  variant?:
    | "primary"
    | "danger"
    | "danger-soft"
    | "ghost"
    | "outline"
    | "secondary"
    | "tertiary"
    | undefined;
};

const LogoutButton = ({ className, variant = "danger" }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await axiosClient.post("/auth/logout");
      useSessionStore.getState().clear();
    } catch (err) {
      // swallow errors (important)
    } finally {
      toast.success("Logged out");

      router.replace("/login");
      router.refresh(); // ensures middleware re-evaluates immediately
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      isPending={loading}
      className={className}
    >
      {loading ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;
