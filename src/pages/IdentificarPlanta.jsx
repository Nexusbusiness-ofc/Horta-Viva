import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, Sparkles, Sun, Droplets, Sprout, Bug, Calendar, Leaf, RotateCcw, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
    tips: { type: "string" }
  }
};

const PROMPT = `Analisa a imagem fornecida e identifica a planta, hortícola, árvore frutífera, erva aromática, ou eventual praga/doença vegetal presente. Responde sempre em português de Portugal. Se a imagem não contiver nenhuma planta ou praga reconhecível, define "identified" como false e "name" como "Não identificado". Caso identifiques, fornece: nome comum, nome científico, categoria (ex: hortícola, fruta, erva aromática, árvore, praga, doença), nível de confiança, descrição breve, requisitos de sol (Sol pleno / Sol parcial / Sombra), rega (Pouca / Moderada / Abundante) e tipo de solo, época de plantação e época de colheita (adaptado a Portugal, referindo meses), pragas e doenças comuns, e dicas práticas de cultivo ou tratamento.`;

export default function IdentificarPlanta() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);
  const { toast } = useToast();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const identify = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: image });
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: PROMPT,
        add_context_from_internet: true,
        model: "gemini_3_flash",
        file_urls: [file_url],
        response_json_schema: SCHEMA
      });
      setResult(res);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Não foi possível identificar",
        description: String(err?.message || err),
      });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const confidenceColor = (c) =>
    c === "alta" ? "bg-green-100 text-green-700" :
    c === "média" ? "bg-amber-100 text-amber-700" :
    "bg-red-100 text-red-700";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-cyan-50 via-teal-50/40 to-emerald-50/50">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-cyan-50/60 to-white/90 backdrop-blur-lg border-b border-cyan-100/60">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-cyan-600 hover:border-cyan-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-300/50">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-stone-800 leading-none">Identificar Planta</h1>
              <p className="text-xs text-stone-500">Tira foto e descobre o que é</p>
            </div>
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
            <div className="bg-white rounded-3xl border-2 border-dashed border-cyan-200 hover:border-cyan-400 transition-colors py-14 px-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-lg font-bold text-stone-800 mb-1">Tira uma foto</h2>
              <p className="text-sm text-stone-500 mb-3">Fotografa uma planta, hortícola, árvore ou praga para a identificarmos.</p>
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-600 to-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-md shadow-teal-200/50">
                <Camera className="w-4 h-4" /> Abrir câmara
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
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                aria-label="Remover foto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <button
                onClick={identify}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-600 to-teal-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-teal-200/50 hover:shadow-xl transition-all disabled:opacity-60 active:scale-[0.98]"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> A identificar...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Identificar planta</>
                )}
              </button>
              {loading && (
                <p className="text-xs text-stone-400 text-center mt-2">A analisar a imagem e a cruzar com a base de conhecimento...</p>
              )}
            </div>
          </div>
        )}

        {/* Resultado */}
        {result && (
          <ResultCard result={result} preview={preview} confidenceColor={confidenceColor} onReset={reset} />
        )}

        {!result && !loading && !preview && (
          <div className="bg-white/60 rounded-2xl border border-stone-200/60 p-4">
            <h3 className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
              <Leaf className="w-4 h-4 text-teal-600" /> O que podes identificar
            </h3>
            <ul className="text-xs text-stone-500 space-y-1.5">
              <li>🌱 Hortícolas e plantas de horta</li>
              <li>🌳 Árvores fruteiras e ornamentais</li>
              <li>🌿 Ervas aromáticas</li>
              <li>🐛 Pragas e doenças nas folhas</li>
              <li>🍄 Cogumelos (com cautela — confirma sempre)</li>
            </ul>
            <p className="text-[11px] text-stone-400 mt-3 leading-relaxed">
              A identificação é feita por IA e pode falhar. Para cogumelos, nunca comas sem confirmação de um especialista.
            </p>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs">
        <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent font-medium">
          🌱 Minha Horta — Cultiva com sabedoria
        </span>
      </footer>
    </div>
  );
}

function ResultCard({ result, preview, confidenceColor, onReset }) {
  const r = result;

  if (r.identified === false) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm">
        {preview && <img src={preview} alt="" className="w-full max-h-48 object-cover" />}
        <div className="p-6 text-center">
          <div className="text-4xl mb-2">🤔</div>
          <h2 className="text-lg font-bold text-stone-800 mb-1">Não consegui identificar</h2>
          <p className="text-sm text-stone-500 mb-4">Não reconheci uma planta ou praga clara nesta imagem. Tenta outra foto, com mais luz e foco no objeto.</p>
          <button onClick={onReset} className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            <RotateCcw className="w-4 h-4" /> Tentar outra foto
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm space-y-4">
      {/* Cabeçalho */}
      <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="flex items-start gap-3">
          {preview && <img src={preview} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200" />}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-stone-800">{r.name || "—"}</h2>
              {r.confidence && (
                <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${confidenceColor(r.confidence)}`}>
                  confiança {r.confidence}
                </span>
              )}
            </div>
            {r.scientific_name && r.scientific_name !== r.name && (
              <p className="text-xs italic text-stone-500 mt-0.5">{r.scientific_name}</p>
            )}
            {r.category && (
              <span className="inline-block mt-1.5 text-xs bg-white text-teal-700 border border-teal-200 rounded-full px-2.5 py-0.5">
                {r.category}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-4">
        {r.description && (
          <p className="text-sm text-stone-600 leading-relaxed">{r.description}</p>
        )}

        {/* Cuidados */}
        {(r.sun || r.water || r.soil) && (
          <div className="grid grid-cols-3 gap-2">
            {r.sun && <InfoTile icon={<Sun className="w-4 h-4" />} color="#f59e0b" label="Sol" value={r.sun} />}
            {r.water && <InfoTile icon={<Droplets className="w-4 h-4" />} color="#0ea5e9" label="Rega" value={r.water} />}
            {r.soil && <InfoTile icon={<Sprout className="w-4 h-4" />} color="#16a34a" label="Solo" value={r.soil} />}
          </div>
        )}

        {/* Épocas */}
        {(r.when_to_plant || r.when_to_harvest) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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

        <button onClick={onReset} className="w-full flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium py-2.5 rounded-xl transition-colors">
          <RotateCcw className="w-4 h-4" /> Identificar outra planta
        </button>
      </div>
    </div>
  );
}

function InfoTile({ icon, color, label, value }) {
  return (
    <div className="bg-stone-50 rounded-xl p-3 text-center">
      <div className="flex items-center justify-center mb-1" style={{ color }}>{icon}</div>
      <p className="text-[10px] text-stone-400 uppercase tracking-wide">{label}</p>
      <p className="text-xs font-semibold text-stone-700 mt-0.5">{value}</p>
    </div>
  );
}

function InfoRow({ icon, color, label, value }) {
  return (
    <div className="bg-stone-50 rounded-xl p-3 flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + "15", color }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-stone-400 uppercase tracking-wide">{label}</p>
        <p className="text-xs font-medium text-stone-700 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function InfoBlock({ icon, color, label, value }) {
  return (
    <div className="bg-stone-50 rounded-xl p-3.5">
      <div className="flex items-center gap-2 mb-1.5">
        <div style={{ color }}>{icon}</div>
        <p className="text-xs font-semibold text-stone-700">{label}</p>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed">{value}</p>
    </div>
  );
}