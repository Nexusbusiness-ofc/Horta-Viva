import { useI18n } from "@/lib/I18nContext";
import React, { useState } from "react";
import { Scissors, Ruler, X, ShieldCheck, BookOpen, Box, Layers, Lock } from "lucide-react";
import { CutAngleDiagram, TreeArchitectureDiagram } from "./PodaSchemaViewer";
import Poda3DViewer from "./Poda3DViewer";
import Monda3DViewer from "@/components/mondas/Monda3DViewer";
import { useSubscription } from "@/lib/subscription";
import UpgradeModal from "@/components/subscription/UpgradeModal";
export default function UniversalPruningGuideModal({
  isOpen,
  onClose
}) {
  const {
    t: i18nT
  } = useI18n();
  const {
    isPro,
    isPlus,
    isUltra,
    canAccessPruning2D,
    canAccessPruning3D,
    tier
  } = useSubscription();
  const [activeTab, setActiveTab] = useState("cut_angle");
  const [is3D, setIs3D] = useState(canAccessPruning3D);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl flex flex-col" style={{
      WebkitOverflowScrolling: "touch"
    }} onClick={e => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-stone-800">{i18nT("Guia de Técnicas & Esquemas 3D")}</h3>
              <p className="text-xs text-stone-500">{i18nT("Corte a 45°, regra dos 3 cortes e desladroamento axilar")}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Abas de Navegação */}
        <div className="px-5 sm:px-6 pt-3 pb-1 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => setActiveTab("cut_angle")} className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all ${activeTab === "cut_angle" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"}`}>{i18nT("📐 Bisel a 45°")}</button>
            <button onClick={() => setActiveTab("three_cuts")} className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all ${activeTab === "three_cuts" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"}`}>{i18nT("🪵 3 Cortes")}</button>
            <button onClick={() => setActiveTab("thinning")} className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all ${activeTab === "thinning" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"}`}>{i18nT("🌱 Monda")}</button>
            <button onClick={() => setActiveTab("suckers")} className={`text-xs font-semibold py-2 px-3 rounded-xl transition-all ${activeTab === "suckers" ? "bg-emerald-600 text-white shadow-xs" : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"}`}>{i18nT("✂️ Ladrão Axilar")}</button>
          </div>

          {/* Alternador 3D / 2D */}
          <button onClick={() => setIs3D(!is3D)} className={`shrink-0 flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all ${is3D ? "bg-amber-500 text-white border-amber-600 shadow-xs" : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"}`}>
            {is3D ? <Box className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
            <span>{is3D ? i18nT("3D Ativo") : i18nT("Ver em 2D")}</span>
            {is3D && !canAccessPruning3D && <Lock className="w-3 h-3 text-white/90" />}
            {!is3D && !canAccessPruning2D && <Lock className="w-3 h-3 text-amber-500" />}
          </button>
        </div>

        {/* Modal de Upgrade */}
        <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} reason="esquemas" customTitle="Desbloquear Esquemas de Podas" customDescription="Acede aos esquemas anatómicos 2D e simulações 3D interativas de podas e mondas." />

        {/* Conteúdo da Aba */}
        <div className="p-5 sm:p-6 space-y-5 flex-1 relative">
          {(is3D && !canAccessPruning3D || !is3D && !canAccessPruning2D) && <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-6 max-w-sm w-full border border-stone-200 shadow-xl text-center space-y-3 animate-in fade-in zoom-in-95">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-stone-800 text-base">
                    {is3D ? i18nT("Esquema 3D Bloqueado") : i18nT("Esquemas 2D Bloqueados")}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {is3D ? isPlus ? i18nT("O modelo 3D interativo está disponível no Plano Pro (2,99€) e Ultra (3,99€). Podes consultar a versão em Esquema 2D incluída no teu Plano Plus!") : i18nT("Os esquemas 2D e 3D de podas e mondas estão disponíveis a partir do Plano Plus (1,99€/mês).") : i18nT("Os esquemas técnicos e diagramas anatómicos estão disponíveis a partir do Plano Plus (1,99€/mês).")}
                  </p>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  {is3D && isPlus ? <>
                      <button type="button" onClick={() => setIs3D(false)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-all">{i18nT("Ver Esquema em 2D (Incluído no Plus)")}</button>
                      <button type="button" onClick={() => setShowUpgradeModal(true)} className="w-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs py-2 px-3 rounded-xl transition-all">{i18nT("Upgrade Pro (2,99€) para 3D")}</button>
                    </> : <button type="button" onClick={() => setShowUpgradeModal(true)} className="w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-md transition-all active:scale-95">{i18nT("Desbloquear Esquemas (1,99€)")}</button>}
                </div>
              </div>
            </div>}

          <div className={is3D && !canAccessPruning3D || !is3D && !canAccessPruning2D ? "filter blur-md pointer-events-none select-none opacity-30 space-y-5" : "space-y-5"}>
          {activeTab === "cut_angle" && <div className="space-y-4">
              {is3D ? <Poda3DViewer diagramType="cup_shape" name="Ângulo de Corte a 45°" /> : <CutAngleDiagram cutAngle="Bisel oblíquo a 45° com inclinação descendente oposta à gema" cutHeight="5 a 7 mm acima do gomo voltado para o exterior" />}

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs leading-relaxed text-emerald-950">
                <h5 className="font-bold text-sm text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />{i18nT("Posição Correta da Tesoura de Poda")}</h5>
                <p>{i18nT("As tesouras de poda do tipo ")}<i>{i18nT("by-pass")}</i>{i18nT(" têm duas partes: a ")}<b>{i18nT("lâmina de corte fina e afiada")}</b>{i18nT(" e a ")}<b>{i18nT("contra-lâmina grossa de apoio")}</b>.
                </p>
                <p className="font-semibold text-emerald-800">{i18nT("👉 Regra crucial: A lâmina de corte deve ficar sempre virada para o lado do ramo que FICA na árvore! A contra-lâmina de apoio esmaga a madeira descartada, garantindo um corte liso e sem esmagamento na árvore viva.")}</p>
              </div>
            </div>}

          {activeTab === "three_cuts" && <div className="space-y-4">
              {is3D ? <Poda3DViewer diagramType="heavy_branch_3cut" name="Ramos Pesados (3 Cortes)" /> : <TreeArchitectureDiagram type="heavy_branch_3cut" name="Ramos Grossos" />}

              <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <h5 className="font-bold text-stone-800 text-sm">{i18nT("Por que é que nunca se corta um ramo grosso de uma só vez?")}</h5>
                  <p>{i18nT("Quando começas a serrar um ramo pesado por cima, a meio do corte o peso da madeira faz com que o ramo tombe subitamente. Esse tombo ")}<b>{i18nT("rasga a casca do tronco até ao solo")}</b>{i18nT(", criando uma ferida enorme que nunca mais fecha e apodrece o tronco da árvore.")}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-emerald-800 block">{i18nT("1. Corte de Alívio")}</span>
                    <p className="text-emerald-950">{i18nT("Por baixo do ramo, a 20-30 cm do tronco, serra 1/3 da grossura para cima. Cria o batente que trava qualquer rasgão.")}</p>
                  </div>
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-sky-800 block">{i18nT("2. Corte de Queda")}</span>
                    <p className="text-sky-950">{i18nT("Por cima do ramo, a 25-35 cm (ligeiramente mais à frente). O ramo quebra e cai livremente sem perigo para a casca.")}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-amber-800 block">{i18nT("3. Corte no Colar")}</span>
                    <p className="text-amber-950">{i18nT("Com o toco já leve, faz o corte final no bordo exterior do colar de cicatrização sem entrar no tronco.")}</p>
                  </div>
                </div>
              </div>
            </div>}

          {activeTab === "thinning" && <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              {is3D ? <Monda3DViewer diagramType="root_thinning" name="Desbaste de Sementeira" spacingCm="5 a 10 cm" /> : null}

              <div className="bg-lime-50/70 border border-lime-200 rounded-2xl p-4 space-y-2">
                <h5 className="font-bold text-lime-900 text-sm flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-lime-700" />{i18nT("O Método Seguro de Desbaste (Tesoura vs Puxão)")}</h5>
                <p>{i18nT("Nas sementeiras de raízes de reserva (cenouras, rabanetes, nabos e beterrabas), cada plântula depende de uma raiz aprumada subterrânea microscópica.")}</p>
                <p className="font-semibold text-lime-950">
                  ✂️ <b>{i18nT("Usa uma tesourinha de pontas finas:")}</b>{i18nT(" Ao cortar o pé excedentário rente à terra, a raiz dele seca sem mover um único grão de terra ao redor da raiz da planta selecionada. Se puxares de solavanco em terra seca, arrancarás os pelos radiculares vizinhos e a cenoura bifurca em várias pernas feias!")}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-2xl">🥕</span>
                  <p className="font-bold text-stone-800">{i18nT("Cenoura")}</p>
                  <p className="text-emerald-600 font-extrabold text-sm">{i18nT("4 a 5 cm")}</p>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-2xl">🔴</span>
                  <p className="font-bold text-stone-800">{i18nT("Rabanete")}</p>
                  <p className="text-emerald-600 font-extrabold text-sm">{i18nT("3 a 4 cm")}</p>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-2xl">🟣</span>
                  <p className="font-bold text-stone-800">{i18nT("Beterraba")}</p>
                  <p className="text-emerald-600 font-extrabold text-sm">{i18nT("8 a 10 cm")}</p>
                </div>
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-center space-y-1">
                  <span className="text-2xl">🥬</span>
                  <p className="font-bold text-stone-800">{i18nT("Alface")}</p>
                  <p className="text-emerald-600 font-extrabold text-sm">{i18nT("25 a 30 cm")}</p>
                </div>
              </div>
            </div>}

          {activeTab === "suckers" && <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              {is3D ? <Monda3DViewer diagramType="solanaceae_sucker" name="Desladroamento Axilar a 45°" /> : null}

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <h5 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-emerald-700" />{i18nT("O Desladroamento Axilar em Solanáceas (Tomate/Pimento)")}</h5>
                <p>{i18nT("O 'ladrão' é um rebento vigoroso que brota exatamente na axila (o ângulo de 45° entre a haste principal e a folha).")}</p>
                <div className="space-y-1.5 pt-1">
                  <p><b>{i18nT("1. Tamanho ideal:")}</b>{i18nT(" 3 a 5 cm de comprimento. Não deixes ultrapassar os 7 cm.")}</p>
                  <p><b>{i18nT("2. Técnica do polegar:")}</b>{i18nT(" Segura a haste e empurra o ladrão lateralmente. Ele estala com um clique limpo.")}</p>
                  <p><b>{i18nT("3. Hora do dia:")}</b>{i18nT(" Meio da manhã num dia quente e com sol pleno. A luz ultravioleta e o calor secam e selam a microferida em menos de 2 horas, impedindo esporos de míldio.")}</p>
                </div>
              </div>
            </div>}
          </div>
        </div>

        {/* Rodapé com botão Fechar */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm">{i18nT("Entendido, fechar guia")}</button>
        </div>
      </div>
    </div>;
}
