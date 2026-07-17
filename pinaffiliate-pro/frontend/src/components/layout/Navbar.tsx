"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Plus, Bell, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          PinAffiliate <span className="text-coral">Pro</span>
        </Link>

        <div className="hidden flex-1 items-center rounded-full border border-line bg-white px-4 py-2 md:flex">
          <Search className="h-4 w-4 text-ink-soft" />
          <input
            type="text"
            placeholder="Search pins, boards, tags..."
            className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-ink-soft/60"
          />
        </div>

        <nav className="ml-auto hidden items-center gap-2 md:flex">
          <Link href="/blog" className="px-3 py-2 text-sm text-ink-soft hover:text-ink">
            Blog
          </Link>
          <Link href="/explore" className="px-3 py-2 text-sm text-ink-soft hover:text-ink">
            Explore
          </Link>

          {!loading && user ? (
            <>
              <Link href="/dashboard/pins/new">
                <Button size="sm" variant="secondary">
                  <Plus className="h-4 w-4" /> Create Pin
                </Button>
              </Link>
              <Link href="/dashboard/notifications" className="rounded-full p-2 hover:bg-paper-dim">
                <Bell className="h-5 w-5 text-ink-soft" />
              </Link>
              <Link href="/dashboard" className="rounded-full p-2 hover:bg-paper-dim">
                <div className="h-8 w-8 rounded-full bg-coral/20 text-center text-sm font-semibold leading-8 text-coral">
                  {user.fullName?.[0]?.toUpperCase() || "U"}
                </div>
              </Link>
              <Button size="sm" variant="ghost" onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : (
            !loading && (
              <>
                <Link href="/login">
                  <Button size="sm" variant="ghost">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" variant="primary">
                    Sign up free
                  </Button>
                </Link>
              </>
            )
          )}
        </nav>

        <button className="ml-auto p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-paper px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>
            <Link href="/explore" onClick={() => setOpen(false)}>
              Explore
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Button variant="ghost" onClick={() => logout()}>
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link href="/register" onClick={() => setOpen(false)}>
                  <Button className="w-full">Sign up free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
