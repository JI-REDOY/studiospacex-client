"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShieldCheck, UserCheck, Wrench, HeadphonesIcon } from "lucide-react";

const Typewriter = ({ text, delay = 50, startDelay = 0, start = false }: { text: string; delay?: number; startDelay?: number; start?: boolean }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!start) {
      setStarted(false);
      setCurrentText("");
      setCurrentIndex(0);
      return;
    }
    const timer = setTimeout(() => setStarted(true), startDelay || 0);
    return () => clearTimeout(timer);
  }, [startDelay, start]);

  useEffect(() => {
    if (started) {
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
    }
  }, [currentIndex, delay, text, started]);

  return (
    <span>
      {currentText}
      {currentIndex < text.length && started && <span className="animate-pulse text-primary">|</span>}
    </span>
  );
};

const features = [
  { icon: ShieldCheck, title: "Liability Protection", description: "Comprehensive insurance coverage for hosts and creators during every booking." },
  { icon: UserCheck, title: "Verified Profiles", description: "Every user is verified, ensuring a safe and trusted community for all." },
  { icon: Wrench, title: "Equipment Safety", description: "Strict protocols and secure environments to protect your valuable gear." },
  { icon: HeadphonesIcon, title: "24/7 Host Support", description: "Our dedicated team is always available to assist you with any issues." }
];

export default function HostGuarantee() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        <div className={`flex flex-col lg:flex-row items-center gap-16 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          
          <div className="w-full lg:w-1/2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 dark:border-white/5 group">
            <Image 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
              alt="Host Guarantee" 
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
              <h3 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-2 drop-shadow-md min-h-[32px]">
                <Typewriter text="Trusted by 15,000+ Creators" delay={40} start={isVisible} />
              </h3>
              <p className="text-white/80 text-sm min-h-[20px]">
                <Typewriter text="Join the fastest growing creative community." delay={30} startDelay={1000} start={isVisible} />
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Host Guarantee & Creator Support</span>
            
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] text-foreground mb-6 min-h-[120px]">
              Your creative journey, <br />
              <span className="text-primary">
                <Typewriter text="fully protected." delay={60} startDelay={2000} start={isVisible} />
              </span>
            </h2>

            <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
              We provide a secure, transparent, and seamless environment so you can focus on what matters most—bringing your vision to life.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1 text-foreground group-hover:text-primary transition-colors min-h-[24px]">
                      <Typewriter 
                        text={feature.title} 
                        delay={50} 
                        startDelay={3000 + (index * 500)} 
                        start={isVisible}
                      />
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}