import React, { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Sprout, Droplets, MapPin } from "lucide-react";
import StepIllustration from "@/components/curas/StepIllustration";

// Guias visuais dos herbicidas naturais caseiros — cada passo com ilustração SVG
const GUIDES = [
  {
    key: "vinagre_sal",
    label: "Vinagre + Sal + Sabão",
    emoji: "🫗",
    color: "#eab308",
    intro: "Herbicida natural de contacto, barato e fácil de preparar. Mata as ervas por dessicação.",
    steps: [
      {
        illus: "pour_vinegar",
        title: "Deitar o vinagre",
        text: "Coloca 1 L de vinagre branco (mínimo 10% de ácido acético) numa garrafa de plástico ou vidro. O ácido acético é o princípio ativo que seca as ervas.",
      },
      {
        illus: "add_salt",
        title: "Adicionar o sal",
        text: "Junta 3 colheres de sopa de sal fino (cerca de 45 g). Fecha e agita até dissolver completamente — o sal intensifica o efeito secante.",
      },
      {
        illus: "add_soap",
        title: "Juntar o sabão",
        text: "Adiciona 1 colher de chá de sabão líquido da louça. Funciona como adesivo: faz a mistura grudar nas folhas e penetrar melhor.",
      },
      {
        illus: "shake",
        title: "Agitar e usar",
        text: "Fecha a garrafa e agita vigorosamente. A mistura está pronta a usar de imediato — não armazenar mais de 2 dias.",
      },
    ],
    applications: [
      { where: "Caminhos e pavimentos", how: "Pulveriza diretamente sobre as ervas, molhando bem as folhas. Mata tudo o que tocar — não há seletividade." },
      { where: "Canteiros antes da sementeira", how: "Aplica 3–5 dias antes de semear. Depois rega bem o solo para lavar os resíduos de sal antes de plantar." },
      { where: "Entre as linhas de cultura", how: "Protege as hortícolas com um cartão ou tábua. Pulveriza só as ervas, evitando qualquer deriva para as culturas." },
    ],
  },
  {
    key: "agua_fervente",
    label: "Água Fervente",
    emoji: "💧",
    color: "#f97316",
    intro: "Herbicida térmico, sem qualquer produto químico. Destrói as ervas por choque térmico. O mais ecológico de todos.",
    steps: [
      {
        illus: "boil_water",
        title: "Ferver a água",
        text: "Ferve água numa chaleira ou panela. Usa luvas térmicas e cuidado com queimaduras — a água tem de estar mesmo a ferver.",
      },
      {
        illus: "pour_hot",
        title: "Verter sobre as ervas",
        text: "Leva ao local e verte lentamente sobre cada erva, centímetro a centímetro, cobrindo toda a planta. O choque térmico destrói as células.",
      },
      {
        illus: "pour_hot",
        title: "Repetir se necessário",
        text: "Se a erva voltar a brotar (ervas perenes com raiz funda), repete passados 3–5 dias. Em ervas jovens basta uma aplicação.",
      },
    ],
    applications: [
      { where: "Fendas do pavimento e muros", how: "Verte a água a ferver diretamente nas fendas. Ideal para ervas e musgo em caminhos de pedra." },
      { where: "Canteiros vazios", how: "Aplica apenas em canteiros sem culturas. A água quente não deixa resíduo — podes semear logo após arrefecer." },
      { where: "Cuidado com culturas vizinhas", how: "Nunca uses perto de hortícolas ou aromáticas — a água escorre e pode atingir as raízes das plantas ao lado." },
    ],
  },
  {
    key: "bicarbonato",
    label: "Bicarbonato de Sódio",
    emoji: "🧂",
    color: "#94a3b8",
    intro: "Herbicida natural que também controla fungos. Funciona por alteração do pH na superfície da folha.",
    steps: [
      {
        illus: "dissolve_powder",
        title: "Dissolver o bicarbonato",
        text: "Dissolve 2 colheres de sopa de bicarbonato de sódio (cerca de 30 g) em 1 L de água quente. Mexe até dissolver completamente.",
      },
      {
        illus: "add_soap",
        title: "Arrefecer e adicionar sabão",
        text: "Deixa a solução arrefecer à temperatura ambiente. Depois adiciona 1 colher de chá de sabão líquido e mistura bem.",
      },
      {
        illus: "fill_sprayer",
        title: "Colocar no pulverizador",
        text: "Coloca a solução num pulverizador e agita antes de cada uso. Aplica em dias secos e solarengos para maior eficácia.",
      },
    ],
    applications: [
      { where: "Caminhos e zonas pavimentadas", how: "Pulverisa cobrindo bem as ervas e o musgo. Melhor em dia seco com sol — repete após uma semana se a erva persistir." },
      { where: "Canteiros antes da sementeira", how: "Aplica e espera 1–2 dias antes de semear. Evita perto de plântulas e sementes recém-germinadas." },
      { where: "Ramos com oídio (fungo)", how: "Pulverisa nas folhas afetadas por oídio — o bicarbonato também inibe o desenvolvimento de fungos." },
    ],
  },
];

export default function HerbicideGuides() {
  return (
    <section>
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-4 h-4 text-lime-600" />
        <h2 className="text-sm font-bold text-stone-700">Guias visuais — herbicidas naturais</h2>
      </div>
      <p className="text-xs text-stone-500 mb-3">Passo a passo ilustrado para preparares em casa e aplicares em cada tipo de plantação.</p>

      <div className="space-y-4">
        {GUIDES.map((g) => (
          <GuideCard key={g.key} guide={g} />
        ))}
      </div>
    </section>
  );
}

function GuideCard({ guide }) {
  const [openApp, setOpenApp] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
      {/* Cabeçalho do guia */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${guide.color}18, ${guide.color}06)` }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ backgroundColor: guide.color + "20" }}
        >
          {guide.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-stone-800 text-sm">{guide.label}</p>
          <p className="text-xs text-stone-500 leading-tight">{guide.intro}</p>
        </div>
      </div>

      {/* Passos ilustrados */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guide.steps.map((step, i) => (
            <div key={i} className="flex gap-3 bg-lime-50/40 rounded-xl p-3">
              {/* Ilustração */}
              <div className="w-16 h-16 shrink-0 rounded-xl bg-white border border-stone-100 flex items-center justify-center p-1.5">
                <StepIllustration type={step.illus} color={guide.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-lime-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-xs font-bold text-stone-700">{step.title}</p>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Aplicação por plantação */}
        <div className="mt-3">
          <button
            onClick={() => setOpenApp(!openApp)}
            className="w-full flex items-center justify-between text-xs font-semibold text-stone-700 bg-amber-50 rounded-lg px-3 py-2"
          >
            <span className="flex items-center gap-1.5">
              <Sprout className="w-3.5 h-3.5 text-amber-600" /> Como aplicar em cada plantação
            </span>
            {openApp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openApp && (
            <div className="mt-2 space-y-2">
              {guide.applications.map((app, i) => (
                <div key={i} className="bg-amber-50/50 rounded-lg p-2.5 border border-amber-100/60">
                  <p className="text-xs font-semibold text-amber-700 flex items-center gap-1 mb-1">
                    <MapPin className="w-3 h-3" /> {app.where}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed flex items-start gap-1.5">
                    <Droplets className="w-3 h-3 text-stone-400 mt-0.5 shrink-0" />
                    <span>{app.how}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}