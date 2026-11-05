"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full relative overflow-hidden bg-white/5 dark:bg-black/20 border border-white/10 w-10 h-10"
        disabled
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative overflow-hidden rounded-full w-10 h-10 bg-white/5 dark:bg-black/20 border border-white/10 hover:border-primary/40 dark:hover:border-yellow-500/40 shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] dark:hover:shadow-[0_0_20px_rgba(234,179,8,0.2)] transition-all duration-500 hover:scale-110"
    >
      <div className="absolute inset-0 bg-primary/10 dark:bg-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full blur-md" />
      <Sun className={`absolute h-5 w-5 transition-all duration-700 ease-in-out ${isDark ? "rotate-0 scale-100 opacity-100 text-yellow-500" : "-rotate-90 scale-0 opacity-0 text-primary"}`} />
      <Moon className={`absolute h-5 w-5 transition-all duration-700 ease-in-out ${isDark ? "rotate-90 scale-0 opacity-0 text-yellow-500" : "rotate-0 scale-100 opacity-100 text-primary"}`} />
    </Button>
  );
}