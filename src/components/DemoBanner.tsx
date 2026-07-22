import React from "react";
import { Sparkles } from "lucide-react";

export default function DemoBanner() {
  return (
    <div className="w-full bg-zinc-950/90 border-b border-primary/30 px-4 py-2.5 backdrop-blur-xl z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center text-xs sm:text-sm font-medium text-zinc-300 tracking-wide">
        <Sparkles className="w-4 h-4 text-primary shrink-0 animate-pulse" />
        <p>
          <span className="font-bold text-white uppercase tracking-wider text-[11px] sm:text-xs mr-1.5 text-primary">
            Gym California Demo:
          </span>
          Esta demostración fue creada exclusivamente para el equipo de <span className="font-bold text-white">Gym California</span>. El objetivo es mostrar cómo podría verse su sitio web y un sistema de gestión adaptado a su negocio.
        </p>
      </div>
    </div>
  );
}
