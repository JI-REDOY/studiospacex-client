"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

const Typewriter = ({ text, delay = 100 }: { text: string; delay?: number }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentText("");
    setCurrentIndex(0);
  }, [text]);

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

const slides = [
  {
    id: 1,
    titleTop: "Book or Rent",
    titleAccent: "Creative Studio",
    titleBottom: "Your Dream Space",
    subtitle: "Premium studios. Flexible options. A seamless experience to get your creative project on the road.",
    image: "/banner-01.jpg",
    cta1: "Explore Studios",
    link1: "/studios",
    cta2: "Host Your Space",
    link2: "/add-studio"
  },
  {
    id: 2,
    titleTop: "Shoot in",
    titleAccent: "Cinema Stage",
    titleBottom: "For Top Productions",
    subtitle: "High-end sound stages and photography cyc walls designed for demanding professional productions.",
    image: "/banner-02.jpg",
    cta1: "View Sound Stages",
    link1: "/studios?category=Film Stage",
    cta2: "Learn More",
    link2: "/#how-it-works"
  },
  {
    id: 3,
    titleTop: "Record your",
    titleAccent: "Podcast Lounge",
    titleBottom: "With Studio Quality",
    subtitle: "Fully equipped podcast lounges and music suites with broadcast-grade mics and acoustic design.",
    image: "/banner-03.jpg",
    cta1: "Find Podcast Rooms",
    link1: "/studios?category=Podcast Lounge",
    cta2: "View Pricing",
    link2: "/studios"
  },
  {
    id: 4,
    titleTop: "Create your",
    titleAccent: "Music Suite",
    titleBottom: "Hit the Right Note",
    subtitle: "Professional music recording studios with top-tier soundproofing and premium instruments.",
    image: "/banner-04.jpg",
    cta1: "Explore Music Suites",
    link1: "/studios?category=Music Suite",
    cta2: "Book a Session",
    link2: "/studios"
  },
  {
    id: 5,
    titleTop: "Host your",
    titleAccent: "Art Workshop",
    titleBottom: "Inspire Others",
    subtitle: "Bright and spacious workshops designed for creativity, collaboration, and artistic growth.",
    image: "/banner-05.jpg",
    cta1: "Find Workshops",
    link1: "/studios?category=Workshop",
    cta2: "Become a Host",
    link2: "/add-studio"
  }
];

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="w-full relative h-[85vh] min-h-[550px] md:min-h-[500px] lg:min-h-[600px] bg-black">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            
            {/* ✅ ওভারলে হালকা করা হয়েছে (bg-black/40 থেকে bg-black/20) যাতে ছবি উজ্জ্বল দেখায় */}
            <div className="absolute inset-0 bg-black/20 md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent" />

            <div className="absolute inset-0 z-10 flex items-center pt-24 md:pt-20">
              <div className="w-full px-6 md:px-8 md:container md:mx-auto">
                <div className="w-full md:w-2/3 lg:w-1/2 text-center md:text-left">
                  
                  {/* ✅ ১৯ ইঞ্চি স্ক্রিনের জন্য টেক্সট সাইজ অ্যাডজাস্ট করা হয়েছে */}
                  <h1 className="text-4xl md:text-4xl lg:text-7xl font-bold text-white mb-3 md:mb-4 lg:mb-6 leading-[1.1] font-[family-name:var(--font-playfair)] drop-shadow-lg">
                    {slide.titleTop} <br />
                    <span className="text-primary italic drop-shadow-md">
                      {activeSlide === index ? (
                        <Typewriter text={slide.titleAccent} />
                      ) : (
                        slide.titleAccent
                      )}
                    </span> <br />
                    {slide.titleBottom}
                  </h1>
                  
                  <p className="text-sm md:text-sm lg:text-xl text-gray-200 mb-5 md:mb-6 lg:mb-8 max-w-md mx-auto md:mx-0 leading-relaxed drop-shadow-md">
                    {slide.subtitle}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 md:gap-4 w-full">
                    <Link href={slide.link1} className="w-full sm:w-auto">
                      <Button 
                        size="lg" 
                        className="w-full sm:w-auto rounded-full px-6 md:px-6 lg:px-8 py-5 md:py-4 lg:py-6 text-sm md:text-sm lg:text-lg font-bold text-white
                        bg-gradient-to-b from-[#10b981] to-[#059669]
                        shadow-[0_0_20px_rgba(16,185,129,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)]
                        hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all border-none"
                      >
                        {slide.cta1} <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                      </Button>
                    </Link>
                    
                    <Link href={slide.link2} className="w-full sm:w-auto">
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="w-full sm:w-auto rounded-full px-6 md:px-6 lg:px-8 py-5 md:py-4 lg:py-6 text-sm md:text-sm lg:text-lg font-semibold 
                        text-white/90 bg-black/40 backdrop-blur-md 
                        border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]
                        hover:bg-white/20 hover:text-white hover:border-white/40
                        transition-all duration-300"
                      >
                        <Play className="mr-2 h-4 w-4 lg:h-5 lg:w-5" /> {slide.cta2}
                      </Button>
                    </Link>
                  </div>

                </div>
              </div>
            </div>

          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-pagination {
          bottom: 20px !important;
          text-align: center !important;
        }
        @media (min-width: 768px) {
          .swiper-pagination {
            bottom: 30px !important;
            text-align: left !important;
            padding-left: 5% !important;
          }
        }
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4);
          opacity: 1;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #10b981;
          width: 30px;
          border-radius: 6px;
        }
      `}</style>
    </section>
  );
}