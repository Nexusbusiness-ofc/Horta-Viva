import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Camera, Loader2, Sparkles, Sun, Droplets, Sprout, 
  Bug, Calendar, Leaf, RotateCcw, X, BookOpen, Search
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { findPlantInCatalog } from "@/lib/aiService";
import { visionBase44 } from "@/api/visionClient";
import { DEFAULT_PLANTS } from "@/lib/plantsData";

const SCHEMA = {
  type: "object",
  properties: {
    identified: { type: "boolean" },
    name: { type: "string" },
    scientific_name: { type: "string" },
    category: { type: "string" },
    confidence: { type: "string", enum: ["alta", "média", "baixa"] },
    description: { type: "string" },
    sun: { type: "string" },
    water: { type: "string" },
    soil: { type: "string" },
    when_to_plant: { type: "string" },
    when_to_harvest: { type: "string" },
    common_pests: { type: "string" },
    tips: { type: "string" },
  },
  required: ["identified", "name"],
};

const PLANT_IDENTIFICATION_PROMPT = `Analisa cuidadosamente a fotografia e identifica a planta, árvore, flor, folha, fruto, legume, erva aromática, praga ou doença vegetal que estiver presente. Não limites a identificação a uma lista ou catálogo: identifica qualquer espécie que reconheças. Responde em português de Portugal e devolve apenas os dados pedidos. Se não houver uma planta ou praga suficientemente visível, define "identified" como false e "name" como "Não identificado". Caso identifiques, indica o nome comum, nome científico, categoria, confiança, descrição breve, exposição solar, necessidades de rega, solo, época de plantação e de colheita em Portugal, pragas/doenças comuns e dicas práticas de cultivo ou tratamento.`;

function combineWithCatalog(aiResult) {
  const catalogResult = findPlantInCatalog(aiResult.name);
  if (!catalogResult) return aiResult;

  // Quando a espécie existe no catálogo, os cuidados apresentados são os que
  // já foram definidos para a Horta Viva; a identificação científica da IA é preservada.
  return {
    ...aiResult,
    name: catalogResult.name,
    category: catalogResult.category || aiResult.category,
    description: catalogResult.description || aiResult.description,
    sun: catalogResult.sun || aiResult.sun,
    water: catalogResult.water || aiResult.water,
    soil: catalogResult.soil || aiResult.soil,
    when_to_plant: catalogResult.when_to_plant || aiResult.when_to_plant,
    when_to_harvest: catalogResult.when_to_harvest || aiResult.when_to_harvest,
    common_pests: catalogResult.common_pests || aiResult.common_pests,
    tips: catalogResult.tips || aiResult.tips,
  };
}

