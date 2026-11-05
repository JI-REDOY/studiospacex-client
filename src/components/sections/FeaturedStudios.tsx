"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import StudioCard, { Studio } from "@/components/cards/StudioCard";
import { Button } from "@/components/ui/button";

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/featured`);
        const data = await res.json();
        setStudios(data); 
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudios();
  }, []);

  return (
    <section className="py-20 container mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-4">
            Featured Studios
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Discover our top-rated creative spaces, fully equipped and ready for your next big project.
          </p>
        </div>
        <Link href="/studios">
          <Button variant="outline" className="rounded-full px-6">
            View All Studios
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[400px] bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="text-center py-10 bg-secondary/20 rounded-2xl border border-border">
          <p className="text-muted-foreground">No studios found. Be the first to add one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </section>
  );
}