import { axiosClient } from "@/lib/api/axiosClient";
import { create } from "zustand";

export type Workspace = {
  id: number;
  name: string;
  slug: string;
  isDefault: boolean;
  organizationId: number;
};

type WorkspaceStore = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  loading: boolean;

  setActiveWorkspace: (ws: Workspace) => void;
  hydrate: () => Promise<void>;
};

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  workspaces: [],
  activeWorkspace: null,
  loading: false,

  setActiveWorkspace: (ws) => {
    localStorage.setItem("activeWorkspace", JSON.stringify(ws));
    set({ activeWorkspace: ws });
  },

  hydrate: async () => {
    try {
      set({ loading: true });

      const res = await axiosClient.get("/workspace/my-workspace", {
        withCredentials: true,
      });

      const workspaces: Workspace[] = res.data;

      const saved = localStorage.getItem("activeWorkspace");

      let active = saved
        ? JSON.parse(saved)
        : (workspaces.find((w) => w.isDefault) ?? workspaces[0]);

      if (active) {
        localStorage.setItem("activeWorkspace", JSON.stringify(active));
      }

      set({
        workspaces,
        activeWorkspace: active,
        loading: false,
      });
    } catch (err) {
      set({
        workspaces: [],
        activeWorkspace: null,
        loading: false,
      });
    }
  },
}));
