"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import AdSlot from "@/components/ui/AdSlot";
import Banner160x300 from "@/components/ads/Banner160x300";
import Banner728x90 from "@/components/ads/Banner728x90";
import {
  Image as ImageIcon, Eye, MousePointerClick, DollarSign, Users, Bell, Plus,
} from "lucide-react";

const fetcher = (url: string) => api.get(url).then((res) => res.data);

const cards = [
  { key: "totalPins", label: "Total Pins", icon: ImageIcon, color: "text-plum" },
  { key: "publishedPins", label: "Published Pins", icon: ImageIcon, color: "text-sage" },
  { key: "draftPins", label: "Draft Pins", icon: ImageIcon, color: "text-gold" },
  { key: "affiliateClicks", label: "Affiliate Clicks", icon: MousePointerClick, color: "text-coral" },
  { key: "totalViews", label: "Total Views", icon: Eye, color: "text-plum" },
  { key: "earningsPlaceholder", label: "Earnings (placeholder)", icon: DollarSign, color: "text-sage" },
  { key: "followers", label: "Followers", icon: Users, color: "text-coral" },
] as const;

export default function DashboardPage() {
  const { user, loading, resendVerification } = useAuth();
  const { data, isLoading } = useSWR(user ? "/users/me/dashboard-stats" : null, fetcher);
  const stats = data?.stats;

  if (!loading && !user) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || "User"}
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Welcome back{user ? `, ${user.displayName?.split(" ")[0] || user.email?.split("@")[0]}` : ""}
            </h1>
            <p className="text-sm text-ink-soft">{user?.email}</p>
          </div>
        </div>
        <Link href="/dashboard/pins/new">
          <Button>
            <Plus className="h-4 w-4" /> Create Pin
          </Button>
        </Link>
      </div>

      {user && !user.emailVerified && (
        <div className="mt-6 rounded-2xl border border-coral/30 bg-coral/5 p-4">
          <p className="text-sm text-ink">
            Please verify your email address. Check your inbox for the verification link.
          </p>
          <button
            onClick={resendVerification}
            className="mt-2 text-sm font-medium text-coral hover:underline"
          >
            Resend verification email
          </button>
        </div>
      )}

      <Banner728x90 className="mt-6 mx-auto" />

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.key} className="rounded-2xl border border-line bg-white p-5">
              <Icon className={`h-5 w-5 ${c.color}`} />
              <div className="mt-3 font-stat text-2xl font-semibold text-ink">
                {isLoading ? "—" : c.key === "earningsPlaceholder" ? `$${stats?.[c.key] ?? 0}` : stats?.[c.key] ?? 0}
              </div>
              <div className="mt-1 text-xs text-ink-soft">{c.label}</div>
            </div>
          );
        })}
        <div className="rounded-2xl border border-line bg-white p-5">
          <Bell className="h-5 w-5 text-plum" />
          <div className="mt-3 font-stat text-2xl font-semibold text-ink">0</div>
          <div className="mt-1 text-xs text-ink-soft">Notifications</div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Recent activity</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Activity feed connects to <code className="rounded bg-paper-dim px-1">GET /api/analytics/overview</code> —
            build out the feed UI here once real events are flowing.
          </p>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="font-display text-base font-semibold text-ink">Quick actions</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/dashboard/pins/new"><Button variant="outline" className="w-full justify-start">New pin</Button></Link>
              <Link href="/dashboard/boards/new"><Button variant="outline" className="w-full justify-start">New board</Button></Link>
              <Link href="/dashboard/blog/new"><Button variant="outline" className="w-full justify-start">Write a blog post</Button></Link>
              <Link href="/dashboard/analytics"><Button variant="outline" className="w-full justify-start">View analytics</Button></Link>
            </div>
          </div>
          <Banner160x300 className="mx-auto" />
        </aside>
      </div>
    </div>
  );
}
