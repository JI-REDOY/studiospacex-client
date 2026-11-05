"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

const images = [
  { src: "/banner-01.jpg", title: "Cinematic Stage", tag: "Film" },
  { src: "/banner-02.jpg", title: "Pro Photo Studio", tag: "Photo" },
  { src: "/banner-03.jpg", title: "Podcast Lounge", tag: "Audio" },
  { src: "/banner-04.jpg", title: "Music Suite", tag: "Music" },
  { src: "/banner-05.jpg", title: "Art Workshop", tag: "Art" },
];

export default function ImageMarquee() {
  const marqueeImages = [...images, ...images, ...images];

  return (
    <section className="w-full py-16 overflow-hidden relative">
      
      <div className="relative flex overflow-x-hidden group">
        
        <div className="animate-marquee whitespace-nowrap flex gap-6 pr-6 group-hover:[animation-play-state:paused] z-10">
          {marqueeImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`group/card relative rounded-3xl overflow-hidden shrink-0 border border-white/20 dark:border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] ${
                idx % 2 === 0 
                  ? "w-[280px] h-[420px] mt-0" 
                  : "w-[450px] h-[280px] mt-12"
              }`}
            >
              <Image 
                src={img.src} 
                alt={img.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover/card:scale-110" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/20 backdrop-blur-md px-2 py-1 rounded-md border border-primary/30">
                      {img.tag}
                    </span>
                    <h4 className="text-white font-bold text-lg mt-1 drop-shadow-md">
                      {img.title}
                    </h4>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover/card:bg-primary transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="animate-marquee whitespace-nowrap flex gap-6 pr-6 group-hover:[animation-play-state:paused] z-10" aria-hidden="true">
          {marqueeImages.map((img, idx) => (
            <div 
              key={idx} 
              className={`group/card relative rounded-3xl overflow-hidden shrink-0 border border-white/20 dark:border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)] ${
                idx % 2 === 0 
                  ? "w-[280px] h-[420px] mt-0" 
                  : "w-[450px] h-[280px] mt-12" 
              }`}
            >
              <Image 
                src={img.src} 
                alt={img.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover/card:scale-110" 
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/20 backdrop-blur-md px-2 py-1 rounded-md border border-primary/30">
                      {img.tag}
                    </span>
                    <h4 className="text-white font-bold text-lg mt-1 drop-shadow-md">
                      {img.title}
                    </h4>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover/card:bg-primary transition-colors">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </section>
  );
}