"use client";

import { useEffect, useRef } from "react";

interface Banner160x300Props {
  className?: string;
}

/**
 * 160x300 Sidebar Banner Ad Component
 * Uses atOptions configuration for the ad network
 */
export default function Banner160x300({ className = "" }: Banner160x300Props) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !scriptLoaded.current) {
      scriptLoaded.current = true;
      
      // Configure atOptions
      (window as any).atOptions = {
        'key': 'YOUR_AD_KEY_HERE',
        'format': 'iframe',
        'height': 300,
        'width': 160,
        'params': {}
      };

      // Load the script dynamically
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "//www.topcreativeformat.com/YOUR_AD_KEY_HERE/invoke.js";
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
    <div className={`min-h-[300px] w-[160px] ${className}`}>
      {/* Ad container will be populated by the script */}
    </div>
  );
}
