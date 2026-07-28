"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogOut, User, KeyRound } from "lucide-react";
import ChangePasswordModal from "@/components/ChangePasswordModal";

export default function Navbar({ user, onLogout }) {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 shrink-0">
            <Image
              src="/emblem.png"
              alt="Emblem of Nepal"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-blue-900 dark:text-blue-400 tracking-tight leading-tight">
              सवारी परीक्षण कार्यालय
            </h1>
            <p className="text-[10px] sm:text-xs text-red-600 dark:text-red-400 font-semibold tracking-wide uppercase">
              Vehicle Fitness Test Office, Government of Nepal
            </p>
          </div>
        </div>

        {/* Right side: user badge + logout */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-zinc-800 rounded-full border border-slate-200 dark:border-zinc-700 text-xs">
            <User className="w-3.5 h-3.5 text-zinc-500" />
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {user?.fullName}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[9px] uppercase font-bold">
              {user?.userType}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChangePassword(true)}
            className="border-slate-200 hover:bg-slate-100 dark:border-zinc-700 dark:hover:bg-zinc-800 flex items-center gap-1.5 transition text-xs"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">पासवर्ड परिवर्तन</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-red-900/30 dark:hover:bg-red-950/30 dark:hover:text-red-400 flex items-center gap-1.5 transition text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>बाहिर निस्कनुहोस्</span>
          </Button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </header>
  );
}
