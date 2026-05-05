import { Suspense } from "react";
import AuthCallback from "./AuthCallback";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-gray-500">Signing you in...</p>
        </div>
      }
    >
      <AuthCallback />
    </Suspense>
  );
}
