"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import StudioCard, { Studio } from "@/components/cards/StudioCard";
import FlagshipCard from "@/components/cards/FlagshipCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import Loader from "@/components/shared/Loader";

const categories = ["All", "Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

function StudiosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || "All";

  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  
  // ✅ ফিল্টার স্টেট
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    const fetchStudios = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios`);
        const data = await res.json();
        if (Array.isArray(data)) setStudios(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudios();
  }, []);

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "All") router.push("/studios");
    else router.push(`/studios?category=${cat}`);
  };

  const filteredStudios = studios.filter((studio: any) => {
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
    if (minRating > 0) matchesRating = (studio.rating || 5.0) >= minRating;

    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });

  // ✅ ফিল্টার রিসেট করার ফাংশন
  const resetFilters = () => {
    setPriceRange("all");
    setMinRating(0);
    setSearchQuery("");
    handleCategoryClick("All");
  };

  return (
    <div className="container mx-auto px-4 md:px-8 pt-28 pb-16 relative z-10 min-h-screen">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-[family-name:var(--font-playfair)] mb-4 text-foreground drop-shadow-sm">
          Explore Creative Spaces
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Find the perfect studio for your next big production.
        </p>
      </div>

      {/* ✅ সার্চ এবং ফিল্টার বার */}
      <div className="sticky top-24 z-40 bg-white/10 dark:bg-black/40 backdrop-blur-2xl p-4 md:p-6 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl mb-12">
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
          {/* সার্চ ইনপুট */}
          <div className="relative w-full lg:w-96 flex items-center gap-3">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full bg-white/10 dark:bg-black/50 border-white/20 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-primary text-base shadow-inner backdrop-blur-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
            {/* ফিল্টার বাটন (মোবাইলে টেক্সট লুকানো থাকবে, শুধু আইকন দেখাবে) */}
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              className={`rounded-full h-12 px-4 md:px-6 shrink-0 transition-all ${
                showFilters ? "bg-primary text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "bg-white/10 dark:bg-black/50 text-foreground hover:bg-white/20"
              }`}
            >
              <SlidersHorizontal className="h-5 w-5 md:mr-2" /> 
              <span className="hidden md:inline">Filters</span>
            </Button>
          </div>

          {/* ক্যাটাগরি বাটন */}
          <div className="flex flex-wrap justify-center gap-2 w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105"
                    : "bg-white/5 dark:bg-white/5 text-muted-foreground hover:bg-white/20 dark:hover:bg-white/10 hover:text-foreground border border-transparent dark:border-white/5 backdrop-blur-sm"
                  }`}
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => handleCategoryClick("Flagship")}
              className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 flex items-center gap-1 ${activeCategory === "Flagship"
                  ? "bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.4)] scale-105"
                  : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 hover:bg-yellow-500 hover:text-black"
                }`}
            >
              <Star className="h-3 w-3 fill-current" /> Flagship
            </button>
          </div>
        </div>

        {/* ✅ অ্যাডভান্সড ফিল্টার ড্রপডাউন */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-white/20 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4 fade-in duration-300 relative">
            
            {/* রিসেট বাটন */}
            <button onClick={resetFilters} className="absolute top-6 right-0 text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
              <X className="h-3 w-3" /> Reset
            </button>

            {/* প্রাইস ফিল্টার */}
            <div>
              <p className="text-sm font-bold text-foreground mb-3">Price Range</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setPriceRange("all")} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${priceRange === "all" ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted-foreground hover:bg-white/10"}`}>Any Price</button>
                <button onClick={() => setPriceRange("low")} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${priceRange === "low" ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted-foreground hover:bg-white/10"}`}>Under $100</button>
                <button onClick={() => setPriceRange("high")} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${priceRange === "high" ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted-foreground hover:bg-white/10"}`}>$100+</button>
              </div>
            </div>

            {/* রেটিং ফিল্টার */}
            <div>
              <p className="text-sm font-bold text-foreground mb-3">Minimum Rating</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setMinRating(0)} className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-1 transition-colors ${minRating === 0 ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted-foreground hover:bg-white/10"}`}>Any</button>
                <button onClick={() => setMinRating(4.5)} className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-1 transition-colors ${minRating === 4.5 ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted-foreground hover:bg-white/10"}`}>4.5+ <Star className="h-3 w-3 fill-current" /></button>
                <button onClick={() => setMinRating(5)} className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center gap-1 transition-colors ${minRating === 5 ? "bg-primary/20 border-primary text-primary" : "border-white/10 text-muted-foreground hover:bg-white/10"}`}>5.0 <Star className="h-3 w-3 fill-current" /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ স্টুডিও গ্রিড */}
      {isLoading ? (
        <Loader />
      ) : filteredStudios.length === 0 ? (
        <div className="text-center py-32 bg-white/5 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 dark:border-white/5">
          <SlidersHorizontal className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-2xl font-bold mb-2 text-foreground">No studios found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filter options.</p>
          <Button onClick={resetFilters} className="rounded-full px-8">Reset All Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudios.map((studio: any, index: number) => (
            (activeCategory === "Flagship" || studio.isFlagship === true) ? (
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

export default function StudiosPage() {
  return (
    <Suspense fallback={<Loader />}>
      <StudiosContent />
    </Suspense>
  );
}