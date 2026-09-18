import React, { useState } from "react";
import { Scissors, Sprout, CheckCircle2, XCircle, Lightbulb, Ruler, Utensils, Sparkles } from "lucide-react";
import { MONDA_SCHEMAS } from "@/lib/pruningThinningSchemas";

// --- SVG DIAGRAMS PARA MONDAS ---

// 1. Diagrama de Linha de Sementeira & Régua de Raízes
function RootThinningDiagram({ name, spacingCm }) {
  const [stage, setStage] = useState("after"); // 'before' | 'after'

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-lime-100 flex items-center justify-center text-lime-700">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-stone-800 text-sm">Esquema de Desbaste de Linha</h4>
            <p className="text-xs text-stone-500">Alterna entre o antes e o depois da monda</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setStage("before")}
            className={`px-2.5 py-1 rounded-lg transition-all ${stage === "before" ? "bg-white text-stone-800 shadow-xs" : "text-stone-500 hover:text-stone-800"}`}
          >
            Antes (Denso)
          </button>
          <button
            onClick={() => setStage("after")}
            className={`px-2.5 py-1 rounded-lg transition-all ${stage === "after" ? "bg-emerald-600 text-white shadow-xs" : "text-stone-500 hover:text-stone-800"}`}
          >
            Depois (Espaçado)
          </button>
        </div>
      </div>

      <div className="w-full h-48 bg-gradient-to-b from-stone-50 via-amber-50/10 to-amber-900/10 rounded-xl flex items-center justify-center p-2 border border-stone-100 overflow-hidden">
        <svg viewBox="0 0 340 160" className="w-full h-full max-h-44">
          {/* Superfície do Solo */}
          <rect x="10" y="85" width="320" height="65" fill="#78350f" opacity="0.8" rx="2" />
          <line x1="10" y1="85" x2="330" y2="85" stroke="#451a03" strokeWidth="2" />
          <text x="25" y="140" fontSize="9" fill="#fef3c7" opacity="0.6">Camada de Solo (Terra Macia)</text>

          {/* Régua Graduada no Topo */}
          <g transform="translate(20, 15)">
            <rect x="0" y="0" width="300" height="18" fill="#f8fafc" stroke="#cbd5e1" rx="4" />
            <line x1="30" y1="0" x2="30" y2="18" stroke="#94a3b8" strokeWidth="1" />
            <text x="30" y="13" fontSize="8" fill="#475569" textAnchor="middle">0 cm</text>
            <line x1="90" y1="0" x2="90" y2="18" stroke="#94a3b8" strokeWidth="1" />
            <text x="90" y="13" fontSize="8" fill="#475569" textAnchor="middle">5 cm</text>
            <line x1="150" y1="0" x2="150" y2="18" stroke="#94a3b8" strokeWidth="1" />
            <text x="150" y="13" fontSize="8" fill="#475569" textAnchor="middle">10 cm</text>
            <line x1="210" y1="0" x2="210" y2="18" stroke="#94a3b8" strokeWidth="1" />
            <text x="210" y="13" fontSize="8" fill="#475569" textAnchor="middle">15 cm</text>
            <line x1="270" y1="0" x2="270" y2="18" stroke="#94a3b8" strokeWidth="1" />
            <text x="270" y="13" fontSize="8" fill="#475569" textAnchor="middle">20 cm</text>
          </g>

          {stage === "before" ? (
            /* CENÁRIO ANTES DA MONDA: Aglomerado e raízes a competir */
            <g>
              {/* Plântulas coladas */}
              {[40, 50, 60, 95, 105, 115, 145, 155, 170, 205, 215, 230, 265, 275].map((x, idx) => (
                <g key={idx} transform={`translate(${x}, 85)`}>
                  {/* Folhagem acima do solo */}
                  <path d="M 0 0 Q -5 -25 -10 -35 M 0 0 Q 0 -30 0 -40 M 0 0 Q 5 -25 10 -35" stroke="#16a34a" strokeWidth="1.5" fill="none" />
                  {/* Raiz fina a enrolar debaixo da terra */}
                  <path d="M 0 0 Q 2 20 -3 35" stroke="#ea580c" strokeWidth="2" fill="none" opacity="0.8" />
                </g>
              ))}
              <text x="170" y="55" fontSize="10" fontWeight="bold" fill="#dc2626" textAnchor="middle">
                ⚠️ Aglomerado: Raízes sufocadas e tortas
              </text>
            </g>
          ) : (
            /* CENÁRIO DEPOIS DA MONDA: Espaçamento perfeito com corte de tesoura */
            <g>
              {/* Plantas principais mantidas a cada 60px (5 cm reais na escala) */}
              {[50, 110, 170, 230, 290].map((x, idx) => (
                <g key={idx} transform={`translate(${x}, 85)`}>
                  {/* Folhagem luxuriante */}
                  <path d="M 0 0 Q -8 -25 -15 -42 M 0 0 Q 0 -35 0 -50 M 0 0 Q 8 -25 15 -42" stroke="#15803d" strokeWidth="2.5" fill="none" />
                  {/* Raiz aprumada e grossa a desenvolver-se livremente */}
                  <polygon points="-4,0 4,0 1,45 -1,45" fill="#ea580c" />
                  <circle cx="0" cy="0" r="4" fill="#65a30d" />
                </g>
              ))}

              {/* Marcas de corte rente ao chão das eliminadas com tesoura */}
              {[75, 135, 195, 255].map((x, idx) => (
                <g key={idx} transform={`translate(${x}, 85)`}>
                  <line x1="-5" y1="0" x2="5" y2="0" stroke="#ef4444" strokeWidth="2.5" />
                  <text x="0" y="-8" fontSize="8" fill="#ef4444" textAnchor="middle">✂️ rente</text>
                </g>
              ))}

              <text x="170" y="52" fontSize="11" fontWeight="bold" fill="#15803d" textAnchor="middle">
                ✅ Espaçamento Ideal: {spacingCm || "5 cm"} entre plantas
              </text>
            </g>
          )}
        </svg>
      </div>
      <p className="text-[11px] text-stone-500">
        Usa uma tesourinha afiada ao nível do solo para eliminar os pés secundários sem abalar a raiz da plântula que fica.
      </p>
    </div>
  );
}

