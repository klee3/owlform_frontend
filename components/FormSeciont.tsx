"use client";

import { Form } from "@/hooks/api/types";
import { axiosClient } from "@/lib/api/axiosClient";
import { Card, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import CreateFormDialog from "./CreateFormDialog";

type Props = {
  workspaceSlug: string;
};

export default function FormsSection({ workspaceSlug }: Props) {
  const router = useRouter();

  const {
    data: forms = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["forms", workspaceSlug],
    queryFn: async () => {
      const res = await axiosClient.get(`/form/${workspaceSlug}`, {
        withCredentials: true,
      });

      return res.data ?? [];
    },
    enabled: !!workspaceSlug,
    staleTime: 1000 * 60 * 5,
    // important for back navigation UX
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="mt-8 space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Forms</h2>

        <CreateFormDialog
          triggerText="Create form"
          workspaceSlug={workspaceSlug}
          onCreated={() => window.location.reload()}
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && forms.length === 0 && (
        <Card className="p-10 text-center border-dashed border-2 flex flex-col items-center">
          <h3 className="text-lg font-semibold">No forms yet</h3>
          <p className="text-default-500 mt-2">
            Create your first form to start collecting responses
          </p>

          <CreateFormDialog
            triggerText="Create your first form"
            workspaceSlug={workspaceSlug}
            onCreated={() => window.location.reload()}
          />
        </Card>
      )}

      {/* Forms grid */}
      {!isLoading && forms.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {forms.map((form: Form) => (
            <Card
              key={form.id}
              className="
                p-4
                border
                shadow-sm
                hover:shadow-md
                hover:-translate-y-1
                transition-all
                cursor-pointer
              "
              onClick={() =>
                router.push(`/dashboard/${workspaceSlug}/form/${form.slug}`)
              }
            >
              <h3 className="font-semibold">{form.name}</h3>

              {form.description && (
                <p className="text-sm text-default-500 mt-1">
                  {form.description}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
