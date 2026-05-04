"use client";

import { axiosClient } from "@/lib/api/axiosClient";
import { useQuery } from "@tanstack/react-query";

export function useFormChart(workspaceSlug: string, formSlug: string) {
  return useQuery({
    queryKey: ["form-chart", workspaceSlug, formSlug],
    queryFn: async () => {
      const res = await axiosClient.get(
        `/form/stats/${workspaceSlug}/${formSlug}/last-30-days`,
      );
      return res.data;
    },
    enabled: !!workspaceSlug && !!formSlug,
  });
}
