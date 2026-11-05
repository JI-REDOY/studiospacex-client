"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { authClient } from "@/lib/auth-client";
import StudioCard, { Studio } from "@/components/cards/StudioCard";
import FlagshipCard from "@/components/cards/FlagshipCard";
import { Heart, Sparkles, Search, SlidersHorizontal, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/shared/Loader";

const categories = ["All", "Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

function WishlistContent() {
  const { data: session, isPending } = authClient.useSession();
  const [savedStudios, setSavedStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!session?.user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        // ✅ URL টি ঠিক করা হয়েছে
        const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${session.user.email}`);
        
        if (!userRes.ok) throw new Error("Failed to fetch user data");

        const userData = await userRes.json();
        const savedIds = userData.savedStudios || [];

        if (savedIds.length > 0) {
          const studiosRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/all`);
          const studiosData = await studiosRes.json();

          if (Array.isArray(studiosData)) {
            const filtered = studiosData.filter((studio: Studio) => 
              savedIds.includes(studio._id)
            );
            setSavedStudios(filtered);
          }
        }
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [session]);

  const filteredStudios = savedStudios.filter((studio: any) => {
    let matchesCategory = false;
    if (activeCategory === "All") matchesCategory = true;
    else if (activeCategory === "Flagship") matchesCategory = studio.isFlagship === true;
    else matchesCategory = studio.category === activeCategory;

    const matchesSearch = studio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      studio.location.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = true;
    if (priceRange === "low") matchesPrice = studio.hourlyRate <= 100;
    if (priceRange === "high") matchesPrice = studio.hourlyRate > 100;

    let matchesRating = true;
    if (minRating > 0) matchesRating = studio.rating >= minRating;

    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });

  if (isPending || isLoading) {
    return <Loader />;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Please login to view your wishlist</h2>
        <Link href="/login">
          <Button className="rounded-full">Login Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="container mx-auto px-4 md:px-8 pt-28 pb-16 relative z-10 min-h-screen">
      
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-4">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 text-foreground">
          My Wishlist
        </h1>
        <p className="text-muted-foreground text-lg">
          All the premium studios you saved for later.
        </p>
      </div>

      {filteredStudios.length === 0 ? (
        <div className="text-center py-24 bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 rounded-[2.5rem]">
          <Sparkles className="h-16 w-16 mx-auto mb-6 text-muted-foreground opacity-30" />
          <h3 className="text-2xl font-bold mb-2 text-foreground">
            {savedStudios.length === 0 ? "Your wishlist is empty" : "No matching studios found"}
          </h3>
          <p className="text-muted-foreground mb-8">
            {savedStudios.length === 0 
              ? "You haven't saved any studios yet." 
              : "Try adjusting your search or filter options."}
          </p>
          <Link href="/studios">
            <Button className="rounded-full px-8 h-12 text-lg">
              Explore Studios
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudios.map((studio, index) => (
            studio.isFlagship ? (
              <FlagshipCard key={studio._id} studio={studio} index={index} />
            ) : (
              <StudioCard key={studio._id} studio={studio} index={index} />
            )
          ))}
        </div>
      )}
    </div>
  );
}

export default function WishlistPage() {
  return (
    <Suspense fallback={<Loader />}>
      <WishlistContent />
    </Suspense>
  );
}