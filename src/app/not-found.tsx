"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass, Aperture } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 relative z-10 overflow-hidden">
      
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div 
        className={`relative z-10 text-center transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      >
        
        <div className="relative mb-8 inline-block group">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-yellow-500/20 transition-colors duration-700" />
          
          <div className="bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 px-12 py-10 rounded-[3rem] shadow-2xl flex items-center justify-center gap-2 md:gap-4 relative overflow-hidden">
            <span className="text-7xl md:text-9xl font-black font-[family-name:var(--font-playfair)] text-foreground/30 select-none -mt-10">4</span>
            
            <div className="relative">
              <Aperture className="h-20 w-20 md:h-32 md:w-32 text-primary animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-4 w-4 md:h-5 md:w-5 rounded-full bg-yellow-500 animate-ping absolute" />
                <div className="h-3 w-3 md:h-4 md:w-4 rounded-full bg-yellow-500 z-10" />
              </div>
            </div>

            <span className="text-7xl md:text-9xl font-black font-[family-name:var(--font-playfair)] text-foreground/30 select-none -mt-10">4</span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 text-foreground tracking-tight mt-6">
          Lost in the Studio?
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-lg leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily out of focus. Let's get you back to the right set.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all">
              <ArrowLeft className="mr-2 h-5 w-5" /> Return to Home
            </Button>
          </Link>
          <Link href="/studios">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-semibold border-white/20 dark:border-white/10 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500/30 transition-all">
              <Compass className="mr-2 h-5 w-5" /> Explore Studios
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}