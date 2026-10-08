import { useI18n } from "@/lib/I18nContext";
import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Loader2, AlertTriangle } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
export default function ResetPassword() {
  const {
    t: i18nT
  } = useI18n();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetToken = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setError(i18nT(""));
    if (newPassword !== confirmPassword) {
      setError(i18nT("Passwords do not match"));
      return;
    }
    setLoading(true);
    try {
      await base44.auth.resetPassword({
        resetToken,
        newPassword
      });
      navigate("/login", {
        replace: true
      });
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };
  if (!resetToken) {
    return <AuthLayout icon={AlertTriangle} title={i18nT("Invalid reset link")} subtitle="This password reset link is missing or invalid" footer={<Link to="/forgot-password" className="text-primary font-medium hover:underline">{i18nT("Request a new link")}</Link>}>
        <p className="text-sm text-foreground text-center">{i18nT("The link you used appears to be incomplete. Please request a new password reset email.")}</p>
      </AuthLayout>;
  }
  return <AuthLayout icon={Lock} title={i18nT("New password")} subtitle="Enter your new password below">
      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {i18nT(error)}
        </div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">{i18nT("New Password")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input id="password" type="password" autoComplete="new-password" autoFocus placeholder="••••••••" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">{i18nT("Confirm Password")}</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input id="confirm" type="password" autoComplete="new-password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pl-10 h-12" required />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
          {loading ? <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />{i18nT("Resetting...")}</> : i18nT("Reset password")}
        </Button>
      </form>
    </AuthLayout>;
}
