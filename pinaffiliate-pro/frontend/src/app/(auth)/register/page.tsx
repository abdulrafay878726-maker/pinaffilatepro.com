"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Code2, Globe } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink">Create your account</h1>
      <p className="mt-2 text-sm text-ink-soft">Start pinning, adding affiliate links, and earning today.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          label="Full name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength={8}
          required
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" loading={loading} className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-soft">or continue with</span>
        <div className="h-px flex-1 bg-line" />
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="w-full" type="button" onClick={() => (window.location.href = "/api/auth/google")}>
          <Globe className="h-4 w-4" /> Google
        </Button>
        <Button variant="outline" className="w-full" type="button" onClick={() => (window.location.href = "/api/auth/github")}>
          <Code2 className="h-4 w-4" /> GitHub
        </Button>
      </div>
      <p className="mt-2 text-center text-xs text-ink-soft/70">
        Social login is not configured yet in this build.
      </p>

      <p className="mt-8 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-coral">
          Log in
        </Link>
      </p>
    </div>
  );
}
