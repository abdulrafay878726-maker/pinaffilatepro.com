"use client";

import { useEffect, useRef } from "react";

interface PopunderAdProps {
  className?: string;
}

/**
 * Popunder/Banner Ad Component
 * Loads the effectivecpmnetwork script only on client side to avoid hydration errors
 */
export default function PopunderAd({ className = "" }: PopunderAdProps) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !scriptLoaded.current) {
      scriptLoaded.current = true;
      
      // Load the script dynamically
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://pl30385539.effectivecpmnetwork.com/360296a4ba44883c8599aacfb252a617/invoke.js";
      document.body.appendChild(script);

      return () => {
        // Cleanup script on unmount
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  return (
    <div className={className}>
      <div id="container-360296a4ba44883c8599aacfb252a617" />
    </div>
  );
}
