import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Heart, Bookmark, Share2, Flag, Eye, ShoppingBag } from "lucide-react";
import AdSlot from "@/components/ui/AdSlot";
import PinCard from "@/components/pin/PinCard";
import Banner728x90 from "@/components/ads/Banner728x90";
import Banner160x300 from "@/components/ads/Banner160x300";
import type { Pin } from "@/lib/types";

async function getPin(slug: string): Promise<{ pin: Pin; relatedPins: Pin[] } | null> {
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const res = await fetch(`${base}/pins/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function PinDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPin(slug);
  if (!data) notFound();
  const { pin, relatedPins } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Large pin image */}
        <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-line/60">
          <Image
            src={pin.imageUrl}
            alt={pin.seo?.altText || pin.title}
            width={800}
            height={1000}
            className="h-auto w-full object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <span className="rounded-full bg-paper-dim px-3 py-1 text-xs font-medium text-ink-soft">
              {pin.category}
            </span>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">{pin.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{pin.description}</p>
          </div>

          {/* Affiliate buy button */}
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/pins/${pin._id}/click`}
            target={pin.affiliate.openInNewTab ? "_blank" : "_self"}
            rel={`${pin.affiliate.nofollow ? "nofollow " : ""}${pin.affiliate.sponsored ? "sponsored " : ""}noopener noreferrer`}
            className="flex items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white shadow-md transition-transform hover:scale-[1.01]"
            style={{ backgroundColor: pin.affiliate.buttonColor || "#FF5A45" }}
          >
            <ShoppingBag className="h-5 w-5" />
            {pin.affiliate.buttonText}
          </a>
          <p className="-mt-4 text-xs text-ink-soft/70">
            This is a sponsored affiliate link — PinAffiliate Pro may earn a commission.
          </p>

          {/* Engagement row */}
          <div className="flex items-center gap-4 border-y border-line py-4 text-ink-soft">
            <button className="flex items-center gap-1.5 text-sm hover:text-coral">
              <Heart className="h-4 w-4" /> {pin.likes?.length ?? 0}
            </button>
            <button className="flex items-center gap-1.5 text-sm hover:text-coral">
              <Bookmark className="h-4 w-4" /> {pin.saves?.length ?? 0}
            </button>
            <span className="flex items-center gap-1.5 text-sm">
              <Eye className="h-4 w-4" /> {pin.views}
            </span>
            <button className="ml-auto flex items-center gap-1.5 text-sm hover:text-ink">
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button className="flex items-center gap-1.5 text-sm hover:text-red-500">
              <Flag className="h-4 w-4" /> Report
            </button>
          </div>

          {/* Creator */}
          <Link href={`/u/${pin.owner.username}`} className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-paper-dim">
              {pin.owner.avatarUrl && <Image src={pin.owner.avatarUrl} alt="" width={40} height={40} />}
            </div>
            <div>
              <div className="text-sm font-medium text-ink">{pin.owner.fullName}</div>
              <div className="text-xs text-ink-soft">@{pin.owner.username}</div>
            </div>
          </Link>

          <Banner160x300 className="mx-auto" />
        </div>
      </div>

      {/* Comments — wire to /api/comments/pin/:pinId */}
      <div className="mt-12 rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Comments</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Connect this section to <code className="rounded bg-paper-dim px-1">GET /api/comments/pin/{pin._id}</code>.
        </p>
      </div>

      <Banner728x90 className="mt-10 mx-auto" />

      {relatedPins?.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">Related pins</h2>
          <div className="mt-4 columns-2 gap-4 sm:columns-3 lg:columns-4">
            {relatedPins.map((p) => (
              <PinCard key={p._id} pin={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