// 2. Diagrama de Desladroamento de Axilas a 45° (Tomateiro, Pimenteiro, Beringela)
function SolanaceaeSuckerDiagram() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
          <Scissors className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-stone-800 text-sm">Anatomia do Desladroamento Axilar (45°)</h4>
          <p className="text-xs text-stone-500">Remoção manual com o polegar num dia seco de sol</p>
        </div>
      </div>

      <div className="w-full h-48 bg-gradient-to-b from-stone-50 to-emerald-50/20 rounded-xl flex items-center justify-center p-2 border border-stone-100">
        <svg viewBox="0 0 320 160" className="w-full h-full max-h-44">
          {/* Caule Principal Vertical */}
          <rect x="70" y="10" width="22" height="140" fill="#15803d" rx="4" />
          <text x="81" y="145" fontSize="9" fontWeight="bold" fill="#fef3c7" textAnchor="middle">Caule Principal</text>

          {/* Folha Horizontal de Suporte */}
          <path d="M 90 95 Q 160 100 230 115" stroke="#16a34a" strokeWidth="10" fill="none" strokeLinecap="round" />
          <text x="200" y="132" fontSize="9" fontWeight="bold" fill="#15803d">Folha Principal</text>

          {/* Ângulo de 45° desenhado */}
          <path d="M 92 80 A 20 20 0 0 1 110 95" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="115" y="85" fontSize="9" fontWeight="bold" fill="#64748b">45°</text>

          {/* O LADRÃO AXILAR (Chupão) a 45° */}
          <g transform="translate(90, 90)">
            <path d="M 0 0 Q 35 -30 65 -55" stroke="#ef4444" strokeWidth="7" fill="none" strokeDasharray="4 2" strokeLinecap="round" />
            {/* Folhinhas do ladrão */}
            <circle cx="65" cy="-55" r="5" fill="#ef4444" />
            <circle cx="45" cy="-40" r="4" fill="#ef4444" />
            <text x="75" y="-55" fontSize="10" fontWeight="bold" fill="#dc2626">✂️ LADRÃO AXILAR</text>
            <text x="75" y="-42" fontSize="8" fill="#dc2626">(Retirar aos 3-5 cm)</text>
          </g>

          {/* Seta do polegar a dobrar lateralmente */}
          <path d="M 140 45 Q 155 60 145 75" fill="none" stroke="#0284c7" strokeWidth="2.5" markerEnd="url(#arrow)" />
          <text x="160" y="65" fontSize="8" fontWeight="bold" fill="#0284c7">Técnica do Polegar</text>
        </svg>
      </div>
      <p className="text-[11px] text-stone-500">
        Dobra o ladrão com o polegar num dia ensolarado: parte com um estalido limpo e a ferida cicatriza sem fungos em poucas horas.
      </p>
    </div>
  );
}

