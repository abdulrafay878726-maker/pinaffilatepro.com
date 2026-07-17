"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || "Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      {sent ? (
        <div className="text-center">
          <MailCheck className="mx-auto h-10 w-10 text-coral" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">Check your inbox</h1>
          <p className="mt-2 text-sm text-ink-soft">
            If <span className="font-medium text-ink">{email}</span> is registered, a reset link is on its way.
          </p>
          <Link href="/login" className="mt-6 inline-block text-sm font-medium text-coral">
            Back to log in
          </Link>
        </div>
      ) : (
        <>
          <h1 className="font-display text-3xl font-semibold text-ink">Reset your password</h1>
          <p className="mt-2 text-sm text-ink-soft">
            Enter the email on your account and we&apos;ll send a reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" loading={loading} className="mt-2 w-full">
              Send reset link
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-ink-soft">
            <Link href="/login" className="font-medium text-coral">
              Back to log in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
