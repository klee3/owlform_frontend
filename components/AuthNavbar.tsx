"use client";

import Link from "next/link";

const AuthNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full h-14 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-lg font-semibold text-gray-800">AuthApp</span>
        </Link>
      </div>
    </nav>
  );
};

export default AuthNavbar;
