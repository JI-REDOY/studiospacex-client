"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Aperture, Mail, Lock, User, UploadCloud, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const Typewriter = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}<span className="animate-pulse text-primary">|</span></span>;
};

export default function RegisterPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session) {
      window.location.href = "/";
    }
  }, [session]);

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

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setPasswordError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const isLongEnough = password.length >= 6;

    if (!hasUppercase || !hasLowercase || !isLongEnough) {
      setPasswordError("Password must contain at least one uppercase, one lowercase, and be 6+ characters long.");
      setIsLoading(false);
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload a profile picture");
      setIsLoading(false);
      return;
    }

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: imageUrl,
    });

    if (error) {
      toast.error(error.message || "Registration failed");
      setIsLoading(false);
    } else {
      toast.success("Account created successfully!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: typeof window !== "undefined" ? window.location.origin : "/"
      });
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  if (isPending || session) return <div className="min-h-screen bg-background"></div>;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 pt-28 relative overflow-hidden">      
    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md space-y-8 bg-white/5 dark:bg-black/10 backdrop-blur-[2px] border border-white/20 dark:border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl relative z-10">

        <div className="text-center">
          <div className="inline-flex bg-primary/10 p-3 rounded-2xl mb-4 relative items-center justify-center">
            <Aperture className="h-10 w-10 text-primary animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-3 w-3 rounded-full bg-yellow-500 animate-ping absolute" />
              <div className="h-2 w-2 rounded-full bg-yellow-500 z-10" />
            </div>
          </div>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-foreground min-h-[40px]">
            <Typewriter text="Create an account" delay={80} />
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Join StudioSpace to book or host spaces</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input name="name" placeholder="John Doe" required className="pl-10 h-12 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input name="email" type="email" placeholder="m@example.com" required className="pl-10 h-12 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Profile Picture</label>
            <div className="flex items-center gap-4">
              <Input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} className="hidden" />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-grow h-12 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 hover:bg-primary/20 hover:text-primary transition-all rounded-xl"
              >
                <UploadCloud className="mr-2 h-5 w-5" />
                {isUploading ? "Uploading..." : "Upload from PC"}
              </Button>
              {imageUrl && (
                <div className="relative h-12 w-12 rounded-full overflow-hidden border border-white/20 shrink-0 shadow-lg">
                  <Image src={imageUrl} alt="Uploaded" fill sizes="48px" className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="pl-10 pr-10 h-12 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
          </div>
          <Button type="submit" className="w-full rounded-full h-12 text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-transform" disabled={isLoading || isUploading}>
            {isLoading ? "Creating account..." : "Register"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/20 dark:border-white/10" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background/50 backdrop-blur-sm px-2 text-muted-foreground rounded-full">Or continue with</span></div>
        </div>

        <Button variant="outline" className="w-full rounded-full h-12 bg-white/5 dark:bg-black/10 border-white/20 dark:border-white/10 hover:bg-white/10 dark:hover:bg-white/5" onClick={handleGoogleLogin} type="button">
          Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}