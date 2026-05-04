"use client";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function FormSubmittedPage() {
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleGoBack = () => {
    if (canGoBack) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
            <Icon
              icon="lucide:circle-check"
              width="24"
              height="24"
              className="h-8 w-8 text-emerald-500 "
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Form Submitted!</h1>
          <p className="text-sm text-gray-500 mt-2">
            Thank you. Your response has been recorded successfully.
          </p>
        </div>

        {/* OwlForm Promo */}
        <div className="mt-6 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-center text-white shadow-lg">
          <div className="mx-auto h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
            <Icon
              icon="lucide:feather"
              width="24"
              height="24"
              className="h-6 w-6 text-white"
            />
          </div>
          <h3 className="text-lg font-bold">Create your own forms</h3>
          <p className="text-sm text-indigo-100 mt-2">
            Build beautiful forms, collect responses, and analyze data — all
            with OwlForm.
          </p>
          <Button className="mt-5 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold">
            <a href="/">Get Started Free</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
