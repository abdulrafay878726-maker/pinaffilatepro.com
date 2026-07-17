export interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatarUrl: string;
  coverImageUrl: string;
  bio: string;
  country: string;
  social: Record<string, string>;
  theme: "light" | "dark" | "system";
  isPublicProfile: boolean;
  stats: {
    totalPins: number;
    totalViews: number;
    totalLikes: number;
    totalSaves: number;
    totalClicks: number;
    totalAffiliateClicks: number;
    earningsPlaceholder: number;
  };
  followers: string[];
  following: string[];
  isEmailVerified: boolean;
}

export interface Affiliate {
  url: string;
  buttonText: "Buy Now" | "Shop Now" | "Get Deal" | "View Product" | "Learn More";
  buttonColor: string;
  buttonIcon: string;
  openInNewTab: boolean;
  nofollow: boolean;
  sponsored: boolean;
  clickCount: number;
  conversionPlaceholder: number;
}

export interface Pin {
  _id: string;
  owner: Pick<User, "_id" | "username" | "fullName" | "avatarUrl">;
  board?: string | null;
  imageUrl: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  keywords: string[];
  slug: string;
  status: "draft" | "scheduled" | "published" | "archived";
  visibility: "public" | "unlisted" | "private";
  isFeatured: boolean;
  affiliate: Affiliate;
  seo: {
    title: string;
    description: string;
    altText: string;
  };
  views: number;
  likes: string[];
  saves: string[];
  publishedAt: string | null;
  createdAt: string;
}

export interface DashboardStats {
  totalPins: number;
  publishedPins: number;
  draftPins: number;
  affiliateClicks: number;
  totalViews: number;
  earningsPlaceholder: number;
  followers: number;
}
