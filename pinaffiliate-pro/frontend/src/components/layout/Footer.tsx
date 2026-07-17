import Link from "next/link";
import Banner468x60 from "@/components/ads/Banner468x60";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Explore Pins", href: "/explore" },
      { label: "Blog", href: "/blog" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Creators",
    links: [
      { label: "Create a Pin", href: "/dashboard/pins/new" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Analytics", href: "/dashboard/analytics" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper-dim/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <span className="font-display text-lg font-semibold text-ink">
              PinAffiliate <span className="text-coral">Pro</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              Create pins, add affiliate links, and earn more — the workspace built for Pinterest creators.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-soft hover:text-coral">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Footer Ad */}
        <div className="mt-8 flex justify-center">
          <Banner468x60 />
        </div>
        
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row">
          <span>© {new Date().getFullYear()} PinAffiliate Pro. All rights reserved.</span>
          <span>Affiliate links on this platform may be sponsored.</span>
        </div>
      </div>
    </footer>
  );
}
