"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { Star, MapPin, CheckCircle, ArrowLeft, CalendarDays, Quote, Users, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import BookingModal from "@/components/forms/BookingModal";

export default function StudioDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: session } = authClient.useSession();
  const [studio, setStudio] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`);
        const data = await res.json();
        setStudio(data);
      } catch (error) {
        toast.error("Failed to load studio details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudio();
  }, [id]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center animate-pulse text-2xl font-bold text-foreground">Loading...</div>;
  if (!studio) return <div className="text-center py-20 text-2xl font-bold text-foreground">Studio not found</div>;

  const isOwner = session?.user?.email === studio.ownerEmail;
  const isFlagship = studio.isFlagship === true; 

  // ✅ ৪টি ছবির গ্রিড ডিজাইন
  const galleryImages = [
    studio.image,
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?q=80&w=1000&auto=format&fit=crop"
  ];

  const reviews = [
    { name: "Sarah Jenkins", role: "Photographer", text: "Absolutely stunning space. The lighting was perfect and the host was incredibly helpful.", rating: 5 },
    { name: "Mike Ross", role: "Podcaster", text: "Great acoustics and top-tier equipment. Will definitely book again.", rating: 4.8 }
  ];

  return (
    <div className="container mx-auto px-4 md:px-8 pt-28 pb-12 max-w-7xl relative z-10">
      <Link href="/studios" className={`inline-flex items-center text-sm mb-6 transition-colors ${isFlagship ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-primary"}`}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Studios
      </Link>

      {/* ✅ গ্যালারি গ্রিড (রেসপন্সিভ) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 h-auto md:h-[50vh] md:min-h-[400px]">
        
        {/* Main Image */}
        <div className={`md:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl group h-[300px] md:h-full bg-black ${isFlagship ? "border-2 border-yellow-500/40" : "border border-white/10 dark:border-white/5"}`}>
          <Image 
            src={galleryImages[0]} 
            alt={studio.title} 
            fill 
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-6 left-6 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold shadow-lg">
            {studio.category}
          </div>
          
          {isFlagship && (
            <div className="absolute top-6 right-6 bg-yellow-500 text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
              <Star className="h-3 w-3 fill-black" /> Flagship Studio
            </div>
          )}
        </div>
        
        {/* Sub Images (Desktop only) */}
        <div className="hidden md:flex flex-col gap-4 h-full">
          <div className="relative rounded-3xl overflow-hidden h-1/2 shadow-lg border border-white/10 dark:border-white/5 bg-black">
            <Image src={galleryImages[1]} alt="Gallery 1" fill sizes="25vw" className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="relative rounded-3xl overflow-hidden h-1/2 shadow-lg border border-white/10 dark:border-white/5 bg-black">
            <Image src={galleryImages[2]} alt="Gallery 2" fill sizes="25vw" className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
        
        <div className="hidden md:flex flex-col gap-4 h-full">
          <div className="relative rounded-3xl overflow-hidden h-1/2 shadow-lg border border-white/10 dark:border-white/5 bg-black">
            <Image src={galleryImages[3]} alt="Gallery 3" fill sizes="25vw" className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
          
          {/* ✅ +12 More Photos বক্স */}
          <div className="relative rounded-3xl overflow-hidden h-1/2 shadow-lg bg-white/5 dark:bg-black/20 backdrop-blur-xl flex items-center justify-center cursor-pointer hover:bg-white/10 dark:hover:bg-black/30 transition-colors border border-white/10 dark:border-white/5">
            <span className="font-bold text-foreground text-lg">+12 More Photos</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Side: Details */}
        <div className="lg:col-span-2 space-y-12">
          
          <div>
            <h1 className={`text-4xl md:text-6xl font-bold font-[family-name:var(--font-playfair)] mb-6 ${isFlagship ? "text-yellow-500" : "text-foreground"}`}>
              {studio.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-lg">
              <div className="flex items-center">
                <MapPin className={`h-5 w-5 mr-2 ${isFlagship ? "text-yellow-500" : "text-primary"}`} /> 
                {studio.location}
              </div>
              <div className="flex items-center">
                <Star className={`h-5 w-5 mr-2 ${isFlagship ? "text-yellow-500 fill-yellow-500" : "text-accent fill-accent"}`} /> 
                {studio.rating || 5.0} Rating
              </div>
              <div className="flex items-center">
                <Users className={`h-5 w-5 mr-2 ${isFlagship ? "text-yellow-500" : "text-primary"}`} /> 
                Max {studio.capacity} People
              </div>
            </div>
          </div>

          <div className="prose max-w-none text-muted-foreground text-lg leading-relaxed">
            <h3 className="text-2xl font-bold text-foreground mb-4">About this space</h3>
            <p>{studio.description}</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 text-foreground">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {studio.amenities?.split(",").map((amenity: string, idx: number) => (
                <div key={idx} className={`flex items-center gap-3 backdrop-blur-md p-4 rounded-2xl shadow-sm ${isFlagship ? "bg-yellow-500/5 border border-yellow-500/20" : "bg-white/5 dark:bg-black/10 border border-white/10 dark:border-white/5"}`}>
                  <CheckCircle className={`h-5 w-5 shrink-0 ${isFlagship ? "text-yellow-500" : "text-primary"}`} />
                  <span className="font-medium text-foreground">{amenity.trim()}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 text-foreground">Reviews from Creators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review, idx) => (
                <div key={idx} className={`backdrop-blur-md p-6 rounded-3xl relative shadow-sm ${isFlagship ? "bg-yellow-500/5 border border-yellow-500/20" : "bg-white/5 dark:bg-black/10 border border-white/10 dark:border-white/5"}`}>
                  <Quote className={`absolute top-6 right-6 h-10 w-10 ${isFlagship ? "text-yellow-500/20" : "text-primary/20"}`} />
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(review.rating) ? (isFlagship ? "text-yellow-500 fill-yellow-500" : "text-accent fill-accent") : "text-muted"}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 italic">"{review.text}"</p>
                  <div>
                    <p className="font-bold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Booking Card */}
        <div className="lg:col-span-1">
          <div className={`backdrop-blur-xl p-8 rounded-3xl shadow-2xl sticky top-28 ${isFlagship ? "bg-yellow-500/5 border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.15)]" : "bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10"}`}>
            
            <div className="flex items-end gap-2 mb-6">
              <span className={`text-5xl font-bold ${isFlagship ? "text-yellow-500" : "text-primary"}`}>${studio.hourlyRate}</span>
              <span className="text-muted-foreground mb-1 text-lg">/ hour</span>
            </div>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-white/10 dark:border-white/5">
                <span className="text-muted-foreground">Security Deposit</span>
                <span className="font-bold text-foreground">${studio.securityDeposit}</span>
              </div>
            </div>

            <div className="mb-8 p-4 bg-white/5 dark:bg-black/20 rounded-2xl border border-white/10 dark:border-white/5">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Hosted By</p>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-primary/20 p-2 rounded-full text-primary"><User className="h-4 w-4" /></div>
                <span className="font-bold text-foreground">{studio.ownerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full text-primary"><Mail className="h-4 w-4" /></div>
                <span className="text-sm text-muted-foreground break-all">{studio.ownerEmail}</span>
              </div>
            </div>

            <Button 
              className={`w-full rounded-full h-14 text-lg font-bold shadow-lg hover:scale-105 transition-all disabled:opacity-50 ${isFlagship ? "bg-yellow-500 text-black shadow-yellow-500/20 hover:bg-yellow-400" : "bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90"}`}
              disabled={isOwner}
              onClick={() => {
                if (!session) {
                  toast.error("Please login to book a studio");
                  return;
                }
                if (isOwner) {
                  toast.error("You cannot book your own studio.");
                  return;
                }
                setIsBookingModalOpen(true);
              }}
            >
              <CalendarDays className="mr-2 h-5 w-5" /> 
              {isOwner ? "Your Studio" : "Book Workspace Now"}
            </Button>
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isBookingModalOpen} 
        setIsOpen={setIsBookingModalOpen} 
        studio={studio} 
      />
    </div>
  );
}