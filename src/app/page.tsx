"use client";

import { Suspense, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import HeroSlider from "@/components/sections/HeroSlider";
import Categories from "@/components/sections/Categories";
import FeaturedStudios from "@/components/sections/FeaturedStudios";
import FlagshipStudios from "@/components/sections/FlagshipStudios";
import HowItWorks from "@/components/sections/HowItWorks";
import HostGuarantee from "@/components/sections/HostGuarantee";
import ImageMarquee from "@/components/sections/ImageMarquee";

function HomeContent() {
  const { data: session } = authClient.useSession();
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    // ✅ সেশন থাকলে সাকসেস টোস্ট দেখাবে
    if (session?.user && !hasShownToast) {
      toast.success(`Welcome back, ${session.user.name}!`);
      setHasShownToast(true);
    }
  }, [session, hasShownToast]);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      
      {/* HeroSlider এর কন্টেইনার */}
      <div className="-mt-20 relative z-0">
        <Suspense fallback={<div className="h-[85vh] w-full bg-muted animate-pulse" />}>
          <HeroSlider />
        </Suspense>
      </div>
      
      <div className="relative z-10">
        <FeaturedStudios />
        <FlagshipStudios /> 
        <Categories />
        <HowItWorks />
        <ImageMarquee />
        <HostGuarantee />
      </div>

    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-muted animate-pulse" />}>
      <HomeContent />
    </Suspense>
  );
}