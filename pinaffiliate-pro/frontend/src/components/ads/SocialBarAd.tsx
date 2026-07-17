"use client";

import { useEffect, useRef } from "react";

interface SocialBarAdProps {
  className?: string;
}

/**
 * Social Bar Ad Component
 * Loads the effectivecpmnetwork social bar script only on client side to avoid hydration errors
 */
export default function SocialBarAd({ className = "" }: SocialBarAdProps) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !scriptLoaded.current) {
      scriptLoaded.current = true;
      
      // Load the script dynamically
      const script = document.createElement("script");
      script.src = "https://pl30385540.effectivecpmnetwork.com/d4/b4/f8/d4b4f8ed3349310b986be3da0f244b3e.js";
      document.body.appendChild(script);

      return () => {
        // Cleanup script on unmount
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return <div className={className} />;
}
