"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, Film, Mic, Music, Palette, ArrowUpRight } from "lucide-react";
import Image from "next/image";

const categoryData = [
  { 
    name: "Photo Studio", 
    title: "Photo Studios", 
    icon: Camera, 
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop", 
    color: "text-blue-400", 
    bg: "bg-blue-500/10",
    hoverBg: "group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500",
    border: "border-white/10"
  },
  { 
    name: "Film Stage", 
    title: "Sound Stages", 
    icon: Film, 
    image: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=800&auto=format&fit=crop", 
    color: "text-purple-400", 
    bg: "bg-purple-500/10",
    hoverBg: "group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500",
    border: "border-white/10"
  },
  { 
    name: "Podcast Lounge", 
    title: "Podcast Rooms", 
    icon: Mic, 
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop", 
    color: "text-orange-400", 
    bg: "bg-orange-500/10",
    hoverBg: "group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500",
    border: "border-white/10"
  },
  { 
    name: "Music Suite", 
    title: "Music Suites", 
    icon: Music, 
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop", 
    color: "text-pink-400", 
    bg: "bg-pink-500/10",
    hoverBg: "group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500",
    border: "border-white/10"
  },
  { 
    name: "Workshop", 
    title: "Art Workshops", 
    icon: Palette, 
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop", 
    color: "text-green-400", 
    bg: "bg-green-500/10",
    hoverBg: "group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500",
    border: "border-white/10"
  },
];

export default function Categories() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    const fetchCounts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios`);
        const data = await res.json();
        
        const countMap: Record<string, number> = {};
        if (Array.isArray(data)) {
          data.forEach((studio: any) => {
            countMap[studio.category] = (countMap[studio.category] || 0) + 1;
          });
        }
        setCounts(countMap);
      } catch (error) {
        console.error("Failed to fetch category counts", error);
      }
    };
    fetchCounts();

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 text-foreground">
            Browse by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Find the perfect space tailored to your creative needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {categoryData.map((category, index) => (
            <Link 
              key={index} 
              href={`/studios?category=${category.name}`}
              className={`group relative h-[280px] lg:h-[320px] rounded-[2rem] overflow-hidden border ${category.border} transition-all duration-700 hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${index * 100}ms` }} 
            >
              <Image
                src={category.image}
                alt={category.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                <div className="flex justify-end">
                  <div className={`p-3 rounded-2xl backdrop-blur-md border transition-all duration-300 ${category.bg} ${category.color} ${category.hoverBg}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-xl text-white mb-1 transition-transform duration-300 group-hover:translate-x-1">
                    {category.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70 font-medium">
                      {counts[category.name] !== undefined ? counts[category.name] : 0} Spaces
                    </p>
                    <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}