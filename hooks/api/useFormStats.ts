"use client";

import { axiosClient } from "@/lib/api/axiosClient";
import { useQuery } from "@tanstack/react-query";

export function useFormStats(workspaceSlug: string, formSlug: string) {
  return useQuery({
    queryKey: ["form-stats", workspaceSlug, formSlug],
    queryFn: async () => {
      const res = await axiosClient.get(
        `/form/stats/${workspaceSlug}/${formSlug}`,
      );
      return res.data;
    },
    enabled: !!workspaceSlug && !!formSlug,
    staleTime: 1000 * 60, // 1 min cache
  });
}
