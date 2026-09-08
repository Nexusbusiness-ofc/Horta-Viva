import React, { useState } from "react";
import { FlaskConical, Leaf, Clock, ShieldCheck, ListChecks, Sprout, ChevronDown, ChevronUp } from "lucide-react";

export default function HerbicideCard({ herb }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0" style={{ background: herb.color }} />
        <div className="flex-1 p-3.5">
          {/* Cabeçalho */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: herb.color + "15" }}
            >
              {herb.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-stone-800 text-sm">{herb.label}</p>
              <p className="text-xs text-stone-500">{herb.type}</p>
            </div>
            {herb.organic ? (
              <span className="text-xs bg-green-50 text-green-700 rounded-full px-2 py-0.5 flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3" /> Biológico
              </span>
            ) : (
              <span className="text-xs bg-stone-100 text-stone-500 rounded-full px-2 py-0.5 shrink-0">Químico</span>
            )}
          </div>

          {/* Alvo (ervas que controla) */}
          <div className="mt-2">
            <span className="text-xs bg-red-50 text-red-600 rounded-full px-2 py-0.5 inline-flex items-center gap-1">
              <Leaf className="w-3 h-3" /> {herb.targets}
            </span>
          </div>

          {/* Quando usar */}
          <p className="mt-2 text-xs text-stone-500">
            <b className="text-stone-600">Quando:</b> {herb.when}
          </p>

          {/* Em que plantações usar */}
          <div className="mt-1.5 bg-amber-50/60 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-amber-700 flex items-center gap-1 mb-0.5">
              <Sprout className="w-3.5 h-3.5" /> Em que plantações usar
            </p>
            <p className="text-xs text-stone-600 leading-relaxed">{herb.crops}</p>
          </div>

          {/* Como utilizar */}
          <div className="mt-1.5 bg-stone-50 rounded-lg p-2.5">
            <p className="text-xs font-semibold text-stone-600 mb-0.5">Como utilizar</p>
            <p className="text-xs text-stone-600 leading-relaxed">{herb.how}</p>
          </div>

          {/* Preparação passo a passo */}
          {herb.preparation && herb.preparation.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between text-xs font-semibold text-stone-700 bg-lime-50 rounded-lg px-2.5 py-1.5"
              >
                <span className="flex items-center gap-1">
                  <ListChecks className="w-3.5 h-3.5 text-lime-600" /> Como preparar (passo a passo)
                </span>
                {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {open && (
                <ol className="mt-1.5 space-y-1.5">
                  {herb.preparation.map((step, i) => (
                    <li key={i} className="flex gap-2 text-xs text-stone-600 bg-lime-50/40 rounded-lg px-2.5 py-1.5">
                      <span className="w-5 h-5 shrink-0 rounded-full bg-lime-500 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="leading-relaxed pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}

          {/* Produtos comerciais */}
          {herb.products?.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5 text-stone-500" /> Produtos fitofarmacêuticos
              </p>
              {herb.products.map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-blue-50/50 rounded-lg px-2.5 py-1.5">
                  <span className="text-sm font-medium text-stone-800">{p.name}</span>
                  <span className="text-xs text-stone-400">· {p.active}</span>
                  <span className="ml-auto text-xs font-semibold text-blue-600">{p.dose}</span>
                </div>
              ))}
            </div>
          )}

          {/* Intervalo de segurança */}
          {herb.safetyDays > 0 && (
            <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {herb.safetyDays} dias de intervalo de segurança
            </p>
          )}
        </div>
      </div>
    </div>
  );
}