"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bookmark, ShoppingBag } from "lucide-react";
import type { Pin } from "@/lib/types";

export default function PinCard({ pin }: { pin: Pin }) {
  return (
    <div className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-line/60 transition-shadow hover:shadow-lg">
      <Link href={`/pin/${pin.slug}`} className="block">
        <div className="relative w-full overflow-hidden">
          <Image
            src={pin.imageUrl}
            alt={pin.seo?.altText || pin.title}
            width={400}
            height={520}
            className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </Link>

      {/* Signature: torn-tag affiliate ribbon, pinned to the corner like a price tag */}
      <div
        className="tag-ribbon absolute right-3 top-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white shadow-md"
        style={{ backgroundColor: pin.affiliate?.buttonColor || "#FF5A45" }}
      >
        <ShoppingBag className="h-3.5 w-3.5" />
        {pin.affiliate?.buttonText || "Buy Now"}
      </div>

      <div className="p-3.5">
        <Link href={`/pin/${pin.slug}`}>
          <h3 className="font-display text-[15px] font-medium leading-snug text-ink line-clamp-2">
            {pin.title}
          </h3>
        </Link>

        <div className="mt-3 flex items-center justify-between">
          <Link href={`/u/${pin.owner.username}`} className="flex items-center gap-2">
            <div className="h-6 w-6 overflow-hidden rounded-full bg-paper-dim">
              {pin.owner.avatarUrl && (
                <Image src={pin.owner.avatarUrl} alt={pin.owner.username} width={24} height={24} />
              )}
            </div>
            <span className="text-xs text-ink-soft">@{pin.owner.username}</span>
          </Link>

          <div className="flex items-center gap-3 text-ink-soft">
            <span className="flex items-center gap-1 text-xs">
              <Heart className="h-3.5 w-3.5" /> {pin.likes?.length ?? 0}
            </span>
            <span className="flex items-center gap-1 text-xs">
              <Bookmark className="h-3.5 w-3.5" /> {pin.saves?.length ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
