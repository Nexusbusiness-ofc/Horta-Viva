import React from 'react';

export default function MascotGarden({ children, className = '' }) {
  return <div className={`hv-pet-stage relative overflow-hidden rounded-[2rem] bg-[#eef4e2] ${className}`}>
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 430" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs><linearGradient id="hv-garden-sky" x2="0" y2="1"><stop stopColor="#e7f3e9"/><stop offset="1" stopColor="#fff4d9"/></linearGradient><linearGradient id="hv-garden-ground" x2="0" y2="1"><stop stopColor="#c2d8a0"/><stop offset="1" stopColor="#89b17c"/></linearGradient></defs>
      <path fill="url(#hv-garden-sky)" d="M0 0H600V430H0Z"/>
      <circle cx="469" cy="79" r="37" fill="#f7dda0"/><circle cx="469" cy="79" r="49" fill="none" stroke="#f5e4ba" strokeWidth="7" opacity=".65"/>
      <g className="hv-pet-cloud" fill="#fffdf5" opacity=".75"><path d="M65 93C61 77 76 68 87 73C92 53 124 58 125 79C145 75 155 99 135 104H76Z"/><path d="M331 42C333 25 353 25 360 35C375 16 397 32 393 47C414 42 423 63 404 66H345Z"/></g>
      <path d="M0 234C80 184 143 235 217 223C335 184 415 227 480 196C527 173 565 204 600 207V430H0Z" fill="#d4e3bb"/>
      <path d="M0 292C111 243 189 279 281 267C395 250 498 273 600 244V430H0Z" fill="url(#hv-garden-ground)"/>
      <path d="M210 430C206 380 240 321 300 307C360 316 407 374 410 430" fill="#dfd4ad" opacity=".65"/>
      <g fill="#749b69" opacity=".55"><ellipse cx="63" cy="302" rx="37" ry="17"/><ellipse cx="535" cy="294" rx="49" ry="20"/></g>
      <g stroke="#64925b" strokeWidth="3" strokeLinecap="round"><path d="M59 329V263M83 329V275M521 330V254M545 332V271"/></g>
      <g fill="#719b62"><path d="M59 292C29 291 26 274 33 268C51 268 61 281 59 292Z"/><path d="M61 278C80 278 88 262 82 254C65 254 57 265 61 278Z"/><path d="M83 310C104 311 111 294 106 288C88 287 79 300 83 310Z"/><path d="M521 288C493 286 491 269 498 262C515 264 525 276 521 288Z"/><path d="M544 312C569 313 577 297 571 288C553 288 542 300 544 312Z"/></g>
      <g fill="#e8c0a5"><circle cx="83" cy="274" r="10"/><circle cx="545" cy="268" r="11"/></g><g fill="#efd58f"><circle cx="83" cy="274" r="4"/><circle cx="545" cy="268" r="4"/></g>
      <g stroke="#638e59" strokeWidth="4" strokeLinecap="round"><path d="M14 430L20 400M26 430L38 411M575 430L568 405M589 430L590 400"/></g>
      <g transform="translate(182 153)"><g className="hv-pet-butterfly"><path d="M0 0C-22-20-30 8-4 11C-12 31 9 28 8 9C34 3 23-20 5-2Z" fill="#e6b69d"/><path d="M2-2L5 14" stroke="#8c8064" strokeWidth="3" strokeLinecap="round"/></g></g>
    </svg>
    {children}
  </div>;
}
