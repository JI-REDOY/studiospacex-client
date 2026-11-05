"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Aperture, Mail, Lock, Eye, EyeOff } from "lucide-react";

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

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      toast.error(error.message || "Invalid credentials");
      setIsLoading(false);
    } else {
      toast.success("Logged in successfully! Welcome back.");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // ✅ গুগলে রিডাইরেক্ট করার আগে টোস্ট দেখাবে
      toast.loading("Redirecting to Google...", { id: "google-login" });
      
      await authClient.signIn.social({ 
        provider: "google",
        callbackURL: typeof window !== "undefined" ? window.location.origin : "/" 
      });
      
    } catch (error) {
      // ✅ কোনো এরর হলে টোস্ট দেখাবে
      toast.error("Google login failed", { id: "google-login" });
    }
  };

  if (isPending || session) return <div className="min-h-screen bg-background"></div>;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 pt-28 relative overflow-hidden">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />

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
            <Typewriter text="Welcome back" delay={80} />
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input name="email" type="email" placeholder="m@example.com" required className="pl-10 h-12 bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10" />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium">Password</label>
              <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
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
          </div>
          <Button type="submit" className="w-full rounded-full h-12 text-lg font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] transition-transform" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
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
          Don't have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}