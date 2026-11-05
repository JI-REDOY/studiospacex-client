"use client";

import Link from "next/link";
import { Aperture } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";

const Typewriter = ({ text, delay = 100, start = false }: { text: string; delay?: number; start?: boolean }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!start) {
      setCurrentText("");
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentText("");
        setCurrentIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, start]);

  const studioPart = currentText.slice(0, 6);
  const spacePart = currentText.slice(6);

  return (
    <span>
      {studioPart}
      <span className="text-primary">{spacePart}</span>
      {currentIndex < text.length && start && <span className="animate-pulse text-primary">|</span>}
    </span>
  );
};

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
      { threshold: 0.1 }
    );
    if (footerRef.current) observer.observe(footerRef.current);
    return () => { if (footerRef.current) observer.unobserve(footerRef.current); };
  }, []);

  return (
    <footer ref={footerRef} className="bg-white/5 dark:bg-black/10 backdrop-blur-[2px] border-t border-zinc-300 dark:border-zinc-700 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="relative flex items-center justify-center">
                <Aperture className="h-6 w-6 text-primary animate-spin-slow" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-ping absolute" />
                  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 z-10" />
                </div>
              </div>
              <span className="text-xl font-bold font-[family-name:var(--font-playfair)] text-foreground group-hover:text-yellow-500 transition-colors duration-300">
                <Typewriter text="StudioSpace" delay={100} start={isVisible} />
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              The premium marketplace for creators to book ready-to-use podcast, photography, and video studios by the hour.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaFacebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaInstagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaXTwitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><FaLinkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground">Quick Links</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/studios" className="hover:text-primary transition-colors">Explore Studios</Link></li>
              <li><Link href="/add-studio" className="hover:text-primary transition-colors">Host Your Space</Link></li>
              <li><Link href="/my-bookings" className="hover:text-primary transition-colors">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground">Top Categories</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/studios?category=Photo Studio" className="hover:text-primary transition-colors">Photo Studios</Link></li>
              <li><Link href="/studios?category=Film Stage" className="hover:text-primary transition-colors">Film Stages</Link></li>
              <li><Link href="/studios?category=Podcast Lounge" className="hover:text-primary transition-colors">Podcast Lounges</Link></li>
              <li><Link href="/studios?category=Music Suite" className="hover:text-primary transition-colors">Music Suites</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-foreground">Subscribe Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Get the latest updates on new studios and features.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Email Address" 
                suppressHydrationWarning={true}
                className="flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-background/50 backdrop-blur-sm px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <button type="button" className="h-10 w-full rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-md">
                Notify Me
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-zinc-300 dark:border-zinc-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}