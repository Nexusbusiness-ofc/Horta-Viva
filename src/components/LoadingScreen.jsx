import React from "react";
import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-sky-50 via-emerald-50 to-lime-100 overflow-hidden">
      {/* Floating ambient particles */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-emerald-300/50"
          style={{ width: 5, height: 5, left: `${12 + i * 12}%`, top: `${18 + (i % 3) * 26}%` }}
          animate={{ y: [0, -22, 0], opacity: [0, 0.85, 0] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {/* Sun glow */}
      <motion.div
        className="absolute top-14 w-28 h-28 rounded-full bg-amber-200/50 blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Plant growing animation */}
      <div className="relative mb-6">
        <svg width="180" height="220" viewBox="0 0 180 220" fill="none">
          {/* Soil mound */}
          <ellipse cx="90" cy="192" rx="62" ry="14" fill="#78350f" opacity="0.9" />
          <ellipse cx="90" cy="187" rx="55" ry="11" fill="#92400e" />

          {/* Stem — grows from the soil */}
          <motion.path
            d="M90 188 Q84 142 90 80"
            stroke="#15803d"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.5, 0.88, 1] }}
          />

          {/* Left leaf */}
          <motion.path
            d="M90 136 C56 123 22 129 8 153 C32 173 72 165 90 149 Z"
            fill="#22c55e"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, times: [0.3, 0.6, 0.88, 1] }}
            style={{ transformOrigin: "90px 141px" }}
          />

          {/* Right leaf */}
          <motion.path
            d="M90 112 C124 99 158 105 172 129 C148 149 108 141 90 125 Z"
            fill="#16a34a"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, times: [0.4, 0.68, 0.88, 1] }}
            style={{ transformOrigin: "90px 117px" }}
          />

          {/* Top bud */}
          <motion.circle
            cx="90"
            cy="78"
            r="8"
            fill="#84cc16"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 1, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, times: [0.5, 0.68, 0.88, 1] }}
          />
        </svg>

        {/* Sparkle */}
        <motion.div
          className="absolute top-2 right-3 text-lg"
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5], y: [0, -12, -24] }}
          transition={{ duration: 3.5, repeat: Infinity, times: [0.55, 0.75, 0.9] }}
        >✨</motion.div>
      </div>

      {/* App name */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
          Minha Horta
        </h1>
        <motion.p
          className="text-sm text-stone-500 mt-1.5"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          A cultivar a tua quinta…
        </motion.p>
      </motion.div>
    </div>
  );
}