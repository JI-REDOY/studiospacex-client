import { Aperture } from "lucide-react";

export default function Loader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center w-full relative z-10">
      <div className="relative mb-6 group">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        <div className="bg-white/5 dark:bg-black/20 border border-white/10 p-4 rounded-2xl relative z-10 shadow-2xl">
          <Aperture className="h-12 w-12 text-primary animate-[spin_8s_linear_infinite]" />
        </div>
      </div>
      <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-foreground mb-2 animate-pulse text-center">
        Loading Premium Spaces...
      </h2>
    </div>
  );
}