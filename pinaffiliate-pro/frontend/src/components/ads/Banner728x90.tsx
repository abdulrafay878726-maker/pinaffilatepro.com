"use client";

import { useEffect, useRef } from "react";

interface Banner728x90Props {
  className?: string;
}

/**
 * 728x90 Banner Ad Component
 * Uses atOptions configuration for the ad network
 */
export default function Banner728x90({ className = "" }: Banner728x90Props) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !scriptLoaded.current) {
      scriptLoaded.current = true;
      
      // Configure atOptions
      (window as any).atOptions = {
        'key': 'YOUR_AD_KEY_HERE',
        'format': 'iframe',
        'height': 90,
        'width': 728,
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
    <div className={`min-h-[90px] w-full max-w-[728px] ${className}`}>
      {/* Ad container will be populated by the script */}
    </div>
  );
}
