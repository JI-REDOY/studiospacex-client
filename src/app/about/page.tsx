"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShieldCheck, Camera, Heart, Sparkles } from "lucide-react";

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
    } else {
      const timeout = setTimeout(() => {
        setCurrentText("");
        setCurrentIndex(0);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}<span className="animate-pulse text-primary">|</span></span>;
};

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <div ref={sectionRef} className="container mx-auto px-4 pt-28 pb-16 max-w-7xl relative z-10 min-h-screen overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="text-center mb-24 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold tracking-wider uppercase text-xs mb-6">
          <Sparkles className="h-4 w-4" /> Our Story
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-playfair)] mb-6 text-foreground min-h-[60px] md:min-h-[80px]">
          <Typewriter text="About StudioSpace" delay={80} />
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We connect visionary creators with the perfect spaces to bring their ideas to life. From podcast lounges to cinema stages, find your next masterpiece location here.
        </p>
      </div>

      <div className={`flex flex-col lg:flex-row items-center gap-16 mb-32 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
        
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-6 text-foreground">
            Our Mission
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
            StudioSpace was founded with a single conviction: great work happens when people have great environments. We've designed every corner of our platform—from the acoustics to the coffee blends—to help you do the best work of your life.
          </p>
          <p className="text-muted-foreground leading-relaxed text-lg mb-8">
            Whether you are a photographer looking for a cyc wall, a podcaster needing a soundproof room, or a filmmaker searching for a full production stage, we provide the premium spaces that fuel your creativity.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center overflow-hidden">
                  <Image src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" width={40} height={40} className="object-cover" />
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-foreground">Join <span className="text-primary font-bold">15,000+</span> creators</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-yellow-500/30 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur-[2px]">
            <Image 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
              alt="Team working" 
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
        {[
          { value: "500+", label: "Premium Studios" },
          { value: "15K+", label: "Happy Creators" },
          { value: "24/7", label: "Host Support" },
          { value: "99%", label: "Satisfaction Rate" }
        ].map((stat, idx) => (
          <div 
            key={idx} 
            style={{ transitionDelay: `${idx * 100}ms` }}
            className={`group relative bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 rounded-[2rem] text-center shadow-lg hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-500 hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2 drop-shadow-sm group-hover:scale-110 transition-transform duration-300">{stat.value}</h3>
            <p className="text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] text-foreground mb-4">
          Why Choose Us?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We provide an ecosystem where creators can thrive with absolute peace of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: ShieldCheck, title: "Trusted & Secure", desc: "Your data and payments are always protected with top-tier security." },
          { icon: Camera, title: "Premium Quality", desc: "Every studio is verified and equipped with industry-standard gear." },
          { icon: Heart, title: "Community First", desc: "We foster a vibrant community of creators, hosts, and innovators." }
        ].map((feature, idx) => (
          <div 
            key={idx} 
            style={{ transitionDelay: `${idx * 150}ms` }}
            className={`group relative bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-white/10 p-10 rounded-[2.5rem] text-center shadow-lg hover:border-yellow-500/30 hover:shadow-[0_8px_30px_rgba(234,179,8,0.15)] transition-all duration-700 hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 text-primary group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm">
              <feature.icon className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-yellow-500 transition-colors">{feature.title}</h3>
            <p className="text-muted-foreground text-base leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}