"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FlagshipCard, { Studio } from "@/components/cards/FlagshipCard";
import { Button } from "@/components/ui/button";
import { Crown, ArrowRight } from "lucide-react";

export default function FlagshipStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios`);
        const data = await res.json();
        if (Array.isArray(data)) {
          const flagshipStudios = data.filter((s: any) => s.isFlagship === true);
          setStudios(flagshipStudios.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch flagship studios:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudios();
  }, []);

  if (isLoading) return null;
  if (studios.length === 0) return null;

  return (
    <section className="py-20 container mx-auto px-4 md:px-8">
      
      {/* ✅ মোবাইলে বাটন এবং টেক্সট সুন্দরভাবে সাজানো হলো */}
      <div className="flex flex-col-reverse md:flex-row md:items-end justify-between mb-12 gap-6">
        
        <Link href="/studios?category=Flagship" className="w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto rounded-full px-6 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">
            View All Flagships <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        
        <div className="text-center md:text-right">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-bold mb-4">
            <Crown className="h-4 w-4" /> Premium Selection
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-4 text-foreground">
            Flagship Studios
          </h2>
          <p className="text-muted-foreground max-w-xl ml-auto">
            Our most exclusive and highly-rated spaces, designed for creators who demand the absolute best.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {studios.map((studio) => (
          <FlagshipCard key={studio._id} studio={studio} />
        ))}
      </div>
    </section>
  );
}