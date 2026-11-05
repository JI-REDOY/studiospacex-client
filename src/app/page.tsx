import { Suspense } from "react";
import HeroSlider from "@/components/sections/HeroSlider";
import Categories from "@/components/sections/Categories";
import FeaturedStudios from "@/components/sections/FeaturedStudios";
import FlagshipStudios from "@/components/sections/FlagshipStudios";
import HowItWorks from "@/components/sections/HowItWorks";
import HostGuarantee from "@/components/sections/HostGuarantee";
import ImageMarquee from "@/components/sections/ImageMarquee";

export default function Home() {
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