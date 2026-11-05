"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, UploadCloud, CheckCircle2, Star, Plus, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/shared/Loader";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const availableAmenities = [
  "Wi-Fi", "Lighting", "Coffee Bar", "Makeup Room", "Soundproofing",
  "Air Conditioning", "Parking", "Changing Room", "Equipment Rental", "Green Screen",
];

export default function EditStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [studioData, setStudioData] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isFlagship, setIsFlagship] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`);
        const result = await res.json();
        
        if (result && result._id) {
          setStudioData(result);
          setImageUrl(result.image);
          setIsFlagship(result.isFlagship || false);

          if (result.amenities) {
            setSelectedAmenities(result.amenities.split(",").map((a: string) => a.trim()));
          }
        } else {
          toast.error("Studio not found");
          router.push("/my-listings");
        }
      } catch (error) {
        toast.error("Error fetching studio");
      } finally {
        setIsFetching(false);
      }
    };
    fetchStudio();
  }, [id, router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: formData
      });
      const result = await res.json();

      if (result.success) {
        setImageUrl(result.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      toast.error("Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) => prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]);
  };

  const handleAddCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (!trimmed) return;
    const exists = selectedAmenities.some((a) => a.toLowerCase() === trimmed.toLowerCase());
    if (exists) return toast.error("This amenity is already added");
    setSelectedAmenities([...selectedAmenities, trimmed]);
    setCustomAmenity("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedAmenities.length === 0) return toast.error("Please select at least one amenity");

    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const token = await getTokenFromClient();
      if (!token) {
        toast.error("Session expired. Please login again.");
        setIsLoading(false);
        return;
      }

      const updatedData = {
        ...data,
        hourlyRate: Number(data.hourlyRate),
        securityDeposit: Number(data.securityDeposit),
        capacity: Number(data.capacity),
        sqft: Number(data.sqft),
        image: imageUrl,
        isFlagship: isFlagship,
        amenities: selectedAmenities.join(", "),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        toast.success("Studio updated successfully!");
        router.push("/my-listings");
      } else {
        toast.error("Failed to update");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching || isPending) return <Loader />;
  if (!session) return <div className="text-center py-20 font-bold">Please login.</div>;
  if (!studioData) return null;

  const customAmenities = selectedAmenities.filter((a) => !availableAmenities.includes(a));

  return (
    <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl relative z-10 min-h-screen">
      <Link href="/my-listings" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
      </Link>

      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-2 text-foreground">
          Edit Your Studio
        </h1>
        <p className="text-muted-foreground">Update the details of your creative space.</p>
      </div>

      <div className="bg-white/5 dark:bg-black/10 backdrop-blur-[2px] border border-white/20 dark:border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/10 dark:bg-black/20 p-6 rounded-2xl border border-white/20 dark:border-white/10">
            <div>
              <label className="text-sm font-semibold mb-1 block text-muted-foreground">Host Name</label>
              <Input value={studioData.ownerName} readOnly className="bg-transparent border-none text-foreground font-medium cursor-not-allowed" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block text-muted-foreground">Host Email</label>
              <Input value={studioData.ownerEmail} readOnly className="bg-transparent border-none text-foreground font-medium cursor-not-allowed" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-1 block">Studio Title</label>
              <Input name="title" defaultValue={studioData.title} required className="bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 h-12" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <select name="category" defaultValue={studioData.category} className="flex h-12 w-full rounded-md border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" required>
                <option value="Photo Studio" className="bg-background">Photo Studio</option>
                <option value="Film Stage" className="bg-background">Film Stage</option>
                <option value="Podcast Lounge" className="bg-background">Podcast Lounge</option>
                <option value="Music Suite" className="bg-background">Music Suite</option>
                <option value="Workshop" className="bg-background">Workshop</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Hourly Rate ($)</label>
              <Input name="hourlyRate" type="number" defaultValue={studioData.hourlyRate} required className="bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 h-12" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Security Deposit ($)</label>
              <Input name="securityDeposit" type="number" defaultValue={studioData.securityDeposit} required className="bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 h-12" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Max Capacity</label>
              <Input name="capacity" type="number" defaultValue={studioData.capacity} required className="bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 h-12" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Area (Sq Ft)</label>
              <Input name="sqft" type="number" defaultValue={studioData.sqft || 1200} required className="bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 h-12" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-1 block">Location / Address</label>
              <Input name="location" defaultValue={studioData.location} required className="bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 h-12" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Studio Image</label>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="w-full md:w-auto h-12 px-6 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-primary/20 hover:text-primary transition-all rounded-xl">
                <UploadCloud className="mr-2 h-5 w-5" />
                {isUploading ? "Uploading..." : "Change Image"}
              </Button>
              {imageUrl && (
                <div className="relative h-16 w-24 rounded-lg overflow-hidden border border-white/20">
                  <Image src={imageUrl} alt="Uploaded" fill sizes="96px" className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedAmenities.includes(amenity) ? "bg-primary/10 border-primary/50" : "bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-white/20"}`}>
                  <input type="checkbox" checked={selectedAmenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} className="w-4 h-4 rounded border-white/20 text-primary focus:ring-primary cursor-pointer" />
                  <span className="text-sm font-medium text-foreground">{amenity}</span>
                </label>
              ))}
              <div className="flex items-center gap-2 p-2 rounded-xl border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 md:col-span-2">
                <Input value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)} placeholder="Add custom amenity..." className="h-9 bg-transparent border-none focus-visible:ring-0" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomAmenity(); } }} />
                <Button type="button" onClick={handleAddCustomAmenity} className="h-8 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
            <input type="checkbox" id="flagship" checked={isFlagship} onChange={(e) => setIsFlagship(e.target.checked)} className="w-5 h-5 rounded border-yellow-500 text-yellow-500 focus:ring-yellow-500 cursor-pointer" />
            <label htmlFor="flagship" className="flex items-center gap-2 cursor-pointer">
              <Star className={`h-5 w-5 ${isFlagship ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
              <span className="font-semibold text-foreground">Mark as Flagship Studio</span>
            </label>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Detailed Overview</label>
            <textarea name="description" defaultValue={studioData.description} className="flex min-h-[120px] w-full rounded-md border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/20 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" required />
          </div>

          <Button type="submit" className="w-full rounded-full h-14 text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-transform" disabled={isLoading || isUploading}>
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}