// 3. Diagrama de Cucurbitáceas (Desponta Apical e Frutos)
function CucurbitDiagram({ name }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
          <Sprout className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-stone-800 text-sm">Desponta da Guia e Monda de Frutos</h4>
          <p className="text-xs text-stone-500">Corte na 3ª/4ª folha para forçar ramos com flores femininas</p>
        </div>
      </div>

      <div className="w-full h-48 bg-gradient-to-b from-stone-50 to-amber-50/20 rounded-xl flex items-center justify-center p-2 border border-stone-100">
        <svg viewBox="0 0 320 160" className="w-full h-full max-h-44">
          {/* Rama principal horizontal */}
          <path d="M 20 100 Q 120 90 220 85 L 280 80" stroke="#16a34a" strokeWidth="6" fill="none" strokeLinecap="round" />
          
          {/* Folha 1 */}
          <circle cx="60" cy="75" r="14" fill="#22c55e" opacity="0.8" />
          <text x="60" y="78" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">1ª</text>

          {/* Folha 2 */}
          <circle cx="110" cy="70" r="14" fill="#22c55e" opacity="0.8" />
          <text x="110" y="73" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">2ª</text>

          {/* Folha 3 com Fruto Selecionado */}
          <circle cx="160" cy="65" r="14" fill="#22c55e" opacity="0.8" />
          <text x="160" y="68" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">3ª</text>
          <ellipse cx="160" cy="115" rx="16" ry="12" fill="#eab308" stroke="#ca8a04" strokeWidth="2" />
          <text x="160" y="140" fontSize="8" fontWeight="bold" fill="#854d0e" textAnchor="middle">🍈 Fruto Mantido</text>

          {/* Folha 4 */}
          <circle cx="210" cy="60" r="14" fill="#22c55e" opacity="0.8" />
          <text x="210" y="63" fontSize="9" fontWeight="bold" fill="#ffffff" textAnchor="middle">4ª</text>

          {/* Corte da guia após a 4ª folha */}
          <line x1="240" y1="40" x2="240" y2="105" stroke="#dc2626" strokeWidth="3" strokeDasharray="3 2" />
          <text x="245" y="45" fontSize="9" fontWeight="bold" fill="#dc2626">✂️ Desponta Apical</text>
          <text x="245" y="56" fontSize="8" fill="#dc2626">(Trava a guia)</text>

          {/* Ponta da guia a eliminar */}
          <path d="M 245 80 Q 275 75 300 70" stroke="#9ca3af" strokeWidth="4" strokeDasharray="2 2" fill="none" />
        </svg>
      </div>
      <p className="text-[11px] text-stone-500">
        Desponta a rama guia 2 folhas à frente do fruto selecionado: canaliza toda a água e açúcar para engordar o fruto.
      </p>
    </div>
  );
}

