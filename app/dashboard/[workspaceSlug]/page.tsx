"use client";

import AppNavbar from "@/components/AppNavbar";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Workspace = () => {
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

  const { workspaces, activeWorkspace, setActiveWorkspace } =
    useWorkspaceStore();

  useEffect(() => {
    if (!workspaceSlug || workspaces.length === 0) return;

    const ws = workspaces.find((w) => w.slug === workspaceSlug);

    if (ws) {
      setActiveWorkspace(ws);
    }
  }, [workspaceSlug, workspaces, setActiveWorkspace]);

  return (
    <div>
      <AppNavbar />
      <div>Workspace page</div>
    </div>
  );
};

export default Workspace;
