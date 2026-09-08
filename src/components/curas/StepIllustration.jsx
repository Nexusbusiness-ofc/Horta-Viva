import React from "react";

// Ilustrações SVG nativas para cada passo da preparação de herbicidas naturais.
// Sem dependência de créditos de IA — SVGs desenhados à mão.
export default function StepIllustration({ type, color = "#84cc16" }) {
  const c = color;
  const dark = "#57534e";
  const common = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 120 120",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  };

  switch (type) {
    // ---- Vinagre + Sal + Sabão ----
    case "pour_vinegar":
      return (
        <svg {...common}>
          <rect x="62" y="52" width="42" height="48" rx="6" fill="#fff" stroke={dark} strokeWidth="3" />
          <path d="M104 62 Q114 67 114 78 Q114 88 104 88" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round" />
          <rect x="65" y="74" width="36" height="23" rx="4" fill={c} opacity="0.35" />
          <g transform="rotate(-28 34 36)">
            <rect x="22" y="14" width="22" height="40" rx="5" fill="#fff" stroke={dark} strokeWidth="3" />
            <rect x="28" y="4" width="10" height="12" rx="2" fill={dark} />
            <rect x="25" y="28" width="16" height="22" rx="3" fill={c} opacity="0.5" />
          </g>
          <path d="M44 46 Q56 58 64 72" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" strokeDasharray="1 5" />
        </svg>
      );

    case "add_salt":
      return (
        <svg {...common}>
          {/* bowl */}
          <path d="M28 72 Q28 100 60 100 Q92 100 92 72" fill="#fff" stroke={dark} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="60" cy="72" rx="32" ry="9" fill={c} opacity="0.25" stroke={dark} strokeWidth="3" />
          {/* salt shaker */}
          <g transform="translate(44 8)">
            <rect x="0" y="18" width="32" height="40" rx="5" fill="#fff" stroke={dark} strokeWidth="3" />
            <rect x="4" y="6" width="24" height="14" rx="3" fill={dark} />
            <circle cx="10" cy="12" r="1.6" fill="#fff" />
            <circle cx="16" cy="12" r="1.6" fill="#fff" />
            <circle cx="22" cy="12" r="1.6" fill="#fff" />
            <rect x="3" y="34" width="26" height="22" rx="3" fill="#e7e5e4" />
          </g>
          {/* falling grains */}
          <circle cx="50" cy="56" r="2" fill={c} />
          <circle cx="56" cy="64" r="2" fill={c} />
          <circle cx="62" cy="58" r="2" fill={c} />
          <circle cx="68" cy="66" r="2" fill={c} />
          <circle cx="58" cy="50" r="2" fill={c} opacity="0.6" />
        </svg>
      );

    case "add_soap":
      return (
        <svg {...common}>
          {/* soap dispenser */}
          <g transform="translate(40 10)">
            <rect x="0" y="18" width="36" height="56" rx="6" fill="#fff" stroke={dark} strokeWidth="3" />
            <rect x="8" y="6" width="20" height="14" rx="3" fill={dark} />
            <circle cx="18" cy="13" r="3" fill="#fff" />
            <rect x="4" y="40" width="28" height="32" rx="4" fill={c} opacity="0.35" />
            {/* pump */}
            <path d="M18 6 Q18 0 26 0 L34 0" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round" />
          </g>
          {/* drops */}
          <path d="M62 68 Q58 74 62 80 Q66 74 62 68 Z" fill={c} opacity="0.7" />
          <path d="M70 80 Q66 86 70 92 Q74 86 70 80 Z" fill={c} opacity="0.5" />
          <path d="M54 82 Q50 88 54 94 Q58 88 54 82 Z" fill={c} opacity="0.4" />
        </svg>
      );

    case "shake":
      return (
        <svg {...common}>
          {/* bottle */}
          <g transform="rotate(-15 60 60)">
            <rect x="42" y="28" width="36" height="62" rx="8" fill="#fff" stroke={dark} strokeWidth="3" />
            <rect x="52" y="14" width="16" height="16" rx="3" fill={dark} />
            <rect x="45" y="50" width="30" height="38" rx="5" fill={c} opacity="0.4" />
            {/* bubbles */}
            <circle cx="54" cy="62" r="3" fill="#fff" />
            <circle cx="64" cy="70" r="2.5" fill="#fff" />
            <circle cx="58" cy="78" r="2" fill="#fff" />
          </g>
          {/* motion arcs */}
          <path d="M18 50 Q12 60 18 70" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <path d="M26 44 Q18 60 26 76" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          <path d="M96 50 Q102 60 96 70" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" />
          <path d="M88 44 Q96 60 88 76" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    // ---- Água Fervente ----
    case "boil_water":
      return (
        <svg {...common}>
          {/* kettle body */}
          <path d="M30 58 Q30 96 60 96 Q90 96 90 58 Q90 52 84 52 L36 52 Q30 52 30 58 Z" fill="#fff" stroke={dark} strokeWidth="3" />
          {/* lid */}
          <path d="M36 52 L52 40 L68 40 L84 52" fill="#fff" stroke={dark} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="60" cy="36" r="4" fill={dark} />
          {/* spout */}
          <path d="M30 64 L14 56 L10 64 L26 76" fill="#fff" stroke={dark} strokeWidth="3" strokeLinejoin="round" />
          {/* handle */}
          <path d="M90 64 Q104 64 104 78 Q104 88 92 88" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round" />
          {/* water fill */}
          <path d="M34 62 Q34 92 60 92 Q86 92 86 62" fill={c} opacity="0.3" />
          {/* steam */}
          <path d="M50 30 Q46 22 52 16 Q58 10 52 4" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M64 30 Q60 22 66 16 Q72 10 66 4" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        </svg>
      );

    case "pour_hot":
      return (
        <svg {...common}>
          {/* kettle tilted */}
          <g transform="rotate(-35 58 52)">
            <path d="M44 48 Q44 84 64 84 Q84 84 84 48 L44 48 Z" fill="#fff" stroke={dark} strokeWidth="3" />
            <path d="M48 48 L56 40 L72 40 L80 48" fill="#fff" stroke={dark} strokeWidth="3" strokeLinejoin="round" />
          </g>
          {/* water stream */}
          <path d="M34 64 Q40 78 50 90" fill="none" stroke={c} strokeWidth="5" strokeLinecap="round" />
          <path d="M40 66 Q44 78 52 88" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          {/* weed */}
          <g transform="translate(44 86)">
            <path d="M0 20 Q-6 8 -2 0" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round" />
            <path d="M0 20 Q6 10 4 2" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round" />
            <path d="M0 20 Q0 10 0 2" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="-4" cy="4" rx="5" ry="3" fill={c} opacity="0.5" />
            <ellipse cx="5" cy="6" rx="5" ry="3" fill={c} opacity="0.5" />
          </g>
          {/* steam on weed */}
          <path d="M50 96 Q48 90 54 86" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      );

    // ---- Bicarbonato ----
    case "dissolve_powder":
      return (
        <svg {...common}>
          {/* glass */}
          <path d="M40 40 L44 96 Q44 102 50 102 L70 102 Q76 102 76 96 L80 40" fill="#fff" stroke={dark} strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="60" cy="40" rx="20" ry="6" fill="none" stroke={dark} strokeWidth="3" />
          {/* water */}
          <path d="M42 50 L45 96 Q45 100 50 100 L70 100 Q75 100 75 96 L78 50" fill={c} opacity="0.25" />
          {/* swirl */}
          <path d="M50 70 Q60 64 70 72 Q60 78 50 84" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          {/* spoon with powder */}
          <g transform="rotate(25 44 20)">
            <ellipse cx="44" cy="20" rx="14" ry="7" fill="#fff" stroke={dark} strokeWidth="3" />
            <ellipse cx="44" cy="18" rx="11" ry="4" fill="#e7e5e4" />
            <rect x="58" y="18" width="40" height="4" rx="2" fill={dark} />
          </g>
          {/* falling powder */}
          <circle cx="50" cy="34" r="1.8" fill="#a8a29e" />
          <circle cx="55" cy="38" r="1.8" fill="#a8a29e" />
          <circle cx="48" cy="40" r="1.5" fill="#a8a29e" />
        </svg>
      );

    case "fill_sprayer":
      return (
        <svg {...common}>
          {/* spray bottle */}
          <g transform="translate(36 18)">
            {/* body */}
            <rect x="0" y="30" width="44" height="64" rx="8" fill="#fff" stroke={dark} strokeWidth="3" />
            {/* liquid */}
            <rect x="4" y="54" width="36" height="37" rx="5" fill={c} opacity="0.35" />
            {/* neck */}
            <rect x="14" y="16" width="16" height="16" fill="#fff" stroke={dark} strokeWidth="3" />
            {/* trigger / nozzle */}
            <path d="M30 20 L48 14 L52 22 L34 28" fill="#fff" stroke={dark} strokeWidth="3" strokeLinejoin="round" />
            <path d="M52 18 Q60 18 64 12" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round" />
            {/* spray dots */}
            <circle cx="64" cy="10" r="2" fill={c} />
            <circle cx="68" cy="14" r="1.5" fill={c} opacity="0.7" />
            <circle cx="62" cy="6" r="1.5" fill={c} opacity="0.6" />
            {/* handle grip */}
            <path d="M0 70 Q-10 72 -8 84 Q-6 92 0 92" fill="none" stroke={dark} strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}