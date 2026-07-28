"use client";

import { useState } from "react";
import { X, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword]         = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting]           = useState(false);
  const [error, setError]                     = useState("");
  const [success, setSuccess]                 = useState("");

  const resetAndClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("सबै क्षेत्रहरू भर्नुहोस्।");
      return;
    }
    if (newPassword.length < 6) {
      setError("नयाँ पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ।");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("नयाँ पासवर्ड र पुष्टि पासवर्ड मिलेन।");
      return;
    }

    setSubmitting(true);
    try {
      await api.put("/api/auth/change-password", { currentPassword, newPassword });
      setSuccess("पासवर्ड सफलतापूर्वक परिवर्तन भयो!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        resetAndClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "पासवर्ड परिवर्तन गर्न असफल भयो।");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col">

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50 dark:bg-zinc-900/50 rounded-t-2xl">
          <h2 className="text-base font-bold text-slate-800 dark:text-zinc-100 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-blue-600" />
            पासवर्ड परिवर्तन (Change Password)
          </h2>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-xs font-semibold">
                हालको पासवर्ड (Current Password)
              </Label>
              <Input
                id="current-password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-xs font-semibold">
                नयाँ पासवर्ड (New Password)
              </Label>
              <Input
                id="new-password"
                type="password"
                required
                placeholder="कम्तिमा ६ अक्षर"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-xs font-semibold">
                नयाँ पासवर्ड पुष्टि (Confirm New Password)
              </Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-sm bg-transparent border-slate-200 dark:border-zinc-800"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg text-xs text-red-700 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-lg text-xs text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 rounded-b-2xl flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetAndClose}
              className="text-sm border-slate-200 dark:border-zinc-800 dark:text-zinc-300"
            >
              रद्द गर्नुहोस् (Cancel)
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-blue-900 hover:bg-blue-800 text-white rounded-md text-sm font-semibold"
            >
              {submitting ? "परिवर्तन हुँदैछ..." : "परिवर्तन गर्नुहोस् (Update)"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
