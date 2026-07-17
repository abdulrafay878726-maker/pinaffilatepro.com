import Link from "next/link";
import { ArrowUpRight, ShoppingBag, TrendingUp } from "lucide-react";
import Button from "@/components/ui/Button";
import AdSlot from "@/components/ui/AdSlot";
import PinCard from "@/components/pin/PinCard";
import PopunderAd from "@/components/ads/PopunderAd";
import SocialBarAd from "@/components/ads/SocialBarAd";
import Banner728x90 from "@/components/ads/Banner728x90";
import type { Pin } from "@/lib/types";

async function getFeed(): Promise<Pin[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${base}/pins?limit=16`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.pins || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const pins = await getFeed();

  return (
    <div>
      {/* Editorial hero — asymmetric spread, not a centered template hero */}
      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-coral/10 px-3 py-1 text-xs font-medium text-coral">
              <TrendingUp className="h-3.5 w-3.5" /> Built for Pinterest creators
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] text-ink lg:text-6xl">
              Pin it. Tag it.
              <br />
              <span className="text-coral">Get paid for it.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-ink-soft">
              Publish pins, attach affiliate links with one tag, and see exactly which pin, which link, and which
              board actually earns.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register">
                <Button size="lg">
                  Start free <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline">
                  Explore pins
                </Button>
              </Link>
            </div>
          </div>

          {/* Signature element preview: a tilted "tag" card echoing the PinCard ribbon */}
          <div className="relative flex items-center justify-center">
            <div className="w-64 -rotate-3 rounded-3xl bg-white p-4 shadow-xl ring-1 ring-line/60">
              <div className="h-72 rounded-2xl bg-gradient-to-br from-coral/20 via-gold/20 to-plum/10" />
              <div className="mt-3 flex items-center gap-2">
                <span
                  className="tag-ribbon flex items-center gap-1.5 rounded-sm bg-coral px-3 py-1.5 text-xs font-semibold text-white"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Buy Now
                </span>
                <span className="text-xs text-ink-soft">2.4k clicks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Homepage Hero Ad */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Banner728x90 className="mt-8 mx-auto" />
      </div>

      {/* Social Bar Ad */}
      <SocialBarAd />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink">Fresh pins</h2>
          <Link href="/explore" className="text-sm font-medium text-coral">
            View all
          </Link>
        </div>

        {pins.length > 0 ? (
          <div className="mt-6 columns-2 gap-4 sm:columns-3 lg:columns-4">
            {pins.map((pin) => (
              <PinCard key={pin._id} pin={pin} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-ink-soft">
            No published pins yet — once the API is running and pins are published, they&apos;ll appear here.
          </div>
        )}
      </section>

      {/* Homepage Middle Ad */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <PopunderAd />
      </div>

      {/* Homepage Bottom Ad */}
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Banner728x90 className="mx-auto" />
      </div>
    </div>
  );
}
