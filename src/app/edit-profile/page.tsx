"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, UploadCloud, User, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/components/shared/Loader";

export default function EditProfilePage() {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && session?.user?.image) {
            setImageUrl(session.user.image);
        }
        if (mounted && !isPending && !session) {
            router.push("/login");
            toast.error("Please login to edit your profile");
        }
    }, [session, isPending, router, mounted]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
                method: "POST",
                body: formData,
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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!imageUrl) {
            toast.error("Please upload a profile picture");
            return;
        }

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;

        const { error } = await authClient.updateUser({
            name: name,
            image: imageUrl,
        });

        if (error) {
            toast.error(error.message || "Failed to update profile");
            setIsLoading(false);
        } else {
            toast.success("Profile updated successfully!");
            router.push("/dashboard");
            router.refresh();
        }
    };

    if (!mounted || isPending) return <Loader />;
    if (!session) return null;

    return (
        <div className="container mx-auto px-4 pt-28 pb-16 max-w-4xl relative z-10 min-h-screen">
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Link>

            <div className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-2 text-foreground">
                    Edit Profile
                </h1>
                <p className="text-muted-foreground">Update your personal information and profile picture.</p>
            </div>

            <div className="bg-white/5 dark:bg-black/10 backdrop-blur-[2px] border border-white/20 dark:border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">

                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl bg-white/10">
                            {imageUrl ? (
                                <Image src={imageUrl} alt="Profile" fill sizes="128px" className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                    <User className="h-12 w-12 text-primary/50" />
                                </div>
                            )}
                        </div>

                        <Input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="h-10 px-6 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-primary/20 hover:text-primary transition-all rounded-full"
                        >
                            <UploadCloud className="mr-2 h-4 w-4" />
                            {isUploading ? "Uploading..." : "Change Picture"}
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w-lg mx-auto">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    name="name"
                                    defaultValue={session.user.name || ""}
                                    placeholder="Your Name"
                                    required
                                    className="pl-12 h-12 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    name="email"
                                    defaultValue={session.user.email || ""}
                                    readOnly
                                    className="pl-12 h-12 bg-white/5 dark:bg-black/10 border-white/10 text-muted-foreground cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 ml-1">Email cannot be changed.</p>
                        </div>
                    </div>

                    <div className="max-w-lg mx-auto pt-4">
                        <Button
                            type="submit"
                            className="w-full rounded-full h-14 text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-transform"
                            disabled={isLoading || isUploading}
                        >
                            {isLoading ? "Saving Changes..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}