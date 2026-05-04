"use client";

import { axiosClient } from "@/lib/api/axiosClient";
import { useSessionStore } from "@/store/session.store";
// import { ArrowRightFromSquare, Gear, Persons } from "@gravity-ui/icons";

import { Avatar, Dropdown, Label } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const AppNavbar = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { user } = useSessionStore();

  const handleLogout = async () => {
    if (loading) return;

    try {
      setLoading(true);
      await axiosClient.post("/auth/logout");
      useSessionStore.getState().clear();
      toast.success("Logged out");
    } catch {
      // swallow error (logout should always succeed)
    } finally {
      router.replace("/login");
      router.refresh();
      setLoading(false);
    }
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div className="w-full h-14 border-b bg-white flex items-center justify-between px-4">
      {/* Left - App Name */}
      <div className="font-bold text-lg">
        <Link href="/dashboard">Dashboard</Link>
      </div>

      {/* Right - Profile Dropdown */}
      <Dropdown>
        <Dropdown.Trigger className="rounded-full cursor-pointer">
          <Avatar>
            <Avatar.Fallback>{initial}</Avatar.Fallback>
          </Avatar>
        </Dropdown.Trigger>

        <Dropdown.Popover className="rounded-2xl">
          {/* User Info Header */}
          <div className="px-3 pt-3 pb-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <p className="text-sm font-medium leading-5">{user?.name}</p>
                <p className="text-xs text-muted leading-none">{user?.email}</p>
              </div>
            </div>

            {/* Active Organization Indicator */}
            <div className="mt-3 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>

              {/* TODO: Change Org to fetch from api */}
              <span className="text-xs text-gray-600">
                Active:{" "}
                <span className="font-medium text-emerald-700">
                  Default Organization
                </span>
              </span>
            </div>
          </div>

          <Dropdown.Menu>
            {/* <Dropdown.Item id="dashboard" textValue="Dashboard">
              <Label>Dashboard</Label>
            </Dropdown.Item>

            <Dropdown.Item id="profile" textValue="Profile">
              <Label>Profile</Label>
            </Dropdown.Item>

            <Dropdown.Item id="settings" textValue="Settings">
              <div className="flex w-full items-center justify-between gap-2">
                <Label>Settings</Label>
                <Gear className="size-3.5 text-muted" />
              </div>
            </Dropdown.Item>

            <Dropdown.Item id="teams" textValue="Teams">
              <div className="flex w-full items-center justify-between gap-2">
                <Label>Teams</Label>
                <Persons className="size-3.5 text-muted" />
              </div>
            </Dropdown.Item> */}

            <Dropdown.Item
              id="logout"
              textValue="Logout"
              variant="danger"
              onPress={handleLogout}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <Label>{loading ? "Logging out..." : "Log Out"}</Label>
                {/* <ArrowRightFromSquare className="size-3.5 text-danger" /> */}
                <Icon
                  icon="gravity-ui:arrow-right-from-square"
                  width="16"
                  height="16"
                  className="size-3.5 text-danger"
                />
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
};

export default AppNavbar;
