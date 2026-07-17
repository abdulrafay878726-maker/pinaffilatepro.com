import { cn } from "@/lib/utils";

const SIZES = {
  leaderboard: "min-h-24 md:min-h-28",
  rectangle: "min-h-64",
  square: "min-h-64 w-64",
  sidebar: "min-h-96",
  banner: "min-h-20",
} as const;

// EthicalAds ad type per placement shape — "text" reads best in short/wide
// slots, "image" (their standard 130x100 unit) fits square/rectangle slots.
const EA_TYPE: Record<keyof typeof SIZES, "text" | "image"> = {
  leaderboard: "text",
  banner: "text",
  rectangle: "image",
  square: "image",
  sidebar: "image",
};

interface AdSlotProps {
  placement: string;
  size?: keyof typeof SIZES;
  className?: string;
  /** e.g. "pinterest|affiliate-marketing|blogging" — improves EthicalAds contextual targeting */
  keywords?: string;
}

const publisherId = process.env.NEXT_PUBLIC_ETHICALADS_PUBLISHER_ID;

/**
 * Ad space for every placement named in the brief (homepage hero/middle/footer,
 * sidebar, pin page, dashboard, profile, search, category, board, etc).
 *
 * Wired to EthicalAds (https://www.ethicalads.io) — a developer-focused,
 * privacy-respecting network with no third-party tracking scripts. When
 * NEXT_PUBLIC_ETHICALADS_PUBLISHER_ID is unset (e.g. before you've signed up
 * as a publisher), this renders a clearly-labeled placeholder instead so
 * layout/spacing still previews correctly.
 */
export default function AdSlot({ placement, size = "rectangle", className, keywords }: AdSlotProps) {
  if (!publisherId) {
    return (
      <div
        data-ad-placement={placement}
        className={cn(
          "flex w-full items-center justify-center rounded-2xl border border-dashed border-line bg-paper-dim/60 text-ink-soft",
          SIZES[size],
          className
        )}
      >
        <span className="font-stat text-[11px] uppercase tracking-widest">Advertisement Space</span>
      </div>
    );
  }

  return (
    <div
      data-ad-placement={placement}
      className={cn("flex w-full items-center justify-center rounded-2xl", SIZES[size], className)}
    >
      <div
        data-ea-publisher={publisherId}
        data-ea-type={EA_TYPE[size]}
        data-ea-style={size === "sidebar" ? "stickybox" : undefined}
        {...(keywords ? { "data-ea-keywords": keywords } : {})}
      />
    </div>
  );
}
