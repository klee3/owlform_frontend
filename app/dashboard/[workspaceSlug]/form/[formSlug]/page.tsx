"use client";

import AppNavbar from "@/components/AppNavbar";
import FormChart from "@/components/FormChart";
import FormHowToDrawer from "@/components/FormHowToDrawer";
import { useDeleteForm } from "@/hooks/api/useDeleteForm";
import { useFormStats } from "@/hooks/api/useFormStats";
import { AlertDialog, Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";

const Form = () => {
  const { workspaceSlug, formSlug } = useParams<{
    workspaceSlug: string;
    formSlug: string;
  }>();

  const {
    data: formStatData,
    isLoading,
    isError,
    error,
  } = useFormStats(workspaceSlug, formSlug);

  const deleteMutation = useDeleteForm();

  useEffect(() => {
    if (error && (error as any)?.code == "ERR_BAD_RESPONSE")
      redirect(`/dashboard/${workspaceSlug}`);
  }, [isError, error]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppNavbar />

      <div className="p-6 space-y-6">
        {/* Overview Header */}
        <div className="flex gap-2 items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Forms Overview
          </h1>
          <Tooltip delay={0}>
            <Tooltip.Trigger>
              <Icon
                icon="gravity-ui:circle-info-fill"
                width="16"
                height="16"
                className="text-blue-600"
              />
            </Tooltip.Trigger>
            <Tooltip.Content>
              <p>
                Track submissions, completion rates, and activity in real time.
              </p>
            </Tooltip.Content>
          </Tooltip>
        </div>
        <div className="flex gap-2">
          {/* How to use */}
          <FormHowToDrawer formSlug={formSlug} />
          {/* DELETE FORM */}
          <AlertDialog>
            <Button variant="danger">Delete Form</Button>

            <AlertDialog.Backdrop>
              <AlertDialog.Container>
                <AlertDialog.Dialog className="sm:max-w-[420px]">
                  <AlertDialog.CloseTrigger />

                  <AlertDialog.Header>
                    <AlertDialog.Icon status="danger" />
                    <AlertDialog.Heading>
                      Delete this form permanently?
                    </AlertDialog.Heading>
                  </AlertDialog.Header>

                  <AlertDialog.Body>
                    <p>
                      This will permanently delete this form and all
                      submissions. This action cannot be undone.
                    </p>
                  </AlertDialog.Body>

                  <AlertDialog.Footer>
                    <Button slot="close" variant="tertiary">
                      Cancel
                    </Button>

                    <Button
                      slot="close"
                      variant="danger"
                      onPress={() =>
                        deleteMutation.mutate({
                          workspaceSlug,
                          formSlug,
                        })
                      }
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete Form"}
                    </Button>
                  </AlertDialog.Footer>
                </AlertDialog.Dialog>
              </AlertDialog.Container>
            </AlertDialog.Backdrop>
          </AlertDialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Total Submissions</p>
            <h2 className="text-2xl font-bold">
              {isLoading ? "..." : (formStatData?.totalSubmissions ?? 0)}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <p className="text-sm text-gray-500">Submitted Today</p>
            <h2 className="text-2xl font-bold">
              {isLoading ? "..." : (formStatData?.todaySubmissions ?? 0)}
            </h2>
          </div>
        </div>

        {/* Additional Overview Section */}
        <div className="grid gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border">
            <h3 className="font-semibold text-gray-700 mb-2">
              Weekly Submissions
            </h3>
            <FormChart workspaceSlug={workspaceSlug} formSlug={formSlug} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
