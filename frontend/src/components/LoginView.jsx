"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function LoginView({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  authError,
  authLoading,
  onSubmit,
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-radial from-slate-900 via-zinc-950 to-black overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-2">
        <Card className="border border-white/10 bg-black/45 backdrop-blur-md text-white shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-4">
            <div className="flex justify-center">
              <div className="relative w-28 h-28 drop-shadow-xl animate-pulse">
                <Image
                  src="/emblem.png"
                  alt="Emblem of Nepal"
                  fill
                  sizes="112px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-blue-500">
                सवारी परीक्षण कार्यालय
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">
                Vehicle Fitness Test Office, Nepal
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email" className="text-zinc-300 text-xs">
                  कार्यालय ईमेल (Email Address)
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  required
                  placeholder="email@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-zinc-500 focus:border-red-500 focus:ring-red-500/20 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password" className="text-zinc-300 text-xs">
                  पासवर्ड (Password)
                </Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder-zinc-500 focus:border-red-500 focus:ring-red-500/20 text-sm"
                />
              </div>

              {authError && (
                <div className="flex items-center gap-2 p-3 text-xs bg-red-950/45 border border-red-500/30 rounded-lg text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-red-600 to-blue-700 hover:from-red-500 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-red-500/10 transition duration-300 rounded-md"
              >
                {authLoading
                  ? "प्रमाणित गर्दै..."
                  : "प्रणालीमा प्रवेश गर्नुहोस् (Login)"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-white/5 pt-4 text-zinc-500 text-[10px] text-center">
            यातायात व्यवस्था विभाग, नेपाल सरकार
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
