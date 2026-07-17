"use client";

import { useEffect, useRef } from "react";

interface Banner468x60Props {
  className?: string;
}

/**
 * 468x60 Footer/Content Banner Ad Component
 * Uses atOptions configuration for the ad network
 */
export default function Banner468x60({ className = "" }: Banner468x60Props) {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !scriptLoaded.current) {
      scriptLoaded.current = true;
      
      // Configure atOptions
      (window as any).atOptions = {
        'key': 'YOUR_AD_KEY_HERE',
        'format': 'iframe',
        'height': 60,
        'width': 468,
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
    <div className={`min-h-[60px] w-full max-w-[468px] ${className}`}>
      {/* Ad container will be populated by the script */}
    </div>
  );
}
