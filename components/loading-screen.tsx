"use client";

import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
  isLoading: boolean;
  onComplete: () => void;
}

export default function LoadingScreen({ isLoading, onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isLoading) {
      // Fase 1: Data masih di-fetch. Progres berjalan pelan sampai mentok di 90%.
      interval = setInterval(() => {
        setProgress((prev) => {
          const remaining = 90 - prev;
          const increment = Math.max(1, Math.floor(Math.random() * (remaining / 10)));
          if (prev >= 90) return 90;
          return prev + increment;
        });
      }, 50);
    } else {
      // Fase 2: Data sudah siap (isLoading = false). Lari cepat ke 100%.
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            // Tunggu 300ms di angka 100% agar user sempat melihatnya sebelum halaman terbuka
            setTimeout(onComplete, 300);
            return 100;
          }
          return prev + Math.max(2, Math.floor((100 - prev) / 4));
        });
      }, 20);
    }

    return () => clearInterval(interval);
  }, [isLoading, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-deep text-neon-cyan fixed inset-0 z-[100]">
      <div className="flex flex-col items-start gap-2 w-72 max-w-[80vw]">
        <div className="font-code-md text-base md:text-lg font-bold tracking-widest animate-pulse" style={{ textShadow: "0 0 8px rgba(0, 242, 255, 0.5)" }}>
          Loading...
        </div>
        <div className="flex items-center gap-4 w-full">
          {/* Progress Bar Container */}
          <div className="grow h-5 md:h-6 rounded-md border-2 border-neon-cyan p-[2px] overflow-hidden flex items-stretch shadow-[0_0_12px_rgba(0,242,255,0.4)]">
            {/* Inner Progress Bar */}
            <div 
              className="h-full bg-neon-cyan rounded-sm transition-all duration-150 ease-out"
              style={{ width: `${progress}%`, boxShadow: "0 0 10px rgba(0,242,255,0.8)" }}
            />
          </div>
          {/* Percentage */}
          <div 
            className="font-headline-md text-xl md:text-2xl font-bold w-14 text-right"
            style={{ textShadow: "2px 2px 0px rgba(0,0,0,1), 0 0 10px rgba(0,242,255,0.8)" }}
          >
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}
