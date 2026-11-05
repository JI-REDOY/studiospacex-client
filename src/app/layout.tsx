import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Toaster } from "sonner";
import Providers from "@/components/shared/Providers";
import { Camera, Mic, Film, Music, Lightbulb, Armchair, Speaker, Video, Image as ImageIcon, MonitorPlay } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "StudioSpace | Premium Creative Studios",
  description: "Book premium creative studios by the hour.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen relative overflow-x-clip">

        {/* Background Studio Icons (Floating) */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          {/* Top Row */}
          <Camera className="absolute top-[5%] left-[5%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-12 animate-float" />
          <Mic className="absolute top-[12%] left-[12%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-45 animate-float-delayed" />
          <Film className="absolute top-[8%] left-[25%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-6 animate-float" />
          <Music className="absolute top-[15%] left-[35%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-12 animate-float-delayed" />
          <Lightbulb className="absolute top-[6%] left-[45%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-45 animate-float" />
          <Armchair className="absolute top-[18%] left-[55%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-6 animate-float-delayed" />
          <Speaker className="absolute top-[10%] left-[65%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-12 animate-float" />
          <Video className="absolute top-[5%] right-[15%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-45 animate-float-delayed" />
          <MonitorPlay className="absolute top-[15%] right-[5%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-6 animate-float" />

          {/* Upper Middle Row */}
          <ImageIcon className="absolute top-[25%] left-[8%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-12 animate-float-delayed" />
          <Film className="absolute top-[30%] left-[20%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-12 animate-float" />
          <Camera className="absolute top-[22%] left-[40%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-45 animate-float-delayed" />
          <Mic className="absolute top-[28%] left-[60%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-6 animate-float" />
          <Music className="absolute top-[25%] right-[25%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-12 animate-float-delayed" />
          <Armchair className="absolute top-[35%] right-[8%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-45 animate-float" />

          {/* Middle Row */}
          <MonitorPlay className="absolute top-[45%] left-[2%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-45 animate-float" />
          <Speaker className="absolute top-[40%] left-[15%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-12 animate-float-delayed" />
          <Lightbulb className="absolute top-[50%] left-[30%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-12 animate-float" />
          <Video className="absolute top-[42%] left-[50%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-6 animate-float-delayed" />
          <Camera className="absolute top-[55%] left-[65%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-45 animate-float" />
          <Film className="absolute top-[48%] right-[15%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-12 animate-float-delayed" />
          <Mic className="absolute top-[38%] right-[2%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-12 animate-float" />

          {/* Lower Middle Row */}
          <Music className="absolute top-[65%] left-[5%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-12 animate-float-delayed" />
          <ImageIcon className="absolute top-[60%] left-[20%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-12 animate-float" />
          <Armchair className="absolute top-[70%] left-[35%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-45 animate-float-delayed" />
          <Camera className="absolute top-[62%] left-[55%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-45 animate-float" />
          <Speaker className="absolute top-[68%] right-[25%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-6 animate-float-delayed" />
          <MonitorPlay className="absolute top-[72%] right-[10%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-12 animate-float" />

          {/* Bottom Row */}
          <Film className="absolute bottom-[15%] left-[8%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-12 animate-float" />
          <Mic className="absolute bottom-[8%] left-[25%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-45 animate-float-delayed" />
          <Lightbulb className="absolute bottom-[20%] left-[45%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-6 animate-float" />
          <Music className="absolute bottom-[12%] left-[65%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-12 animate-float-delayed" />
          <Armchair className="absolute bottom-[5%] right-[15%] w-8 h-8 text-primary/20 dark:text-primary/10 -rotate-45 animate-float" />
          <Camera className="absolute bottom-[18%] right-[5%] w-10 h-10 text-primary/20 dark:text-primary/10 rotate-45 animate-float-delayed" />
          <ImageIcon className="absolute bottom-[2%] left-[50%] w-8 h-8 text-primary/20 dark:text-primary/10 rotate-12 animate-float" />
        </div>

        <Providers>
          <Navbar />
          <main className="flex-grow relative z-10">
            {children}
          </main>
          <Footer />

          {/* 🎨 Premium Golden & Green Glassmorphism Capsule Toast */}
          <Toaster
            position="top-center"
            offset={95}
            toastOptions={{
              style: {
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(234, 179, 8, 0.1) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(234, 179, 8, 0.4)",
                color: "var(--foreground)",
                borderRadius: "9999px",
                padding: "10px 24px",
                boxShadow: "0 10px 40px rgba(16, 185, 129, 0.2), inset 0 0 20px rgba(234, 179, 8, 0.05)",
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                transform: "translateX(-17px)",
              },
              className: "dark:bg-black/70 dark:border-yellow-500/40",
            }}
            richColors
          />
        </Providers>
      </body>
    </html>
  );
}