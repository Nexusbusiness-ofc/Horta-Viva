import React, { useState } from "react";
import { Scissors, Ruler, Sparkles, X, Lightbulb, ShieldCheck, CheckCircle2, AlertTriangle, BookOpen, Box, Layers } from "lucide-react";
import { CutAngleDiagram, TreeArchitectureDiagram } from "./PodaSchemaViewer";
import Poda3DViewer from "./Poda3DViewer";
import Monda3DViewer from "@/components/mondas/Monda3DViewer";

export default function UniversalPruningGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("cut_angle");
  const [is3D, setIs3D] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl flex flex-col"
        style={{ WebkitOverflowScrolling: "touch" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-stone-800">Guia de Técnicas & Esquemas 3D</h3>
              <p className="text-xs text-stone-500">Corte a 45°, regra dos 3 cortes e desladroamento axilar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Abas de Navegação */}
        <div className="px-5 sm:px-6 pt-3 pb-1 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab("cut_angle")}
              className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all ${activeTab === "cut_angle" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"}`}
            >
              📐 Bisel a 45°
            </button>
            <button
              onClick={() => setActiveTab("three_cuts")}
              className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all ${activeTab === "three_cuts" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"}`}
            >
              🪵 3 Cortes
            </button>
            <button
              onClick={() => setActiveTab("thinning")}
              className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all ${activeTab === "thinning" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"}`}
            >
              🌱 Monda
            </button>
            <button
              onClick={() => setActiveTab("suckers")}
              className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all ${activeTab === "suckers" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"}`}
            >
              ✂️ Ladrão Axilar
            </button>
          </div>

          {/* Alternador 3D / 2D */}
          <button
            onClick={() => setIs3D(!is3D)}
            className={`shrink-0 flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all ${
              is3D
                ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
            }`}
          >
            {is3D ? <Box className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
            <span>{is3D ? "3D Ativo" : "Ver em 2D"}</span>
          </button>
        </div>

        {/* Conteúdo da Aba */}
        <div className="p-5 sm:p-6 space-y-5 flex-1">
          {activeTab === "cut_angle" && (
            <div className="space-y-4">
              {is3D ? (
                <Poda3DViewer diagramType="cup_shape" name="Ângulo de Corte a 45°" />
              ) : (
                <CutAngleDiagram
                  cutAngle="Bisel oblíquo a 45° com inclinação descendente oposta à gema"
                  cutHeight="5 a 7 mm acima do gomo voltado para o exterior"
                />
              )}

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs leading-relaxed text-emerald-950">
                <h5 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Posição Correta da Tesoura de Poda
                </h5>
                <p>
                  As tesouras de poda do tipo <i>by-pass</i> têm duas partes: a <b>lâmina de corte fina e afiada</b> e a <b>contra-lâmina grossa de apoio</b>.
                </p>
                <p className="font-semibold text-emerald-800">
                  👉 Regra crucial: A lâmina de corte deve ficar sempre virada para o lado do ramo que FICA na árvore! A contra-lâmina de apoio esmaga a madeira descartada, garantindo um corte liso e sem esmagamento na árvore viva.
                </p>
              </div>
            </div>
          )}

          {activeTab === "three_cuts" && (
            <div className="space-y-4">
              {is3D ? (
                <Poda3DViewer diagramType="heavy_branch_3cut" name="Ramos Pesados (3 Cortes)" />
              ) : (
                <TreeArchitectureDiagram type="heavy_branch_3cut" name="Ramos Grossos" />
              )}

              <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <h5 className="font-bold text-stone-800 text-sm">Por que é que nunca se corta um ramo grosso de uma só vez?</h5>
                  <p>
                    Quando começas a serrar um ramo pesado por cima, a meio do corte o peso da madeira faz com que o ramo tombe subitamente. Esse tombo <b>rasga a casca do tronco até ao solo</b>, criando uma ferida enorme que nunca mais fecha e apodrece o tronco da árvore.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-emerald-800 block">1. Corte de Alívio</span>
                    <p className="text-emerald-950">Por baixo do ramo, a 20-30 cm do tronco, serra 1/3 da grossura para cima. Cria o batente que trava qualquer rasgão.</p>
                  </div>
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-sky-800 block">2. Corte de Queda</span>
                    <p className="text-sky-950">Por cima do ramo, a 25-35 cm (ligeiramente mais à frente). O ramo quebra e cai livremente sem perigo para a casca.</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-amber-800 block">3. Corte no Colar</span>
                    <p className="text-amber-950">Com o toco já leve, faz o corte final no bordo exterior do colar de cicatrização sem entrar no tronco.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "thinning" && (
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              {is3D ? (
                <Monda3DViewer diagramType="root_thinning" name="Desbaste de Sementeira" spacingCm="5 a 10 cm" />
              ) : null}

              <div className="bg-lime-50/70 border border-lime-200 rounded-2xl p-4 space-y-2">
                <h5 className="font-bold text-lime-900 text-sm flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-lime-700" />
                  O Método Seguro de Desbaste (Tesoura vs Puxão)
                </h5>
                <p>
                  Nas sementeiras de raízes de reserva (cenouras, rabanetes, nabos e beterrabas), cada plântula depende de uma raiz aprumada subterrânea microscópica.
                </p>
                <p className="font-semibold text-lime-950">
                  ✂️ <b>Usa uma tesourinha de pontas finas:</b> Ao cortar o pé excedentário rente à terra, a raiz dele seca sem mover um único grão de terra ao redor da raiz da planta selecionada. Se puxares de solavanco em terra seca, arrancarás os pelos radiculares vizinhos e a cenoura bifurca em várias pernas feias!
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-2xl">🥕</span>
                  <p className="font-bold text-stone-800">Cenoura</p>
                  <p className="text-emerald-600 font-extrabold text-sm">4 a 5 cm</p>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-2xl">🔴</span>
                  <p className="font-bold text-stone-800">Rabanete</p>
                  <p className="text-emerald-600 font-extrabold text-sm">3 a 4 cm</p>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-2xl">🟣</span>
                  <p className="font-bold text-stone-800">Beterraba</p>
                  <p className="text-emerald-600 font-extrabold text-sm">8 a 10 cm</p>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-2xl">🥬</span>
                  <p className="font-bold text-stone-800">Alface</p>
                  <p className="text-emerald-600 font-extrabold text-sm">25 a 30 cm</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "suckers" && (
            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              {is3D ? (
                <Monda3DViewer diagramType="solanaceae_sucker" name="Desladroamento Axilar a 45°" />
              ) : null}

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <h5 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-emerald-700" />
                  O Desladroamento Axilar em Solanáceas (Tomate/Pimento)
                </h5>
                <p>
                  O 'ladrão' é um rebento vigoroso que brota exatamente na axila (o ângulo de 45° entre a haste principal e a folha).
                </p>
                <div className="space-y-1.5 pt-1">
                  <p><b>1. Tamanho ideal:</b> 3 a 5 cm de comprimento. Não deixes ultrapassar os 7 cm.</p>
                  <p><b>2. Técnica do polegar:</b> Segura a haste e empurra o ladrão lateralmente. Ele estala com um clique limpo.</p>
                  <p><b>3. Hora do dia:</b> Meio da manhã num dia quente e com sol pleno. A luz ultravioleta e o calor secam e selam a microferida em menos de 2 horas, impedindo esporos de míldio.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com botão Fechar */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Entendido, fechar guia
          </button>
        </div>
      </div>
    </div>
  );
}
