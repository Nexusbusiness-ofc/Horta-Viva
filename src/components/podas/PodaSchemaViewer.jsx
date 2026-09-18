import React, { useState } from "react";
import { Scissors, CheckCircle2, XCircle, AlertTriangle, Lightbulb, Wrench, ShieldCheck, ChevronRight } from "lucide-react";
import { PODA_SCHEMAS } from "@/lib/pruningThinningSchemas";

// --- SVG DIAGRAMS ---

// 1. Diagrama Comparativo do Ângulo de Corte a 45°
export function CutAngleDiagram({ cutAngle, cutHeight }) {
  const [selectedCut, setSelectedCut] = useState("correct");

  const cuts = {
    correct: {
      title: "✅ Corte Correto em Bisel (45°)",
      badge: "Perfeito",
      badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
      desc: "Inclinado a 45°, cerca de 5 mm acima de um gomo voltado para fora. A água e o 'choro' da seiva escorrem para o lado oposto da gema, mantendo-a seca e sadia."
    },
    flat: {
      title: "❌ Corte Reto / Horizontal",
      badge: "Erro Comum",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      desc: "Superfície plana acumula gotas de chuva e orvalho. A humidade estagnada apodrece o topo do ramo e propaga fungos para o interior da madeira."
    },
    inverted: {
      title: "❌ Corte Invertido (Virado para a Gema)",
      badge: "Grave",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      desc: "A inclinação guia a água e os fungos diretamente para cima da gema fértil, provocando o apodrecimento do botão floral antes da primavera."
    },
    long_stub: {
      title: "❌ Toco Comprido (> 15 mm)",
      badge: "Infeção",
      badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
      desc: "A parte acima do gomo não recebe seiva, seca e morre. Essa madeira morta torna-se porta de entrada para brocas, cancro e fungos xilófagos."
    },
    too_close: {
      title: "❌ Demasiado Rente ao Gomo",
      badge: "Dano",
      badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
      desc: "Fere os tecidos vasculares que alimentam a gema. O nó desidrata e o gomo seca antes de abrir."
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Scissors className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-stone-800 text-sm">Ângulo & Ponto de Corte</h4>
            <p className="text-xs text-stone-500">Clica em cada exemplo para ver o esquema anatómico</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Regra dos 45°
        </span>
      </div>

      {/* Selector de botões */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-xs">
        <button
          onClick={() => setSelectedCut("correct")}
          className={`py-1.5 px-2 rounded-xl font-semibold border transition-all ${selectedCut === "correct" ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-emerald-50"}`}
        >
          ✅ Correto 45°
        </button>
        <button
          onClick={() => setSelectedCut("flat")}
          className={`py-1.5 px-2 rounded-xl font-semibold border transition-all ${selectedCut === "flat" ? "bg-rose-600 text-white border-rose-600 shadow-sm" : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-rose-50"}`}
        >
          ❌ Reto
        </button>
        <button
          onClick={() => setSelectedCut("inverted")}
          className={`py-1.5 px-2 rounded-xl font-semibold border transition-all ${selectedCut === "inverted" ? "bg-rose-600 text-white border-rose-600 shadow-sm" : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-rose-50"}`}
        >
          ❌ Invertido
        </button>
        <button
          onClick={() => setSelectedCut("long_stub")}
          className={`py-1.5 px-2 rounded-xl font-semibold border transition-all ${selectedCut === "long_stub" ? "bg-amber-600 text-white border-amber-600 shadow-sm" : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-amber-50"}`}
        >
          ❌ Toco Longo
        </button>
        <button
          onClick={() => setSelectedCut("too_close")}
          className={`py-1.5 px-2 rounded-xl font-semibold border transition-all ${selectedCut === "too_close" ? "bg-rose-600 text-white border-rose-600 shadow-sm" : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-rose-50"}`}
        >
          ❌ Muito Rente
        </button>
      </div>

      {/* SVG Ilustrativo do Corte Escolhido */}
      <div className="bg-gradient-to-b from-stone-50 to-emerald-50/20 rounded-xl p-3 border border-stone-100 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-60 h-44 shrink-0 flex items-center justify-center bg-white rounded-xl shadow-inner border border-stone-100 overflow-hidden">
          <svg viewBox="0 0 240 180" className="w-full h-full">
            <defs>
              <linearGradient id="woodStem" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#854d0e" />
                <stop offset="50%" stopColor="#a16207" />
                <stop offset="100%" stopColor="#713f12" />
              </linearGradient>
              <linearGradient id="budGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>

            {/* Ramo Base Vertical */}
            <rect x="95" y="60" width="30" height="110" rx="4" fill="url(#woodStem)" />
            
            {/* Casca e texturas */}
            <line x1="102" y1="80" x2="102" y2="150" stroke="#713f12" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.6" />
            <line x1="114" y1="90" x2="114" y2="160" stroke="#ca8a04" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.4" />

            {/* Gema / Gomo na lateral direita (voltado para o exterior) */}
            <g transform="translate(122, 90)">
              <path d="M 0 10 Q 15 5 18 -5 Q 12 -12 0 -2 Z" fill="url(#budGrad)" stroke="#14532d" strokeWidth="1.5" />
              <circle cx="8" cy="1" r="2" fill="#86efac" />
              {/* Etiqueta da Gema */}
              <text x="24" y="0" fontSize="10" fontWeight="bold" fill="#15803d">Gema Exterior</text>
            </g>

            {/* Variações do Topo / Corte Conforme Seleção */}
            {selectedCut === "correct" && (
              <g>
                {/* Corte 45° inclinado para a esquerda (longe da gema) */}
                <polygon points="95,45 125,75 125,90 95,90" fill="url(#woodStem)" />
                <line x1="93" y1="43" x2="127" y2="77" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" />
                {/* Linha tracejada do corte e cota de 5mm */}
                <circle cx="125" cy="75" r="3" fill="#16a34a" />
                <line x1="130" y1="75" x2="130" y2="88" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="135" y="84" fontSize="9" fontWeight="bold" fill="#15803d">5 mm</text>
                {/* Gotas de água escorrendo para a esquerda (fora da gema) */}
                <path d="M 100 48 Q 98 55 95 62" stroke="#0284c7" strokeWidth="2" fill="none" strokeDasharray="2 2" />
                <circle cx="94" cy="66" r="2.5" fill="#0284c7" />
                <text x="40" y="55" fontSize="9" fill="#0284c7" fontWeight="bold">Água escorre ➔</text>
                <text x="110" y="28" fontSize="11" fontWeight="bold" fill="#16a34a" textAnchor="middle">✅ 45° Bisel Perfeito</text>
              </g>
            )}

            {selectedCut === "flat" && (
              <g>
                <polygon points="95,65 125,65 125,90 95,90" fill="url(#woodStem)" />
                <line x1="93" y1="65" x2="127" y2="65" stroke="#e11d48" strokeWidth="3.5" strokeLinecap="round" />
                {/* Poça de água estagnada */}
                <ellipse cx="110" cy="65" rx="12" ry="3" fill="#38bdf8" stroke="#0284c7" />
                <text x="110" y="55" fontSize="10" fontWeight="bold" fill="#e11d48" textAnchor="middle">❌ Água Estagnada</text>
              </g>
            )}

            {selectedCut === "inverted" && (
              <g>
                {/* Corte inclinado para a direita, escorrendo em cima da gema */}
                <polygon points="95,75 125,45 125,90 95,90" fill="url(#woodStem)" />
                <line x1="93" y1="77" x2="127" y2="43" stroke="#e11d48" strokeWidth="3.5" strokeLinecap="round" />
                {/* Gotas caindo na gema */}
                <path d="M 124 50 Q 126 68 126 85" stroke="#0284c7" strokeWidth="2" fill="none" strokeDasharray="2 2" />
                <circle cx="126" cy="88" r="3" fill="#e11d48" />
                <text x="135" y="60" fontSize="9" fontWeight="bold" fill="#e11d48">Gema afogada!</text>
                <text x="110" y="28" fontSize="10" fontWeight="bold" fill="#e11d48" textAnchor="middle">❌ Invertido</text>
              </g>
            )}

            {selectedCut === "long_stub" && (
              <g>
                {/* Ramo prolonga-se muito para cima */}
                <rect x="95" y="20" width="30" height="40" fill="#78350f" opacity="0.6" stroke="#451a03" strokeDasharray="3 3" />
                <line x1="93" y1="20" x2="127" y2="20" stroke="#d97706" strokeWidth="3.5" />
                <text x="135" y="42" fontSize="9" fontWeight="bold" fill="#d97706">&gt; 25 mm (toco seco)</text>
                <text x="110" y="14" fontSize="10" fontWeight="bold" fill="#d97706" textAnchor="middle">❌ Toco Morto</text>
              </g>
            )}

            {selectedCut === "too_close" && (
              <g>
                {/* Corte colado ao nó da gema */}
                <line x1="95" y1="88" x2="125" y2="88" stroke="#e11d48" strokeWidth="3.5" />
                <circle cx="125" cy="88" r="4" fill="#e11d48" opacity="0.6" />
                <text x="135" y="92" fontSize="9" fontWeight="bold" fill="#e11d48">Gema ferida!</text>
                <text x="110" y="40" fontSize="10" fontWeight="bold" fill="#e11d48" textAnchor="middle">❌ Muito Rente</text>
              </g>
            )}
          </svg>
        </div>

        <div className="flex-1 space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${cuts[selectedCut].badgeColor}`}>
              {cuts[selectedCut].badge}
            </span>
            <h5 className="text-sm font-bold text-stone-800">{cuts[selectedCut].title}</h5>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">{cuts[selectedCut].desc}</p>
          <div className="pt-1 text-[11px] text-emerald-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span><b>Regra prática:</b> {cutAngle || "Bisel a 45° virado para o lado oposto à gema"} ({cutHeight || "5 mm acima do gomo"}).</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Diagrama Específico de Arquitetura da Árvore
export function TreeArchitectureDiagram({ type, name }) {
  if (type === "grapevine_winter") {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-2 text-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Esquema de Cordão da Vinha (Royat / Guyot)</h4>
        <div className="w-full h-44 bg-gradient-to-b from-stone-50 to-purple-50/20 rounded-xl flex items-center justify-center p-2 border border-stone-100">
          <svg viewBox="0 0 320 160" className="w-full h-full max-h-40">
            {/* Arame horizontal */}
            <line x1="10" y1="90" x2="310" y2="90" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 3" />
            <text x="280" y="85" fontSize="8" fill="#64748b">Arame</text>
            
            {/* Tronco da videira */}
            <path d="M 60 150 Q 65 110 80 90 L 260 90" stroke="#78350f" strokeWidth="10" fill="none" strokeLinecap="round" />
            
            {/* Talão 1 - Cortado a 2 gomos */}
            <g transform="translate(120, 90)">
              <line x1="0" y1="0" x2="5" y2="-30" stroke="#a16207" strokeWidth="5" />
              {/* Gomo 1 */}
              <circle cx="2" cy="-12" r="3" fill="#16a34a" />
              {/* Gomo 2 */}
              <circle cx="4" cy="-24" r="3" fill="#16a34a" />
              {/* Corte a 45° */}
              <line x1="-3" y1="-32" x2="12" y2="-28" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="2 2" />
              <text x="-25" y="-35" fontSize="8" fontWeight="bold" fill="#dc2626">✂️ Talão (2 gomos)</text>
            </g>

            {/* Vara velha eliminada */}
            <g transform="translate(180, 90)">
              <line x1="0" y1="0" x2="15" y2="-50" stroke="#9ca3af" strokeWidth="4" strokeDasharray="3 3" opacity="0.6" />
              <line x1="-5" y1="-5" x2="15" y2="-1" stroke="#dc2626" strokeWidth="2.5" />
              <text x="20" y="-35" fontSize="8" fill="#ef4444">✂️ Vara velha (eliminar)</text>
            </g>

            {/* Talão 2 - 2 gomos */}
            <g transform="translate(230, 90)">
              <line x1="0" y1="0" x2="-5" y2="-30" stroke="#a16207" strokeWidth="5" />
              <circle cx="-2" cy="-12" r="3" fill="#16a34a" />
              <circle cx="-4" cy="-24" r="3" fill="#16a34a" />
              <line x1="-12" y1="-28" x2="3" y2="-32" stroke="#dc2626" strokeWidth="2.5" strokeDasharray="2 2" />
              <text x="-5" y="-36" fontSize="8" fontWeight="bold" fill="#16a34a">🌿 2 Gomos</text>
            </g>

            {/* Rebentos ladrões da base a eliminar */}
            <g transform="translate(60, 130)">
              <line x1="0" y1="0" x2="-20" y2="-15" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2 2" />
              <circle cx="-20" cy="-15" r="2" fill="#ef4444" />
              <text x="-55" y="-5" fontSize="8" fill="#ef4444">✂️ Ladrão basal</text>
            </g>
          </svg>
        </div>
        <p className="text-[11px] text-stone-500">Talões de 2 gomos férteis no braço horizontal; eliminação total de sarmentos velhos e ladrões basais.</p>
      </div>
    );
  }

  if (type === "citrus") {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-2 text-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Esquema da Laranjeira / Citrinos (Guarda-Chuva Iluminado)</h4>
        <div className="w-full h-44 bg-gradient-to-b from-stone-50 to-orange-50/20 rounded-xl flex items-center justify-center p-2 border border-stone-100">
          <svg viewBox="0 0 320 160" className="w-full h-full max-h-40">
            {/* Solo */}
            <line x1="20" y1="145" x2="300" y2="145" stroke="#a8a29e" strokeWidth="2" />
            
            {/* Saia a 35cm */}
            <line x1="60" y1="115" x2="260" y2="115" stroke="#0284c7" strokeWidth="1" strokeDasharray="3 3" />
            <text x="270" y="118" fontSize="8" fill="#0284c7">Saia &gt; 35cm</text>

            {/* Tronco */}
            <rect x="150" y="90" width="20" height="55" fill="#78350f" rx="3" />

            {/* Copa arredondada externa */}
            <path d="M 60 115 C 40 70, 90 20, 160 20 C 230 20, 280 70, 260 115 Z" fill="#15803d" opacity="0.2" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 2" />

            {/* Ramos periféricos sãos (com laranjas) */}
            <circle cx="80" cy="85" r="7" fill="#ea580c" />
            <circle cx="100" cy="55" r="7" fill="#ea580c" />
            <circle cx="220" cy="55" r="7" fill="#ea580c" />
            <circle cx="240" cy="85" r="7" fill="#ea580c" />

            {/* Miolo desbastado (luz no interior) */}
            <path d="M 130 90 L 145 50 L 175 50 L 190 90" stroke="#a16207" strokeWidth="4" fill="none" />
            <text x="160" y="65" fontSize="8" fontWeight="bold" fill="#047857" textAnchor="middle">☀️ Luz interior</text>

            {/* Chupão / Ladrão vertical central cortado */}
            <line x1="160" y1="70" x2="160" y2="25" stroke="#ef4444" strokeWidth="3" strokeDasharray="3 2" />
            <line x1="150" y1="50" x2="170" y2="45" stroke="#ef4444" strokeWidth="2.5" />
            <text x="160" y="22" fontSize="8" fontWeight="bold" fill="#ef4444" textAnchor="middle">✂️ Cortar Ladrão</text>

            {/* Ramo baixo que arrasta no chão cortado */}
            <path d="M 150 115 Q 120 125 90 145" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2 2" fill="none" />
            <text x="40" y="140" fontSize="8" fill="#ef4444">✂️ Ramo rasteiro</text>
          </svg>
        </div>
        <p className="text-[11px] text-stone-500">Centro iluminado sem ladrões verticais; frutos mantidos na periferia e saia desimpedida a 35 cm do solo.</p>
      </div>
    );
  }

  if (type === "heavy_branch_3cut") {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-2 text-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Técnica dos 3 Cortes para Ramos Pesados</h4>
        <div className="w-full h-44 bg-gradient-to-b from-stone-50 to-emerald-50/20 rounded-xl flex items-center justify-center p-2 border border-stone-100">
          <svg viewBox="0 0 320 160" className="w-full h-full max-h-40">
            {/* Tronco da árvore */}
            <rect x="20" y="10" width="45" height="140" fill="#78350f" rx="4" />
            <text x="42" y="85" fontSize="9" fontWeight="bold" fill="#fef3c7" textAnchor="middle">Tronco</text>

            {/* Colar de cicatrização */}
            <path d="M 65 50 Q 75 80 65 110 L 80 100 L 80 60 Z" fill="#92400e" opacity="0.7" />
            <text x="75" y="45" fontSize="8" fill="#92400e">Colar</text>

            {/* Ramo grosso que se projeta */}
            <rect x="65" y="60" width="220" height="40" fill="#a16207" rx="3" />

            {/* Corte 1: Por baixo a 20 cm */}
            <g transform="translate(170, 100)">
              <line x1="0" y1="0" x2="0" y2="-18" stroke="#16a34a" strokeWidth="3" />
              <polygon points="-3,-18 3,-18 0,-24" fill="#16a34a" />
              <text x="0" y="15" fontSize="8" fontWeight="bold" fill="#16a34a" textAnchor="middle">1. Alívio inferior</text>
            </g>

            {/* Corte 2: Por cima a 25 cm */}
            <g transform="translate(200, 60)">
              <line x1="0" y1="0" x2="0" y2="28" stroke="#0284c7" strokeWidth="3" />
              <polygon points="-3,28 3,28 0,34" fill="#0284c7" />
              <text x="0" y="-8" fontSize="8" fontWeight="bold" fill="#0284c7" textAnchor="middle">2. Queda limpa</text>
            </g>

            {/* Corte 3: Final junto ao colar */}
            <g transform="translate(85, 60)">
              <line x1="0" y1="-5" x2="0" y2="45" stroke="#dc2626" strokeWidth="3.5" strokeDasharray="3 2" />
              <text x="5" y="-10" fontSize="8" fontWeight="bold" fill="#dc2626">3. Corte final no colar</text>
            </g>
          </svg>
        </div>
        <p className="text-[11px] text-stone-500">Passo 1 (alívio inferior) impede que o peso do ramo rasgue a casca do tronco; Passo 3 sela junto ao colar cicatrizante.</p>
      </div>
    );
  }

  if (type === "bush_berries") {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-2 text-center">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Esquema de Renovação de Canas (Framboesa / Mirtilo)</h4>
        <div className="w-full h-44 bg-gradient-to-b from-stone-50 to-pink-50/20 rounded-xl flex items-center justify-center p-2 border border-stone-100">
          <svg viewBox="0 0 320 160" className="w-full h-full max-h-40">
            {/* Solo */}
            <line x1="20" y1="145" x2="300" y2="145" stroke="#78350f" strokeWidth="3" />
            
            {/* Canas Velhas Secas de 2º ano (Castanhas - Cortar a 0 cm) */}
            <path d="M 120 145 Q 110 80 85 40" stroke="#78350f" strokeWidth="5" strokeDasharray="3 2" fill="none" opacity="0.6" />
            <line x1="110" y1="140" x2="130" y2="140" stroke="#dc2626" strokeWidth="3" />
            <text x="60" y="35" fontSize="8" fill="#dc2626">✂️ Cana velha seca (0 cm)</text>

            <path d="M 180 145 Q 200 80 230 45" stroke="#78350f" strokeWidth="5" strokeDasharray="3 2" fill="none" opacity="0.6" />
            <line x1="170" y1="140" x2="190" y2="140" stroke="#dc2626" strokeWidth="3" />
            <text x="210" y="40" fontSize="8" fill="#dc2626">✂️ Cortar rente ao solo</text>

            {/* Canas Novas Verdes do Ano (Manter e amarrar) */}
            <path d="M 140 145 Q 135 70 135 25" stroke="#16a34a" strokeWidth="5" fill="none" />
            <circle cx="135" cy="50" r="3" fill="#22c55e" />
            <circle cx="135" cy="75" r="3" fill="#22c55e" />
            
            <path d="M 160 145 Q 165 70 170 25" stroke="#16a34a" strokeWidth="5" fill="none" />
            <circle cx="168" cy="50" r="3" fill="#22c55e" />
            <circle cx="165" cy="75" r="3" fill="#22c55e" />

            {/* Desponte de canas a 1,20m */}
            <line x1="125" y1="25" x2="180" y2="25" stroke="#0284c7" strokeWidth="2" strokeDasharray="2 2" />
            <text x="155" y="18" fontSize="8" fontWeight="bold" fill="#0284c7" textAnchor="middle">Desponte a 1,20 m</text>
            <text x="155" y="110" fontSize="8" fontWeight="bold" fill="#16a34a" textAnchor="middle">🌿 Canas novas (Manter)</text>
          </svg>
        </div>
        <p className="text-[11px] text-stone-500">Canas secas que já deram fruto são ceifadas ao nível do chão (0 cm); canas verdes novas são preservadas e despontadas.</p>
      </div>
    );
  }

  // Padrão Geral: Copa em Taça Aberta (Macieira, Pereira, Pessegueiro, etc.)
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm space-y-2 text-center">
      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">Esquema de Copa em Taça Aberta ({name})</h4>
      <div className="w-full h-44 bg-gradient-to-b from-stone-50 to-emerald-50/20 rounded-xl flex items-center justify-center p-2 border border-stone-100">
        <svg viewBox="0 0 320 160" className="w-full h-full max-h-40">
          {/* Solo */}
          <line x1="20" y1="145" x2="300" y2="145" stroke="#a8a29e" strokeWidth="2" />

          {/* Tronco */}
          <rect x="150" y="85" width="20" height="60" fill="#78350f" rx="3" />
          <text x="160" y="125" fontSize="8" fill="#fef3c7" textAnchor="middle">Tronco</text>

          {/* Pernadas mestras abertas a 45° (Taça Verde - Manter) */}
          <path d="M 152 88 Q 110 70 70 40" stroke="#15803d" strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d="M 168 88 Q 210 70 250 40" stroke="#15803d" strokeWidth="7" fill="none" strokeLinecap="round" />

          {/* Ramos produtivos com gemas (Verdes) */}
          <line x1="100" y1="65" x2="80" y2="80" stroke="#16a34a" strokeWidth="3" />
          <circle cx="80" cy="80" r="3" fill="#86efac" />
          <line x1="220" y1="65" x2="240" y2="80" stroke="#16a34a" strokeWidth="3" />
          <circle cx="240" cy="80" r="3" fill="#86efac" />

          {/* Centro Aberto: Sol a entrar */}
          <circle cx="160" cy="20" r="10" fill="#f59e0b" opacity="0.8" />
          <text x="160" y="45" fontSize="8" fontWeight="bold" fill="#b45309" textAnchor="middle">Centro Livre (Sol)</text>

          {/* Ramos Ladrões Verticais (Vermelhos - Cortar) */}
          <line x1="130" y1="78" x2="130" y2="30" stroke="#ef4444" strokeWidth="3" strokeDasharray="3 2" />
          <line x1="123" y1="55" x2="137" y2="55" stroke="#ef4444" strokeWidth="2" />
          <text x="110" y="25" fontSize="8" fontWeight="bold" fill="#ef4444">✂️ Ladrão</text>

          {/* Ramo cruzado ao centro (Vermelho - Cortar) */}
          <path d="M 90 60 Q 140 70 175 65" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2 2" fill="none" />
          <text x="185" y="70" fontSize="8" fill="#ef4444">✂️ Cruzado</text>

          {/* Rebentos ladrões de raiz (Vermelhos - Cortar) */}
          <line x1="145" y1="135" x2="125" y2="120" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2 2" />
          <text x="85" y="130" fontSize="8" fill="#ef4444">✂️ Ladrão basal</text>
        </svg>
      </div>
      <p className="text-[11px] text-stone-500">Copa em cálice com centro desimpedido para entrar o sol; corte de ladrões verticais e ramos cruzados.</p>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL PodaSchemaViewer ---
export default function PodaSchemaViewer({ poda }) {
  const schema = PODA_SCHEMAS[poda?.id] || {
    title: poda?.name,
    diagramType: "cup_shape",
    cutAngle: "45° em bisel voltado para fora",
    cutHeight: "5 mm acima do gomo exterior",
    goldenRule: "Corta em bisel a 45° virado para o lado oposto da gema e mantém o centro da copa aberto à luz solar.",
    tools: ["Tesoura de poda afiada", "Serrote", "Desinfetante de lâminas"],
    steps: [
      {
        step: 1,
        title: "Limpeza Sanitária",
        badge: "Sanidade",
        cut: "Ramos secos, doentes, lascados ou atacados por pragas.",
        keep: "Madeira sã e ramos vigorosos.",
        description: "Começa sempre por eliminar o material vegetal morto ou com necroses.",
        proTip: "Desinfeta a tesoura com álcool entre árvores diferentes."
      },
      {
        step: 2,
        title: "Desbaste e Arejamento",
        badge: "Arejamento",
        cut: "Ramos cruzados que atritem uns nos outros e ladrões verticais.",
        keep: "Ramos bem orientados com ângulo de 45° a 60°.",
        description: "Abre o miolo da árvore para permitir a circulação de ar e passagem do sol.",
        proTip: "O sol é o melhor fungicida natural."
      },
      {
        step: 3,
        title: "Corte Produtivo em Bisel",
        badge: "Execução",
        cut: "Desponte de pontas a 45° sobre gema exterior.",
        keep: "Esporões florais e ramos de produção.",
        description: "Faz o corte a 45°, 5 mm acima de uma gema orientada para fora.",
        proTip: "A lâmina de corte deve ficar virada para o ramo que fica na árvore."
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* 1. Ângulo de Corte Anatómico */}
      <CutAngleDiagram cutAngle={schema.cutAngle} cutHeight={schema.cutHeight} />

      {/* 2. Diagrama de Arquitetura da Árvore */}
      <TreeArchitectureDiagram type={schema.diagramType} name={poda?.name} />

      {/* 3. Caixa de Regra de Ouro do Podador */}
      {schema.goldenRule && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 rounded-r-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 font-bold">
              👑
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">Regra de Ouro do Podador</h4>
              <p className="text-xs sm:text-sm text-stone-700 mt-0.5 leading-relaxed font-medium">
                {schema.goldenRule}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Passo a Passo Esquematizado */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-stone-800 text-sm flex items-center gap-2">
            <span>📋</span> Passo a Passo de Execução Técnica
          </h4>
          <span className="text-xs text-stone-400 font-medium">({schema.steps?.length || 0} fases)</span>
        </div>

        <div className="space-y-3">
          {(schema.steps || []).map((s) => (
            <div key={s.step} className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm hover:border-emerald-300 transition-colors space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {s.step}
                  </div>
                  <h5 className="font-bold text-stone-800 text-sm">{s.title}</h5>
                </div>
                {s.badge && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    {s.badge}
                  </span>
                )}
              </div>

              {/* Bloco O que Cortar vs O que Manter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>✂️ O QUE CORTAR:</span>
                  </div>
                  <p className="text-rose-950 pl-5 leading-relaxed">{s.cut}</p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>🌿 O QUE MANTER:</span>
                  </div>
                  <p className="text-emerald-950 pl-5 leading-relaxed">{s.keep}</p>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">{s.description}</p>

              {s.proTip && (
                <div className="text-[11px] bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 text-amber-900 flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span><b>Dica de Mestre:</b> {s.proTip}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Ferramentas Recomendadas */}
      {schema.tools && (
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/70 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
            <Wrench className="w-4 h-4 text-stone-500" />
            <span>Ferramentas & Proteção Sanitária</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {schema.tools.map((t, idx) => (
              <span key={idx} className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 shadow-2xs">
                🔧 {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
