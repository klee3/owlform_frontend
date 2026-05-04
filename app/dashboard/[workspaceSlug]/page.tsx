"use client";

import AppNavbar from "@/components/AppNavbar";
import FormsSection from "@/components/FormSeciont";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const Workspace = () => {
  // TODO: use react query
  const { workspaceSlug } = useParams<{ workspaceSlug: string }>();

  const { workspaces, setActiveWorkspace } = useWorkspaceStore();

  useEffect(() => {
    if (!workspaceSlug || workspaces.length === 0) return;

    const ws = workspaces.find((w) => w.slug === workspaceSlug);

    if (ws) setActiveWorkspace(ws);
  }, [workspaceSlug, workspaces, setActiveWorkspace]);

  return (
    <div>
      <AppNavbar />

      <div className="max-w-6xl mx-auto px-6 py-8">
        <FormsSection workspaceSlug={workspaceSlug} />
      </div>
    </div>
  );
};

export default Workspace;
