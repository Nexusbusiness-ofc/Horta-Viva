import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";

const AUTOPLAY_MS = 4500;

export default function HeroCarousel({ plants, onSelect }) {
  const featured = plants.filter(p => p.image_url).slice(0, 8);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    setIndex(i => (i + 1) % Math.max(featured.length, 1));
  }, [featured.length]);

  useEffect(() => {
    if (paused || featured.length <= 1) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, next, featured.length]);

  if (featured.length === 0) return null;

  const plant = featured[index] || featured[0];
  const color = plant.color || "#16a34a";

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden shadow-xl shadow-emerald-200/40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="relative h-56 sm:h-64">
        {featured.map((p, i) => (
          <div
            key={p.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? "auto" : "none" }}
          >
            {/* Background */}
            <div className="absolute inset-0">
              <Image
                src={p.image_url}
                fittingType="fill"
                focalPointY={0.4}
                alt={p.name}
                className="absolute inset-0 w-full h-full"
              />
            </div>
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(100deg, ${color}f0 0%, ${color}cc 40%, transparent 75%)` }}
            />
            {/* Text content */}
            <div className="relative h-full flex flex-col justify-end p-5 sm:p-7">
              <span className="text-xs font-semibold text-white/80 uppercase tracking-wide mb-1">
                {p.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-md">
                {p.name}
              </h2>
              <p className="text-sm text-white/90 mt-1 max-w-xs leading-snug line-clamp-2">
                Tudo o que precisas saber para plantar e cuidar do teu {p.name.toLowerCase()}
              </p>
              <button
                onClick={() => onSelect(p)}
                className="mt-3 inline-flex items-center gap-1.5 bg-white/95 text-stone-800 text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:bg-white hover:shadow-lg transition-all active:scale-95 w-fit"
              >
                Ver guia completo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 24 : 8,
                backgroundColor: i === index ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}