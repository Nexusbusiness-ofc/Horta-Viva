import React from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconResumo({ className }) {
  return (
    <svg {...base} className={className}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18" />
      <path d="M8 2v4M16 2v4" />
      <path d="M12 13c0-1.5 1-2.5 2.5-2.5.5 1.5-.5 2.5-2.5 2.5z" fill="currentColor" stroke="none" />
      <path d="M12 13c0 2 1 3.5 3 3.5" />
    </svg>
  );
}

export function IconQuinta({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 15V9" />
      <path d="M12 11c-1.5 0-3-1-3-3 1.5-.5 3 .5 3 2z" fill="currentColor" fillOpacity="0.15" stroke="none" />
      <path d="M12 9c1.5 0 3-1 3-3-1.5-.5-3 .5-3 2z" fill="currentColor" fillOpacity="0.15" stroke="none" />
      <path d="M4 18c2-1 5-1.5 8-1.5s6 .5 8 1.5" />
      <path d="M4 21c2-1 5-1.5 8-1.5s6 .5 8 1.5" />
    </svg>
  );
}

export function IconCuras({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M9 8V6h5v2" />
      <path d="M9 8h5l1 3v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V11z" />
      <path d="M14 6h3l2-2" />
      <path d="M19 4h2v2" />
      <path d="M11 13h2" />
    </svg>
  );
}

export function IconPodas({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M5 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
      <path d="M19 19a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
      <path d="M7 14L18 4" />
      <path d="M17 14L6 4" />
      <path d="M12 9l2-2" />
    </svg>
  );
}

export function IconAnimais({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 5a1.5 1.5 0 0 0 0 3" />
      <path d="M12 8c2.5 0 4 1.5 4 4v3H8v-3c0-2.5 1.5-4 4-4z" fill="currentColor" fillOpacity="0.12" />
      <path d="M16 7.5l1.5-1" />
      <path d="M9.5 20l1-3M14.5 20l-1-3" />
    </svg>
  );
}

export function IconCogumelos({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M4 11a8 8 0 0 1 16 0H4z" fill="currentColor" fillOpacity="0.15" />
      <path d="M9 11v6a3 3 0 0 0 6 0v-6" />
      <circle cx="9.5" cy="8" r="1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="9" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconIdentificar({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 13.5c-.5-1.5.5-3 2-3 .5 1.5-.5 3-2 3z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconTarefas({ className }) {
  return (
    <svg {...base} className={className}>
      <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1z" />
      <path d="M8 5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path d="M9 13l2 2 4-4" />
    </svg>
  );
}

export function IconPerfil({ className }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}