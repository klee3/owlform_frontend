"use client";

import { useSessionStore } from "@/store/session.store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

export default function AppProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  // Get current session on app load
  useEffect(() => {
    useSessionStore.getState().hydrate();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <ToastContainer hideProgressBar={true} />
    </QueryClientProvider>
  );
}
