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

export default function StudioCard({ studio, index = 0 }: { studio: Studio; index?: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    // ✅ ইউজারের সেভ করা স্টুডিও চেক করা
    const checkSavedStatus = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/${session.user.email}`);
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
      className={`group relative rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-lg transition-all duration-700 ease-out flex flex-col h-[460px] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      <div className="relative w-full h-[200px] shrink-0 overflow-hidden bg-black">
        <Image src={studio.image} alt={studio.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground shadow-sm">{studio.category}</div>
        <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {studio.rating || 5.0}
        </div>
      </div>

      <div className="relative z-20 flex-grow p-5 flex flex-col bg-white/5 dark:bg-black/10 backdrop-blur-[2px] border-t border-white/20 dark:border-white/10">
        <div>
          <h3 className="text-2xl font-bold mb-2 line-clamp-1 text-foreground drop-shadow-sm">{studio.title}</h3>
          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1.5 text-primary" /> {studio.location} • {dummyDetails.sqft}
          </div>
          
          <div className="flex items-center text-muted-foreground text-xs font-medium mb-3">
            <User className="h-3.5 w-3.5 mr-1.5 text-primary" /> Host: {studio.ownerName || "Unknown"}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
            {dummyDetails.features.map((feature, idx) => (
              <div key={idx} className="flex items-center text-xs text-muted-foreground font-medium">
                <feature.icon className="h-3.5 w-3.5 mr-1.5 text-primary" />
                {feature.text}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="w-full h-px bg-zinc-300 dark:bg-zinc-600 mb-4" />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium mb-0.5">From</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">${studio.hourlyRate}</span>
                <span className="text-xs text-muted-foreground font-medium">/ hr</span>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1">{dummyDetails.pricingNote}</span>
            </div>
            
            {/* ✅ View Details এর পাশে Wishlist বাটন */}
            <div className="flex items-center gap-2 relative z-30">
              <button 
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className={`p-2.5 rounded-full border transition-all duration-300 hover:scale-110 ${isSaved ? "bg-primary/20 border-primary/50 text-primary" : "bg-black/5 dark:bg-white/5 border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50"}`}
              >
                <Heart className={`h-4 w-4 ${isSaved ? "fill-primary" : ""}`} />
              </button>
              
              <Link href={`/studios/${studio._id}`}>
                <Button variant="default" className="rounded-full px-6 font-semibold shadow-md hover:scale-105 transition-all bg-primary text-primary-foreground hover:bg-primary/90">View Details</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}