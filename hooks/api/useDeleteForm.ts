import { axiosClient } from "@/lib/api/axiosClient";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useDeleteForm() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (vars: { workspaceSlug: string; formSlug: string }) => {
      const res = await axiosClient.delete(
        `/form/${vars.workspaceSlug}/${vars.formSlug}`,
      );

      return res.data;
    },

    onSuccess: (_, variables) => {
      router.push(`/dashboard/${variables.workspaceSlug}`);
    },
  });
}