export default function IdentificarPlanta() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogQuery, setCatalogQuery] = useState("");
  const fileRef = useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const identify = async () => {
    if (!image) return;

    setLoading(true);
    setResult(null);
    try {
      const { file_url } = await visionBase44.integrations.Core.UploadFile({ file: image });
      const aiResult = await visionBase44.integrations.Core.InvokeLLM({
        prompt: PLANT_IDENTIFICATION_PROMPT,
        model: "gemini_3_flash",
        file_urls: [file_url],
        response_json_schema: SCHEMA,
      });
      setResult(combineWithCatalog(aiResult));
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Não foi possível identificar a planta com a IA",
        description: String(err?.message || err),
      });
    } finally {
      setLoading(false);
    }
  };

  const selectCatalogPlant = (plant) => {
    const identifiedResult = findPlantInCatalog(plant.name);
    if (identifiedResult) {
      setResult(identifiedResult);
      setShowCatalogModal(false);
      toast({
        title: `${plant.name} selecionada!`,
        description: "Ficha botânica e guia de cultivo carregados.",
      });
    }
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const confidenceColor = (c) =>
    c === "alta" ? "bg-green-100 text-green-700 border border-green-200" :
    c === "média" ? "bg-amber-100 text-amber-700 border border-amber-200" :
    "bg-red-100 text-red-700 border border-red-200";

  const filteredCatalog = DEFAULT_PLANTS.filter(p =>
    !catalogQuery.trim() ||
    p.name.toLowerCase().includes(catalogQuery.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(catalogQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-cyan-50 via-teal-50/40 to-emerald-50/50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-cyan-50/60 to-white/90 backdrop-blur-lg border-b border-cyan-100/60">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-cyan-600 hover:border-cyan-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-300/50">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-stone-800 leading-none truncate">Identificar Planta</h1>
              <p className="text-xs text-stone-500 truncate">Reconhecimento por IA e catálogo botânico</p>
            </div>
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
              title="Identificação avançada por IA"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">IA de plantas</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        {/* Upload / captura */}
        {!preview && (
          <label className="block cursor-pointer">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFile}
              className="hidden"
            />
            <div className="bg-white rounded-3xl border-2 border-dashed border-cyan-200 hover:border-cyan-400 transition-colors py-14 px-6 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Camera className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-lg font-bold text-stone-800 mb-1">Tira ou carrega uma foto</h2>
              <p className="text-sm text-stone-500 mb-4 max-w-md mx-auto">
                Fotografa uma planta, folha, flor, fruto ou legume. A IA analisa a espécie e abre a ficha de cultivo mais adequada.
              </p>
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-600 to-teal-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md shadow-teal-200/50 hover:shadow-lg transition-all active:scale-95">
                <Camera className="w-5 h-5" /> Abrir câmara ou galeria
              </span>
            </div>
          </label>
        )}

        {/* Pré-visualização + ação */}
        {preview && (
          <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm">
            <div className="relative">
              <img src={preview} alt="Pré-visualização" className="w-full max-h-80 object-cover" />
              <button
                onClick={reset}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors shadow-md"
                aria-label="Remover foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={identify}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-600 to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-200/50 hover:shadow-xl transition-all disabled:opacity-60 active:scale-[0.98]"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> A analisar a espécie com IA...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Identificar planta</>
                )}
              </button>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCatalogModal(true)}
                  className="text-xs text-stone-600 hover:text-teal-700 flex items-center gap-1.5 font-medium py-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                  Ou escolher do Catálogo Botânico da Horta
                </button>
                <span className="text-[11px] text-stone-400 font-medium py-1">IA avançada</span>
              </div>

              {loading && (
                <p className="text-xs text-stone-400 text-center animate-pulse">
                  A analisar a fotografia, folhas, flores e características da espécie…
                </p>
              )}
            </div>
          </div>
        )}

        {/* Resultado */}
        {result && (
          <ResultCard 
            result={result} 
            preview={preview} 
            confidenceColor={confidenceColor} 
            onReset={reset}
            onChooseCatalog={() => setShowCatalogModal(true)}
            onAddToFarm={() => navigate("/minha-quinta")}
          />
        )}

        {!result && !loading && !preview && (
          <div className="space-y-4">
            <div className="bg-white/70 rounded-2xl border border-stone-200/70 p-4">
              <h3 className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-teal-600" /> O que podes identificar:
              </h3>
              <ul className="text-xs text-stone-600 space-y-2">
                <li className="flex items-center gap-2">🌱 <span><strong>Hortícolas e Legumes:</strong> Tomate, alface, fava, cenoura, couves, etc.</span></li>
                <li className="flex items-center gap-2">🌳 <span><strong>Árvores e Pomares:</strong> Macieira, pereira, oliveira, citrinos, vinha.</span></li>
                <li className="flex items-center gap-2">🌿 <span><strong>Ervas Aromáticas:</strong> Alecrim, salsa, coentros, hortelã, tomilho.</span></li>
                <li className="flex items-center gap-2">🐛 <span><strong>Pragas e Doenças:</strong> Míldio, oídio, pulgões, lagartas e deficiências.</span></li>
                <li className="flex items-center gap-2">🍄 <span><strong>Cogumelos:</strong> Boletus, sanchas, tortulhos (com aviso de segurança).</span></li>
              </ul>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-stone-800">Catálogo Botânico da Horta</p>
                <p className="text-[11px] text-stone-500">Mais de 50 espécies com fichas completas de sementeira e colheita</p>
              </div>
              <button
                onClick={() => setShowCatalogModal(true)}
                className="shrink-0 text-xs font-semibold bg-white text-teal-800 border border-teal-200 px-3.5 py-2 rounded-xl hover:bg-teal-50 transition-colors shadow-sm"
              >
                Ver Catálogo
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal do Catálogo Botânico */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-100 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-stone-800 text-sm">Catálogo de Espécies da Horta</h3>
              </div>
              <button 
                onClick={() => setShowCatalogModal(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 border-b border-stone-100">
              <div className="flex items-center gap-2 bg-stone-100 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={catalogQuery}
                  onChange={(e) => setCatalogQuery(e.target.value)}
                  placeholder="Filtrar por nome ou categoria..."
                  className="bg-transparent text-xs w-full outline-none text-stone-700"
                />
              </div>
            </div>

            <div className="p-3 overflow-y-auto space-y-2 flex-1">
              {filteredCatalog.map(p => (
                <button
                  key={p.id}
                  onClick={() => selectCatalogPlant(p)}
                  className="w-full text-left flex items-center gap-3 p-2.5 rounded-2xl hover:bg-teal-50/60 border border-transparent hover:border-teal-200 transition-all"
                >
                  <span className="text-2xl">{p.emoji || "🌱"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-stone-800 text-xs truncate">{p.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{p.category} · {p.sun_requirements || "Sol pleno"} · Rega {p.water_requirements || "Moderada"}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200/60">
                    Ver ficha
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="text-center py-6 text-xs">
        <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent font-medium">
          🌱 Horta Viva — Cultiva com sabedoria
        </span>
      </footer>
    </div>
  );
}

function ResultCard({ result, preview, confidenceColor, onReset, onChooseCatalog, onAddToFarm }) {
  const r = result;

  if (r.identified === false) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm">
        {preview && <img src={preview} alt="" className="w-full max-h-48 object-cover" />}
        <div className="p-6 text-center">
          <div className="text-4xl mb-2">🤔</div>
          <h2 className="text-lg font-bold text-stone-800 mb-1">Não consegui identificar</h2>
          <p className="text-sm text-stone-500 mb-4 max-w-sm mx-auto">
            A IA não conseguiu reconhecer esta planta com confiança. Tenta outra imagem, com boa luz e a folha, flor ou fruto bem focado, ou escolhe a planta no catálogo.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button onClick={onReset} className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" /> Tentar outra foto
            </button>
            <button onClick={onChooseCatalog} className="inline-flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
              <BookOpen className="w-4 h-4" /> Escolher no catálogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm space-y-4 animate-in fade-in duration-300">
      {/* Cabeçalho */}
      <div className="p-5 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 border-b border-teal-100/60">
        <div className="flex items-start gap-4">
          {preview && (
            <img src={preview} alt="" className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-stone-200 shadow-sm" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-stone-800 leading-tight">{r.name || "—"}</h2>
              {r.confidence && (
                <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${confidenceColor(r.confidence)}`}>
                  confiança {r.confidence}
                </span>
              )}
            </div>
            {r.scientific_name && (
              <p className="text-xs italic text-teal-800 font-medium mt-0.5">{r.scientific_name}</p>
            )}
            {r.category && (
              <span className="inline-block mt-2 text-xs font-semibold bg-white text-teal-700 border border-teal-200 rounded-full px-3 py-0.5 shadow-2xs">
                {r.category}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-4">
        {r.description && (
          <p className="text-sm text-stone-600 leading-relaxed bg-stone-50/70 p-3.5 rounded-2xl border border-stone-100">
            {r.description}
          </p>
        )}

        {/* Cuidados */}
        {(r.sun || r.water || r.soil) && (
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {r.sun && <InfoTile icon={<Sun className="w-4 h-4" />} color="#f59e0b" label="Sol" value={r.sun} />}
            {r.water && <InfoTile icon={<Droplets className="w-4 h-4" />} color="#0ea5e9" label="Rega" value={r.water} />}
            {r.soil && <InfoTile icon={<Sprout className="w-4 h-4" />} color="#16a34a" label="Solo" value={r.soil} />}
          </div>
        )}

        {/* Épocas */}
        {(r.when_to_plant || r.when_to_harvest) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {r.when_to_plant && <InfoRow icon={<Calendar className="w-4 h-4" />} color="#16a34a" label="Quando plantar" value={r.when_to_plant} />}
            {r.when_to_harvest && <InfoRow icon={<Calendar className="w-4 h-4" />} color="#ea580c" label="Quando colher" value={r.when_to_harvest} />}
          </div>
        )}

        {/* Pragas */}
        {r.common_pests && (
          <InfoBlock icon={<Bug className="w-4 h-4" />} color="#dc2626" label="Pragas e doenças comuns" value={r.common_pests} />
        )}

        {/* Dicas */}
        {r.tips && (
          <InfoBlock icon={<Sparkles className="w-4 h-4" />} color="#7c3aed" label="Dicas de cultivo" value={r.tips} />
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button 
            onClick={onReset} 
            className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Identificar outra foto
          </button>
          <button 
            onClick={onAddToFarm}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-bold py-3 rounded-xl shadow-md shadow-emerald-200/50 transition-all"
          >
            <Sprout className="w-4 h-4" /> Adicionar à Minha Quinta
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoTile({ icon, color, label, value }) {
  return (
    <div className="bg-stone-50 rounded-2xl p-3 text-center border border-stone-100">
      <div className="flex items-center justify-center mb-1" style={{ color }}>{icon}</div>
      <p className="text-[10px] text-stone-400 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-xs font-bold text-stone-700 mt-0.5 line-clamp-2">{value}</p>
    </div>
  );
}

function InfoRow({ icon, color, label, value }) {
  return (
    <div className="bg-stone-50 rounded-2xl p-3.5 flex items-start gap-3 border border-stone-100">
      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs" style={{ backgroundColor: color + "15", color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-xs font-medium text-stone-700 mt-0.5 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

function InfoBlock({ icon, color, label, value }) {
  return (
    <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-100 space-y-1">
      <div className="flex items-center gap-2">
        <div style={{ color }}>{icon}</div>
        <p className="text-xs font-bold text-stone-700">{label}</p>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed">{value}</p>
    </div>
  );
}
