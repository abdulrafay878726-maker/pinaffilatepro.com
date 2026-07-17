"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-soft">Log in to manage your pins and affiliate links.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-ink-soft">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-line"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-coral">
            Forgot password?
          </Link>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" loading={loading} className="mt-2 w-full">
          Log in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-coral">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