// 4. Diagrama de Beliscão Apical (Manjericão, Aromáticas, Favas)
function ApicalPinchDiagram() {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-stone-800 text-sm">O 'Beliscão' Apical (Topping)</h4>
          <p className="text-xs text-stone-500">Corta a ponta central para duplicar a copa em dois ramos</p>
        </div>
      </div>

      <div className="w-full h-48 bg-gradient-to-b from-stone-50 to-teal-50/20 rounded-xl flex items-center justify-center p-2 border border-stone-100">
        <svg viewBox="0 0 320 160" className="w-full h-full max-h-44">
          {/* Caule vertical */}
          <rect x="153" y="60" width="14" height="90" fill="#15803d" rx="2" />
          
          {/* 3º Par de Folhas */}
          <ellipse cx="120" cy="110" rx="25" ry="10" fill="#22c55e" stroke="#16a34a" />
          <ellipse cx="200" cy="110" rx="25" ry="10" fill="#22c55e" stroke="#16a34a" />

          {/* 4º Par de Folhas */}
          <ellipse cx="115" cy="80" rx="28" ry="12" fill="#22c55e" stroke="#16a34a" />
          <ellipse cx="205" cy="80" rx="28" ry="12" fill="#22c55e" stroke="#16a34a" />

          {/* Corte no topo acima do 4º par */}
          <line x1="135" y1="58" x2="185" y2="58" stroke="#dc2626" strokeWidth="3" strokeDasharray="3 2" />
          <text x="160" y="45" fontSize="10" fontWeight="bold" fill="#dc2626" textAnchor="middle">✂️ Beliscão com as unhas</text>

          {/* Duas novas ramificações laterais a brotar */}
          <path d="M 150 75 Q 130 65 110 50" stroke="#0284c7" strokeWidth="3" fill="none" strokeDasharray="2 2" />
          <circle cx="110" cy="50" r="5" fill="#38bdf8" />
          <text x="80" y="45" fontSize="8" fontWeight="bold" fill="#0284c7">Ramo Novo 1</text>

          <path d="M 170 75 Q 190 65 210 50" stroke="#0284c7" strokeWidth="3" fill="none" strokeDasharray="2 2" />
          <circle cx="210" cy="50" r="5" fill="#38bdf8" />
          <text x="215" y="45" fontSize="8" fontWeight="bold" fill="#0284c7">Ramo Novo 2</text>
        </svg>
      </div>
      <p className="text-[11px] text-stone-500">
        Cada desponta apical obriga o nascimento de 2 novos ramos laterais, multiplicando a folhagem e o vigor do arbusto.
      </p>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL MondaSchemaViewer ---
export default function MondaSchemaViewer({ monda }) {
  const schema = MONDA_SCHEMAS[monda?.id] || {
    title: monda?.name,
    diagramType: "root_thinning",
    spacingCm: monda?.spacing || "10 a 15 cm",
    techniqueRule: "Desbaste seletivo das plântulas menores em terra húmida para dar espaço aos exemplares mais fortes.",
    goldenRule: "Nunca arranques com força bruta para não desestabilizar as raízes das plantas vizinhas.",
    steps: [
      {
        step: 1,
        title: "Primeiro Raleio",
        badge: "Seleção",
        remove: "Plântulas fracas, finas e aglomeradas.",
        preserve: "Os exemplares mais aprumados e sãos.",
        description: "Inicia a monda quando surgirem as primeiras folhas verdadeiras.",
        proTip: "Rega o solo antes da operação para facilitar a saída da raiz."
      },
      {
        step: 2,
        title: "Espaçamento Final",
        badge: "Desenvolvimento",
        remove: "Pés intermédios em excesso.",
        preserve: `Distância final recomendada (${monda?.spacing || "10 a 15 cm"}).`,
        description: "Garante espaço livre para circulação de ar e nutrição completa da planta.",
        proTip: "Aproveita o material retirado para a cozinha se for comestível."
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* 1. Diagrama Vetorial Específico */}
      {schema.diagramType === "solanaceae_sucker" && <SolanaceaeSuckerDiagram />}
      {schema.diagramType === "cucurbit_trail" && <CucurbitDiagram name={monda?.name} />}
      {schema.diagramType === "herb_pinch" && <ApicalPinchDiagram />}
      {schema.diagramType !== "solanaceae_sucker" && schema.diagramType !== "cucurbit_trail" && schema.diagramType !== "herb_pinch" && (
        <RootThinningDiagram name={monda?.name} spacingCm={schema.spacingCm} />
      )}

      {/* 2. Destaque do Espaçamento Final em Régua */}
      {schema.spacingCm && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-stone-500 font-medium">Espaçamento Final Recomendado</p>
              <h5 className="text-base font-extrabold text-emerald-800">{schema.spacingCm}</h5>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
            Distância de Ouro
          </span>
        </div>
      )}

      {/* 3. Caixa de Regra de Ouro da Monda */}
      {schema.goldenRule && (
        <div className="bg-gradient-to-r from-lime-500/15 via-lime-500/5 to-transparent border-l-4 border-lime-600 rounded-r-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-lime-100 flex items-center justify-center shrink-0 text-lime-800 font-bold">
              👑
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-lime-900">Regra de Ouro da Monda</h4>
              <p className="text-xs sm:text-sm text-stone-800 mt-0.5 leading-relaxed font-medium">
                {schema.goldenRule}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Selo de Aproveitamento Culinário (se aplicável) */}
      {schema.edibleBabyGreens && (
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-emerald-900">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold block text-emerald-950">🥗 Aproveitamento Culinário (Zero Desperdício)</span>
            <span className="text-emerald-800 leading-relaxed">{schema.edibleBabyGreens}</span>
          </div>
        </div>
      )}

      {/* 5. Passo a Passo Esquematizado */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-stone-800 text-sm flex items-center gap-2">
            <span>🌱</span> Execução Passo a Passo da Monda
          </h4>
          <span className="text-xs text-stone-400 font-medium">({schema.steps?.length || 0} fases)</span>
        </div>

        <div className="space-y-3">
          {(schema.steps || []).map((s) => (
            <div key={s.step} className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-sm hover:border-lime-300 transition-colors space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-lime-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
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

              {/* Bloco O que Retirar vs O que Preservar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-800">
                    <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>✂️ O QUE RETIRAR / MONDAR:</span>
                  </div>
                  <p className="text-rose-950 pl-5 leading-relaxed">{s.remove}</p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>🌿 O QUE PRESERVAR:</span>
                  </div>
                  <p className="text-emerald-950 pl-5 leading-relaxed">{s.preserve}</p>
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
    </div>
  );
}
