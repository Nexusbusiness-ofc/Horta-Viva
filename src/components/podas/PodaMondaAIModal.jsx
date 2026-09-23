import React, { useState, useRef, useEffect } from "react";
import { 
  X, Camera, Upload, Sparkles, Scissors, Sprout, 
  AlertTriangle, CheckCircle2, AlertCircle, Calendar, 
  Wrench, ShieldCheck, BookOpen, RotateCcw, MessageCircle, 
  Send, Loader2, ArrowRight, Lightbulb, ChevronDown, ChevronUp, Eye
} from "lucide-react";
import { analyzePodaMondaWithGemini, askGeminiAboutPhoto } from "@/api/geminiClient";
import { 
  useSubscription, 
  incrementPhotoUsage, 
  incrementAIUsage,
  PLUS_PHOTO_LIMIT, 
  FREE_IDENTIFICATION_LIMIT 
} from "@/lib/subscription";
import UpgradeModal from "@/components/subscription/UpgradeModal";
import { useToast } from "@/components/ui/use-toast";

const LOADING_STEPS = [
  "A identificar espécie botânica...",
  "A inspecionar ramos, gomos e densidade...",
  "A calcular ângulos de corte e pontos de desbaste...",
  "A verificar época ideal para o clima português...",
  "A gerar instruções cirúrgicas de intervenção..."
];

