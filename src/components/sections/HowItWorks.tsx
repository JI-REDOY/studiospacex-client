"use client";

import { useEffect, useRef, useState } from "react";
import { Search, CalendarCheck, CreditCard, Video, ChevronRight } from "lucide-react";

const steps = [
  { icon: Search, title: "Discover Spaces", description: "Browse our curated collection of premium studios tailored to your creative needs." },
  { icon: CalendarCheck, title: "Select Hours", description: "Choose your preferred date and time slot. Real-time availability ensures no double bookings." },
  { icon: CreditCard, title: "Book Instantly", description: "Secure your slot with our transparent pricing. No hidden fees, just pure creativity." },
  { icon: Video, title: "Create & Produce", description: "Walk in, plug in, and start creating. Everything you need is ready and waiting." }
];

export default function HowItWorks() {
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
    <section id="how-it-works" ref={sectionRef} className="py-24 relative overflow-hidden scroll-mt-24">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <style>{`
        @keyframes runArrows {
          0% { left: 5%; opacity: 0; transform: translateX(-20px); }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 85%; opacity: 0; transform: translateX(20px); }
        }
        .animate-arrows {
          animation: runArrows 3.5s linear infinite;
        }
      `}</style>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        <div className={`text-center mb-20 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="inline-block py-1 px-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 font-bold tracking-wider uppercase text-xs mb-3">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] text-foreground mb-4">
            From browse to create <br /> in four steps.
          </h2>
        </div>

        <div className="relative mt-16">
          <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-px border-t-2 border-dashed border-yellow-500/30 -z-10" />

          <div className="hidden lg:flex absolute top-[29px] animate-arrows z-0 items-center -space-x-3">
            <ChevronRight className="h-6 w-6 text-yellow-500/40" />
            <ChevronRight className="h-6 w-6 text-yellow-500/70" />
            <ChevronRight className="h-6 w-6 text-yellow-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                style={{ transitionDelay: `${index * 150}ms` }}
                className={`group relative flex flex-col items-center text-center p-6 bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[2rem] shadow-lg hover:shadow-[0_8px_30px_rgba(234,179,8,0.1)] transition-all duration-700 hover:-translate-y-2 hover:border-yellow-500/30 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              >
                <div className="relative -mt-12 mb-6">
                  <div className="bg-background w-20 h-20 rounded-full flex items-center justify-center border-4 border-yellow-500/20 group-hover:border-yellow-500 transition-colors duration-500 shadow-[0_0_20px_rgba(234,179,8,0.1)] group-hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] z-10 relative">
                    <step.icon className="h-8 w-8 text-yellow-500 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-4 border-background z-20">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-yellow-500 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}