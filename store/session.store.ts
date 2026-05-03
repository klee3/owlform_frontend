import { Session, User } from "@/hooks/api/types";
import { axiosClient } from "@/lib/api/axiosClient";
import { create } from "zustand";

type SessionStore = {
  user: User | null;
  session: Session | null;
  loading: boolean;

  setSession: (session: Session) => void;
  setUser: (user: User) => void;
  clear: () => void;
  hydrate: () => Promise<void>;
};

export const useSessionStore = create<SessionStore>((set) => ({
  user: null,
  session: null,
  loading: true,

  setSession: (session) =>
    set({
      session,
      user: session.user,
      loading: false,
    }),

  setUser: (user) =>
    set((state) => ({
      ...state,
      user,
    })),

  clear: () =>
    set({
      user: null,
      session: null,
      loading: false,
    }),

  hydrate: async () => {
    try {
      set({ loading: true });

      const res = await axiosClient.get("/user/session", {
        withCredentials: true,
      });

      const data: Session = res.data;

      set({
        session: data,
        user: data.user,
        loading: false,
      });
    } catch (err) {
      set({ user: null, session: null, loading: false });
    }
  },
}));