export default function PodaMondaAIModal({ isOpen, onClose, onOpenUniversalGuide }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [userPreference, setUserPreference] = useState("auto"); // "poda" | "monda" | "auto"
  const [loading, setLoading] = useState(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Chat sobre a fotografia
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { toast } = useToast();
  const { isPro, isPlus, canIdentify, canUseAI, remainingPhotos } = useSubscription();

  // Ciclo das mensagens animadas de carregamento
  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStepIndex(0);
      interval = setInterval(() => {
        setLoadingStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setChatMessages([]);
    setChatOpen(false);
  };

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setResult(null);
    setChatMessages([]);
    setChatOpen(false);
    setUserPreference("auto");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!image) return;

    if (!canIdentify) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzePodaMondaWithGemini(image, userPreference);
      setResult(data);

      if (!isPro) {
        const updatedCount = incrementPhotoUsage();
        if (isPlus) {
          toast({
            title: `Análise IA concluída (${updatedCount} de ${PLUS_PHOTO_LIMIT} fotos este mês)`,
            description: updatedCount >= PLUS_PHOTO_LIMIT
              ? "Atingiste o limite mensal do Plano Plus. Podes atualizar para Pro para fotos ilimitadas!"
              : `Ainda tens ${Math.max(0, PLUS_PHOTO_LIMIT - updatedCount)} análise(s) com IA este mês.`,
          });
        } else {
          toast({
            title: `Análise IA concluída (${updatedCount} de ${FREE_IDENTIFICATION_LIMIT} fotos gratuitas)`,
            description: updatedCount >= FREE_IDENTIFICATION_LIMIT
              ? "Aproveitaste os 2 usos gratuitos! Atualiza para Plus ou Pro para continuar a analisar com IA."
              : `Ainda tens ${Math.max(0, FREE_IDENTIFICATION_LIMIT - updatedCount)} análise gratuita restante.`,
          });
        }
      }
    } catch (err) {
      console.error("Erro ao analisar foto de poda/monda:", err);
      toast({
        variant: "destructive",
        title: "Não foi possível analisar a fotografia",
        description: String(err?.message || "Tenta aproximar a foto dos ramos ou folhas e tirar com boa luz."),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendChatMessage = async (presetText = null) => {
    const textToSend = (presetText || chatInput).trim();
    if (!textToSend || !image || chatLoading) return;

    if (!canUseAI && !isPro) {
      setShowUpgradeModal(true);
      return;
    }

    setChatMessages((prev) => [...prev, { role: "user", text: textToSend }]);
    if (!presetText) setChatInput("");
    setChatLoading(true);

    try {
      const systemPrompt = `És um Engenheiro Agrónomo e Mestre Podador da Horta Viva.
O utilizador tirou uma fotografia aos ramos/frutos da sua árvore ou sementeira.
DIAGNÓSTICO INICIAL:
- Espécie: ${result?.plant_name || "Desconhecida"} (${result?.scientific_name || ""})
- Operação: ${result?.operation_type?.toUpperCase()} (${result?.operation_subtype || ""})
- Diagnóstico Visual: ${result?.visual_assessment || ""}
- Época & Urgência: ${result?.urgency || ""} - ${result?.season_timing_advice || ""}

Responde à pergunta do utilizador em português de Portugal, de forma extremamente prática, direta e segura para a árvore ou cultura, baseando-te nos pormenores visíveis nesta foto.
Pergunta: ${textToSend}`;

      const reply = await askGeminiAboutPhoto(image, systemPrompt);
      setChatMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      if (!isPro) incrementAIUsage();
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Desculpa, não foi possível responder agora: ${String(err?.message || err)}` }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const getUrgencyConfig = (urgency) => {
    switch (urgency) {
      case "ideal_agora":
        return {
          bg: "bg-emerald-50 border-emerald-300 text-emerald-800",
          badgeBg: "bg-emerald-600 text-white",
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          label: "Época Ideal para Intervir"
        };
      case "pode_esperar":
        return {
          bg: "bg-amber-50 border-amber-300 text-amber-800",
          badgeBg: "bg-amber-600 text-white",
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          label: "Pode Aguardar / Opcional"
        };
      case "atencao_epoca_errada":
      default:
        return {
          bg: "bg-rose-50 border-rose-300 text-rose-800",
          badgeBg: "bg-rose-600 text-white",
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
          label: "Atenção: Fora de Época Recomendada"
        };
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-3xl sm:rounded-3xl rounded-t-3xl max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl flex flex-col transition-all"
        style={{ WebkitOverflowScrolling: "touch" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-200">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-stone-800 flex items-center gap-2">
                Analisador IA de Podas & Mondas
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Visão IA
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Fotografa ramos ou sementeiras e descobre onde e como intervir
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* SECÇÃO 1: FOTOGRAFIA & ESCOLHA */}
          {!result && (
            <div className="space-y-5">
              {/* Caixa de Entrada de Imagem */}
              {!preview ? (
                <div className="border-2 border-dashed border-emerald-300/80 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 rounded-3xl p-6 sm:p-8 text-center transition-all hover:border-emerald-400">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-stone-800 mb-1">
                    Fotografa a planta, árvore ou cacho de frutos
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-6 leading-relaxed">
                    Tira uma foto nítida aos ramos que pretendes podar, aos chupões/ladrões, ou aos frutos/flores que queres desbastar.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto">
                    {/* Botão Câmara */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-200/50 transition-transform active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Tirar Foto</span>
                    </button>
                    {/* Botão Galeria */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 text-stone-700 font-bold text-sm shadow-sm transition-transform active:scale-95"
                    >
                      <Upload className="w-4 h-4 text-emerald-600" />
                      <span>Escolher da Galeria</span>
                    </button>
                  </div>

                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-stone-400">
                    <span>💡 Dica: Mostra a inserção do ramo no tronco</span>
                    <span>•</span>
                    <span>Boa luz solar</span>
                  </div>
                </div>
              ) : (
                /* Pré-visualização da Imagem Carregada */
                <div className="space-y-5">
                  <div className="relative rounded-3xl overflow-hidden border border-emerald-200 bg-stone-900 shadow-lg max-h-80 flex items-center justify-center group">
                    <img 
                      src={preview} 
                      alt="Fotografia de poda ou monda" 
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
                    
                    <button
                      onClick={handleReset}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-all"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Trocar Foto</span>
                    </button>

                    <div className="absolute bottom-3 left-4 text-white text-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Foto pronta para diagnóstico botânico</span>
                    </div>
                  </div>

                  {/* PERGUNTA INTERATIVA AO UTILIZADOR: Poda ou Monda? */}
                  <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-white border border-emerald-200/80 rounded-3xl p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-stone-800">
                      <span className="text-xl">🤔</span>
                      <div>
                        <h4 className="font-extrabold text-sm sm:text-base text-stone-800">
                          O que estás a planear fazer nesta planta?
                        </h4>
                        <p className="text-xs text-stone-500">
                          Seleciona a tua intenção ou deixa a IA diagnosticar automaticamente pela foto:
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {/* Opção Poda */}
                      <button
                        type="button"
                        onClick={() => setUserPreference("poda")}
                        className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                          userPreference === "poda"
                            ? "border-emerald-600 bg-emerald-500/10 shadow-sm"
                            : "border-stone-200 bg-white hover:border-emerald-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xl">✂️</span>
                          {userPreference === "poda" && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-stone-800">
                            Estou a fazer Poda
                          </div>
                          <div className="text-[11px] text-stone-500 leading-snug mt-0.5">
                            Ramos ladrões, arejamento de copa, ramos secos ou formação.
                          </div>
                        </div>
                      </button>

                      {/* Opção Monda */}
                      <button
                        type="button"
                        onClick={() => setUserPreference("monda")}
                        className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                          userPreference === "monda"
                            ? "border-lime-600 bg-lime-500/10 shadow-sm"
                            : "border-stone-200 bg-white hover:border-lime-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xl">🌱</span>
                          {userPreference === "monda" && (
                            <CheckCircle2 className="w-4 h-4 text-lime-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-stone-800">
                            Estou a fazer Monda
                          </div>
                          <div className="text-[11px] text-stone-500 leading-snug mt-0.5">
                            Desbaste de frutos em excesso, flores ou plântulas de sementeira.
                          </div>
                        </div>
                      </button>

                      {/* Opção Auto / Dúvida */}
                      <button
                        type="button"
                        onClick={() => setUserPreference("auto")}
                        className={`p-3.5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                          userPreference === "auto"
                            ? "border-teal-600 bg-teal-500/10 shadow-sm"
                            : "border-stone-200 bg-white hover:border-teal-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xl">🤖</span>
                          {userPreference === "auto" && (
                            <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-xs sm:text-sm text-stone-800">
                            A IA decide por mim
                          </div>
                          <div className="text-[11px] text-stone-500 leading-snug mt-0.5">
                            Não tenho a certeza, quero que a IA determine o que a planta precisa.
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Botão de Análise */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-200 transition-all active:scale-[0.98]"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>A analisar com Inteligência Artificial...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Analisar Foto &amp; Obter Guia de Corte</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ESTADO DE CARREGAMENTO ANIMADO */}
          {loading && (
            <div className="py-12 px-4 text-center space-y-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping opacity-25" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                  <Scissors className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-stone-800">
                  Diagnóstico Agronómico em Curso
                </h4>
                <p className="text-xs sm:text-sm text-emerald-700 font-medium h-6 mt-1 transition-all">
                  {LOADING_STEPS[loadingStepIndex]}
                </p>
              </div>

              <div className="w-48 h-1.5 bg-stone-100 rounded-full mx-auto overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-2/3 animate-pulse" />
              </div>
            </div>
          )}

          {/* SECÇÃO 2: RESULTADO DETALHADO DO DIAGNÓSTICO */}
          {result && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Barra superior de Resumo com Miniatura e Ação de Nova Foto */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-600 to-green-700 text-white shadow-lg shadow-emerald-200/60">
                <div className="flex items-center gap-3.5">
                  {preview && (
                    <img 
                      src={preview} 
                      alt="Thumbnail" 
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-white/50 shadow-md shrink-0" 
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-base sm:text-lg leading-tight">
                        {result.plant_name}
                      </span>
                      {result.scientific_name && (
                        <span className="text-xs text-emerald-100 italic">
                          ({result.scientific_name})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs flex items-center gap-1">
                        {result.operation_type === "poda" ? "✂️ PODA" : "🌱 MONDA"}
                      </span>
                      <span className="text-xs text-emerald-100 font-medium">
                        {result.operation_subtype}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Nova Análise</span>
                </button>
              </div>

              {/* Banner de Validação da Escolha do Utilizador */}
              {result.user_preference_match && (
                <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-2.5 text-xs text-teal-900 leading-relaxed">
                  <span className="text-base shrink-0">💡</span>
                  <div>
                    <span className="font-bold block text-teal-800">Validação da tua escolha:</span>
                    {result.user_preference_match}
                  </div>
                </div>
              )}

              {/* CARD DE URGÊNCIA & ÉPOCA ADEQUADA */}
              {(() => {
                const urgencyCfg = getUrgencyConfig(result.urgency);
                return (
                  <div className={`p-4 rounded-3xl border ${urgencyCfg.bg} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs`}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">{urgencyCfg.icon}</div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-xs sm:text-sm">
                            {urgencyCfg.label}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5 leading-relaxed font-normal">
                          {result.season_timing_advice}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 self-start sm:self-auto ${urgencyCfg.badgeBg}`}>
                      {result.urgency === "ideal_agora" ? "Intervir Agora" : result.urgency === "pode_esperar" ? "Aguardar Época" : "Risco de Poda"}
                    </span>
                  </div>
                );
              })()}

              {/* DIAGNÓSTICO VISUAL DA FOTOGRAFIA */}
              <div className="bg-stone-50/80 border border-stone-200 rounded-3xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-stone-800 font-extrabold text-sm sm:text-base">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>O que a IA observou nesta fotografia</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {result.visual_assessment}
                </p>
              </div>

              {/* AS DUAS SECÇÕES PRINCIPAIS: O QUE FAZER & COMO FAZER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. O QUE DEVES FAZER (Checklist de Prioridades) */}
                <div className="bg-white border-2 border-emerald-100 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm sm:text-base mb-2">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                        1
                      </span>
                      <span>O Que Deves Fazer (Ações)</span>
                    </div>
                    <p className="text-xs text-stone-500 mb-3">
                      Intervenções cirúrgicas prioritárias recomendadas para esta planta:
                    </p>

                    <div className="space-y-2.5">
                      {result.what_to_do?.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/60">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-emerald-700 font-medium">
                    ✓ Segue esta ordem para não enfraquecer a planta.
                  </div>
                </div>

                {/* 2. COMO FAZER (Passo a Passo Prático) */}
                <div className="bg-white border-2 border-teal-100 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-teal-800 font-extrabold text-sm sm:text-base mb-2">
                      <span className="w-7 h-7 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-black">
                        2
                      </span>
                      <span>Como Fazer Passo a Passo</span>
                    </div>
                    <p className="text-xs text-stone-500 mb-3">
                      Técnica de execução adaptada à posição e estrutura visível:
                    </p>

                    <div className="space-y-2.5">
                      {result.how_to_do?.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed bg-teal-50/40 p-2.5 rounded-xl border border-teal-100/60">
                          <span className="w-5 h-5 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-teal-700 font-medium">
                    ✓ Mantém firmeza no corte sem rasgar a casca.
                  </div>
                </div>
              </div>

              {/* ESPECIFICAÇÕES TÉCNICAS: FERRAMENTAS, ÂNGULO E CICATRIZAÇÃO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Ferramentas */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-700 font-bold text-xs uppercase tracking-wider">
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <span>Ferramentas</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {result.tools_needed}
                  </p>
                </div>

                {/* Ângulo de Corte */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-700 font-bold text-xs uppercase tracking-wider">
                    <Scissors className="w-4 h-4 text-teal-600" />
                    <span>Ângulo &amp; Bisel</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {result.cut_technique}
                  </p>
                </div>

                {/* Cicatrização & Higiene */}
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-stone-700 font-bold text-xs uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Higiene &amp; Cura</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {result.cautions_and_healing}
                  </p>
                </div>
              </div>

              {/* DICA DE OURO DO MESTRE PODADOR */}
              {result.pro_tip && (
                <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-300/80 rounded-3xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-amber-900">
                      Dica de Ouro do Mestre Podador:
                    </h5>
                    <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                      {result.pro_tip}
                    </p>
                  </div>
                </div>
              )}

              {/* BOTÃO PARA ABRIR O GUIA UNIVERSAL DE ESQUEMAS 3D */}
              {onOpenUniversalGuide && (
                <div className="p-4 rounded-3xl bg-gradient-to-r from-stone-900 to-stone-800 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
                      📐
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm">
                        Queres ver o corte em bisel e a regra dos 3 cortes em 3D?
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        Abre o nosso simulador 3D interativo com diagramas anatómicos.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenUniversalGuide}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shrink-0"
                  >
                    <span>Ver Esquemas 3D</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* SECÇÃO DE CHAT / PERGUNTAS SOBRE A FOTO */}
              <div className="border border-stone-200 rounded-3xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setChatOpen(!chatOpen)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-stone-800">
                        Tens dúvidas sobre um ramo específico desta foto?
                      </h5>
                      <p className="text-[11px] text-stone-500">
                        Conversa diretamente com a IA sobre esta imagem
                      </p>
                    </div>
                  </div>
                  {chatOpen ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                </button>

                {chatOpen && (
                  <div className="p-4 border-t border-stone-100 bg-stone-50/50 space-y-3">
                    {/* Sugestões de perguntas rápidas */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Onde faço exatamente o primeiro corte?",
                        "Posso podar se estiver previsto chover?",
                        "Como reconheço o anel cicatricial?",
                        "Quantos frutos devo deixar por ramo?"
                      ].map((prompt, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSendChatMessage(prompt)}
                          className="text-[11px] bg-white border border-stone-200 hover:border-emerald-300 text-stone-600 px-2.5 py-1 rounded-full transition-all"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>

                    {/* Histórico da Conversa */}
                    {chatMessages.length > 0 && (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {chatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                              msg.role === "user"
                                ? "ml-auto bg-emerald-600 text-white"
                                : "bg-white border border-stone-200 text-stone-800 shadow-2xs"
                            }`}
                          >
                            {msg.text}
                          </div>
                        ))}
                        {chatLoading && (
                          <div className="bg-white border border-stone-200 p-3 rounded-2xl text-xs text-stone-500 flex items-center gap-2 max-w-[85%]">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                            <span>A formular resposta técnica...</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Caixa de Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                        placeholder="Pergunta sobre um ramo, ângulo ou época..."
                        className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-300"
                        disabled={chatLoading}
                      />
                      <button
                        type="button"
                        onClick={() => handleSendChatMessage()}
                        disabled={chatLoading || !chatInput.trim()}
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="photos"
      />
    </div>
  );
}
