import React from "react";
import { LayoutGrid, Grid2X2 } from "lucide-react";

export function ViewModeToggle({ mode = "large", onChange, className = "" }) {
  return (
    <div
      className={`inline-flex items-center p-0.5 sm:p-1 bg-stone-100/95 backdrop-blur-xs rounded-xl border border-stone-200/80 shadow-inner shrink-0 ${className}`}
      role="group"
      aria-label="Modo de visualização"
    >
      <button
        type="button"
        onClick={() => onChange("large")}
        className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
          mode === "large"
            ? "bg-white text-emerald-700 shadow-xs font-bold"
            : "text-stone-500 hover:text-stone-800"
        }`}
        title="Modo cartões grandes"
      >
        <Grid2X2 className="w-3.5 h-3.5" />
        <span className="hidden xs:inline sm:inline">Cartões</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
          mode === "grid"
            ? "bg-white text-emerald-700 shadow-xs font-bold"
            : "text-stone-500 hover:text-stone-800"
        }`}
        title="Modo grelha compacta"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="hidden xs:inline sm:inline">Grelha</span>
      </button>
    </div>
  );
}

export function useViewMode(key = "hortaviva_view_mode", defaultMode = "large") {
  const [mode, setModeState] = React.useState(() => {
    try {
      return localStorage.getItem(key) || defaultMode;
    } catch {
      return defaultMode;
    }
  });

  const setMode = (newMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(key, newMode);
    } catch {}
  };

  return [mode, setMode];
}

export default ViewModeToggle;
