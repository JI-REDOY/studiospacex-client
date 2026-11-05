"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Check, Users, Clock, User, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

export type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  location: string;
  image: string;
  rating: number;
  isFlagship?: boolean;
  ownerName?: string;
  ownerEmail?: string;
};

export default function FlagshipCard({ studio, index = 0 }: { studio: Studio; index?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${session.user.email}`);
        if (!res.ok) return;
        const result = await res.json();
        if (result && result.savedStudios) {
          setIsSaved(result.savedStudios.includes(studio._id));
        }
      } catch (error) {
        console.error("Error checking saved status", error);
      }
    };
    checkSavedStatus();

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => { if (cardRef.current) observer.unobserve(cardRef.current); };
  }, [session, studio._id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session?.user?.email) {
      return toast.error("Please login to save studios");
    }

    setIsLoading(true);
    try {
      const token = await getTokenFromClient();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/wishlist/${session.user.email}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ studioId: studio._id }),
      });
      
      if (res.ok) {
        setIsSaved(!isSaved);
        toast.success(!isSaved ? "Saved to wishlist!" : "Removed from wishlist");
      } else {
        toast.error("Failed to update wishlist");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const dummyDetails = {
    sqft: "1,200 sq ft",
    features: [
      { icon: Check, text: "Same-day booking" },
      { icon: Users, text: "Up to 15 crew" },
      { icon: Clock, text: "24/7 access" },
    ],
    pricingNote: "Half-day · Full-day · Project",
  };

  return (
    <div 
      ref={cardRef}
      style={{ transitionDelay: `${index * 150}ms` }}
      className={`group relative rounded-2xl overflow-hidden border border-yellow-500/30 hover:border-yellow-500/60 shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] transition-all duration-700 ease-out flex flex-col h-auto md:h-[460px] bg-white/5 dark:bg-black/10 backdrop-blur-[2px] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      <div className="relative w-full h-[200px] shrink-0 overflow-hidden bg-black">
        <Image src={studio.image} alt={studio.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 left-4 z-20 bg-yellow-500 text-black px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">{studio.category}</div>
        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1 border border-yellow-500/30">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" /> {studio.rating}
        </div>
        <div className="absolute bottom-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400" /> Flagship Studio
        </div>
      </div>

      <div className="relative z-20 flex-grow p-5 flex flex-col border-t border-white/20 dark:border-white/10">
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-2 line-clamp-1 text-foreground drop-shadow-sm group-hover:text-yellow-500 transition-colors">{studio.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1.5 text-yellow-500 shrink-0" /> <span className="truncate">{studio.location}</span> • {dummyDetails.sqft}
          </div>

          <div className="flex items-center text-muted-foreground text-xs font-medium mb-3">
            <User className="h-3.5 w-3.5 mr-1.5 text-yellow-500 shrink-0" /> Host: {studio.ownerName || "Unknown"}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
            {dummyDetails.features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-xs text-muted-foreground font-medium">
                <feature.icon className="h-3.5 w-3.5 mr-1.5 text-yellow-500 shrink-0" />
                {feature.text}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="w-full h-px bg-yellow-500/30 mb-4" />
          
          {/* ✅ এখানে মোবাইলের জন্য flex-col করা হয়েছে */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium mb-0.5">From</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-yellow-500">${studio.hourlyRate}</span>
                <span className="text-xs text-muted-foreground font-medium">/ hr</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1">{dummyDetails.pricingNote}</span>
            </div>
            
            <div className="flex items-center gap-2 relative z-30 w-full sm:w-auto justify-end sm:justify-start">
              <button 
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className={`p-2.5 rounded-full border transition-all duration-300 hover:scale-110 shrink-0 ${isSaved ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-500" : "bg-black/5 dark:bg-white/5 border-yellow-500/30 text-muted-foreground hover:text-yellow-500 hover:border-yellow-500/50"}`}
              >
                <Heart className={`h-4 w-4 ${isSaved ? "fill-yellow-500" : ""}`} />
              </button>
              
              <Link href={`/studios/${studio._id}`} className="flex-1 sm:flex-none">
                <Button className="w-full sm:w-auto rounded-full px-4 md:px-6 font-bold shadow-lg shadow-yellow-500/20 hover:scale-105 transition-all bg-yellow-500 text-black hover:bg-yellow-400 text-xs md:text-sm">View Details</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}