"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Trash2, Edit, Plus, MapPin, Star, Check, Users, Clock, Search } from "lucide-react";
import Image from "next/image";
import { getTokenFromClient } from "@/lib/getTokenFromClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyListingsPage() {
  const { data: session, isPending } = authClient.useSession();
  const [studios, setStudios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (session?.user?.email) fetchStudios();
    else if (!isPending) setIsLoading(false);
  }, [session, isPending]);

  const fetchStudios = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-listings/${session?.user?.email}`);
      const data = await res.json();
      setStudios(data);
    } catch (error) {
      toast.error("Failed to load listings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getTokenFromClient();
      if (!token) return toast.error("Session expired. Please login again.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Studio deleted successfully");
        setStudios(studios.filter(s => s._id !== id));
      } else {
        toast.error("Failed to delete studio");
      }
    } catch (error) {
      toast.error("Failed to delete studio");
    }
  };

  const filteredStudios = studios.filter((studio) =>
    studio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    studio.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dummyDetails = {
    sqft: "1,200 sq ft",
    features: [
      { icon: Check, text: "Same-day booking" },
      { icon: Users, text: "Up to 15 crew" },
      { icon: Clock, text: "24/7 access" },
    ],
    pricingNote: "Half-day · Full-day · Project",
  };

  if (isPending || isLoading) {
    return (
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl relative z-10 min-h-screen">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left space-y-3">
            <div className="h-10 w-64 bg-white/10 dark:bg-white/5 rounded-lg animate-pulse mx-auto md:mx-0"></div>
            <div className="h-5 w-80 bg-white/10 dark:bg-white/5 rounded-md animate-pulse mx-auto md:mx-0"></div>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="h-12 w-72 bg-white/10 dark:bg-white/5 rounded-full animate-pulse"></div>
            <div className="h-12 w-40 bg-white/10 dark:bg-white/5 rounded-full animate-pulse hidden sm:block"></div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-auto md:h-[260px] rounded-3xl border border-white/10 bg-white/5 dark:bg-black/10 flex flex-col md:flex-row overflow-hidden animate-pulse">
              <div className="w-full md:w-[300px] h-[200px] md:h-full bg-black/20 dark:bg-white/5 shrink-0" />
              <div className="p-6 flex flex-col flex-grow">
                <div className="h-8 w-3/4 bg-black/10 dark:bg-white/10 rounded-md mb-4"></div>
                <div className="h-4 w-1/2 bg-black/10 dark:bg-white/10 rounded-md mb-6"></div>
                <div className="flex gap-4 mb-4">
                  <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded-md"></div>
                  <div className="h-4 w-24 bg-black/10 dark:bg-white/10 rounded-md"></div>
                </div>
                <div className="mt-auto flex justify-between items-end pt-4 border-t border-white/5">
                  <div>
                    <div className="h-3 w-10 bg-black/10 dark:bg-white/10 rounded-md mb-2"></div>
                    <div className="h-8 w-24 bg-black/10 dark:bg-white/10 rounded-md"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-10 w-24 bg-black/10 dark:bg-white/10 rounded-full"></div>
                    <div className="h-10 w-24 bg-black/10 dark:bg-white/10 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!session) return <div className="text-center py-20 font-bold text-foreground">Please login to view listings.</div>;

  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl relative z-10 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-2 text-foreground">
            My Studio Listings
          </h1>
          <p className="text-muted-foreground text-lg">Manage the spaces you have listed for rent.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
            <Input
              placeholder="Search listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-full bg-white/5 dark:bg-black/20 backdrop-blur-md border-white/10 dark:border-white/5 focus-visible:ring-2 focus-visible:ring-primary shadow-inner text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Link href="/add-studio" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto rounded-full h-12 px-6 text-base font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all">
              <Plus className="mr-2 h-5 w-5" /> Add New Studio
            </Button>
          </Link>
        </div>
      </div>

      {filteredStudios.length === 0 ? (
        <div className="text-center py-32 bg-white/5 dark:bg-black/10 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2rem]">
          <h3 className="text-2xl font-bold mb-2 text-foreground">
            {studios.length === 0 ? "No listings yet" : "No studios found"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {studios.length === 0
              ? "Start earning by hosting your creative space."
              : "Try adjusting your search query."}
          </p>
          {studios.length === 0 && (
            <Link href="/add-studio">
              <Button className="rounded-full">Create Your First Listing</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredStudios.map((studio: any) => (
            <div
              key={studio._id}
              className={`group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-auto md:h-[260px] ${
                studio.isFlagship 
                  ? "border border-yellow-500/40 hover:border-yellow-500/70 shadow-[0_0_20px_rgba(234,179,8,0.1)]" 
                  : "border border-border/50 hover:border-primary/50"
              }`}
            >
              <div className="relative w-full md:w-[300px] h-[220px] md:h-full shrink-0 overflow-hidden bg-black">
                <Image
                  src={studio.image}
                  alt={studio.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground shadow-sm">
                  {studio.category}
                </div>

                {studio.isFlagship && (
                  <div className="absolute bottom-4 left-4 z-20 bg-yellow-500 text-black px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                    <Star className="h-3 w-3 fill-black" /> Flagship
                  </div>
                )}
                
                <div className={`absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${studio.isFlagship ? "text-yellow-400 border border-yellow-500/30" : "text-white"}`}>
                  <Star className={`h-3.5 w-3.5 ${studio.isFlagship ? "fill-yellow-400 text-yellow-400" : "fill-primary text-primary"}`} /> {studio.rating || 5.0}
                </div>
              </div>

              <div className="relative z-20 flex-grow p-6 flex flex-col bg-white/5 dark:bg-black/10 backdrop-blur-[2px] border-t md:border-t-0 md:border-l border-white/20 dark:border-white/10">
                <div className="flex-grow">
                  <h3 className={`text-2xl font-bold mb-2 line-clamp-1 drop-shadow-sm ${studio.isFlagship ? "text-yellow-500" : "text-foreground"}`}>
                    {studio.title}
                  </h3>
                  
                  <div className="flex items-center text-muted-foreground text-sm mb-3">
                    <MapPin className={`h-4 w-4 mr-1.5 shrink-0 ${studio.isFlagship ? "text-yellow-500" : "text-primary"}`} />
                    <span className="truncate">{studio.location || "Location not available"}</span> • 
                    <span className="ml-1 whitespace-nowrap">{dummyDetails.sqft}</span>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                    {dummyDetails.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs text-muted-foreground font-medium">
                        <feature.icon className={`h-4 w-4 mr-2 shrink-0 ${studio.isFlagship ? "text-yellow-500" : "text-primary"}`} />
                        {feature.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ✅ এখানে হরাইজন্টাল ডিভাইডার এবং flex-wrap ঠিক করা হয়েছে */}
                <div className="mt-auto pt-4 border-t border-zinc-300 dark:border-zinc-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium mb-0.5">From</span>
                    <div className="flex items-baseline gap-1">
                      <span className={`text-2xl font-bold ${studio.isFlagship ? "text-yellow-500" : "text-primary"}`}>${studio.hourlyRate}</span>
                      <span className="text-xs text-muted-foreground font-medium">/ hr</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <Link href={`/studios/edit/${studio._id}`} className="flex-1 sm:flex-none">
                      <Button variant="outline" className="w-full rounded-full h-10 px-5 border-white/20 dark:border-white/10 hover:bg-primary/20 hover:text-primary transition-colors">
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                    </Link>

                    <AlertDialog>
                      <AlertDialogTrigger className="flex-1 sm:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white h-10 px-5 border border-red-500/20">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background/80 backdrop-blur-2xl border-white/10 dark:border-white/5">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your studio listing.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(studio._id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}