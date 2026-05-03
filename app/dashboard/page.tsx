"use client";

import LogoutButton from "@/components/LogoutButton";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Button, Card, ProgressCircle } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
  const router = useRouter();

  const { workspaces, loading, activeWorkspace, hydrate, setActiveWorkspace } =
    useWorkspaceStore();

  // hydrate once
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // redirect when workspaces load
  useEffect(() => {
    if (!loading && workspaces.length > 0) {
      const ws = workspaces.find((w) => w.isDefault) ?? workspaces[0];

      setActiveWorkspace(ws);
      router.replace(`/dashboard/${ws.slug}`);
    }
  }, [loading, workspaces, router, setActiveWorkspace]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="border-b bg-background/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4 mx-auto">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Workspaces
          </h2>
          <p className="text-default-500 mt-1">
            Access and manage everything you work on
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <ProgressCircle isIndeterminate aria-label="Loading" />
          </div>
        )}

        {/* Error (optional if you add error state later) */}
        {/* {error && ... } */}

        {/* Content */}
        {!loading && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((ws) => (
                <Card
                  key={ws.id}
                  className="
                    hover:scale-[1.01]
                    transition-all
                    bg-white
                    border border-gray-200
                    shadow-sm
                    hover:shadow-md
                    hover:-translate-y-0.5
                    duration-200
                  "
                >
                  <Card.Header className="flex flex-col items-start gap-1 pb-2 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900">
                      {ws.name}
                    </h3>

                    {ws.isDefault && (
                      <span className="text-xs text-gray-500">
                        Default workspace
                      </span>
                    )}
                  </Card.Header>

                  <Card.Content className="pt-0">
                    <div className="mt-4">
                      <Button variant="outline" size="sm">
                        Open workspace
                      </Button>
                    </div>
                  </Card.Content>
                </Card>
              ))}
            </div>

            {/* Empty state */}
            {!loading && workspaces.length === 0 && (
              <div className="mt-12 text-center py-16 border border-dashed rounded-xl">
                <p className="text-default-500 mb-4">
                  No workspaces available yet
                </p>
                <Button variant="primary">Create workspace</Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
