import { useI18n } from "@/lib/I18nContext";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Loader2, Sparkles, Sun, Droplets, Sprout, Bug, Calendar, RotateCcw, X, BookOpen, Search, CheckCircle2, AlertTriangle, ShieldCheck, Scissors, ListChecks, MessageCircle, Send, PawPrint, Heart, Stethoscope, Wheat, Home as HomeIcon, ShieldAlert, Shield } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { findPlantInCatalog } from "@/lib/aiService";
import { askGeminiAboutPhoto, identifyPlantWithGemini } from "@/api/geminiClient";
import { DEFAULT_PLANTS } from "@/lib/plantsData";
import { base44 } from "@/api/base44Client";
import { cachedList } from "@/lib/offlineCatalog";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import { useSubscription, incrementAIUsage, incrementPhotoUsage, PLUS_PHOTO_LIMIT, PRO_PHOTO_LIMIT, FREE_PHOTO_LIMIT } from "@/lib/subscription";
import UpgradeModal from "@/components/subscription/UpgradeModal";
const SCHEMA = {
  type: "object",
  properties: {
    identified: {
      type: "boolean"
    },
    subject_type: {
      type: "string",
      enum: ["planta", "animal", "nenhum"]
    },
    name: {
      type: "string"
    },
    scientific_name: {
      type: "string"
    },
    category: {
      type: "string"
    },
    confidence: {
      type: "string",
      enum: ["alta", "média", "baixa"]
    },
    description: {
      type: "string"
    },
    health_status: {
      type: "string",
      enum: ["saudavel", "alerta", "doente"]
    },
    health_assessment: {
      type: "string"
    },
    detected_diseases: {
      type: "string"
    },
    immediate_actions: {
      type: "array",
      items: {
        type: "string"
      }
    },
    // Campos botânicos
    action_water: {
      type: "string"
    },
    action_harvest: {
      type: "string"
    },
    action_treatment: {
      type: "string"
    },
    action_pruning: {
      type: "string"
    },
    sun: {
      type: "string"
    },
    water: {
      type: "string"
    },
    soil: {
      type: "string"
    },
    when_to_plant: {
      type: "string"
    },
    when_to_harvest: {
      type: "string"
    },
    common_pests: {
      type: "string"
    },
    tips: {
      type: "string"
    },
    // Campos animais
    diet: {
      type: "string"
    },
    housing_space: {
      type: "string"
    },
    farm_benefit: {
      type: "string"
    },
    behavior_tips: {
      type: "string"
    },
    common_diseases: {
      type: "string"
    },
    animal_pests: {
      type: "string"
    },
    prevention_and_care: {
      type: "string"
    },
    action_immediate: {
      type: "string"
    }
  },
  required: ["identified", "subject_type", "name", "health_status", "health_assessment"]
};
const UNIVERSAL_IDENTIFICATION_PROMPT = `És o Especialista de topo em Agronomia, Fitossanidade, Zootecnia e Veterinária da Horta Viva.
Analisa cuidadosamente a fotografia enviada e determina AUTOMATICAMENTE se o sujeito principal é uma PLANTA (cultura agrícola, legume, fruto, árvore, flor, erva aromática) ou um ANIMAL (animal de quinta, pecuária, ave de capoeira, coelho, abelha/polinizador, ou praga/parasita).
Responde na língua configurada na app estritamente no formato JSON definido pelo esquema.

1. Classificação do Sujeito:
   - "subject_type": "planta", "animal" ou "nenhum".

2. Caso o sujeito seja uma PLANTA:
   - "subject_type": "planta"
   - Identificação botânica: nome comum na região configurada, nome científico, categoria e nível de confiança ("alta" | "média" | "baixa").
   - Diagnóstico Fitossanitário:
     - "health_status": "saudavel", "alerta" ou "doente".
     - "health_assessment": Diagnóstico clínico detalhado de folhas, caules, flores ou frutos observados na imagem.
     - "detected_diseases": Doenças, pragas ativas (pulgões, lagartas, etc.), fungos (míldio, oídio) ou carências nutricionais visíveis (ou "Nenhuma doença ou praga visível").
   - Ações imediatas para o agricultor:
     - "action_water": Instrução direta sobre rega.
     - "action_harvest": Avaliação do ponto de colheita/maturação.
     - "action_treatment": Tratamento ecológico/biológico recomendado.
     - "action_pruning": Poda, desbaste ou arejamento.
     - "immediate_actions": Lista de 2 a 4 passos práticos imediatos prioritários.
   - Ficha de cultivo: "sun", "water", "soil", "when_to_plant", "when_to_harvest", "common_pests", "tips".

3. Caso o sujeito seja um ANIMAL da quinta, pecuária ou inseto/praga:
   - "subject_type": "animal"
   - Identificação zootécnica: nome comum na região configurada (ex: Galinha Pedrês/Poedeira, Cabra Serrana, Ovelha Churra, Porco Alentejano, Vaca Maronesa, Pato Mudo, Coelho Bravo/Doméstico, Abelha Melífera, etc.), raça ou nome científico, categoria zootécnica e nível de confiança.
   - Diagnóstico Clínico e Saúde Visual do Animal:
     - "health_status": "saudavel" se o animal estiver ativo, com boa postura, plumagem/pelagem uniforme e olhos vivos; "alerta" se apresentar ligeira apatia, sujidade, magreza ou suspeita; "doente" se apresentar sinais visíveis de doença, feridas, claudicação, ectoparasitas (carraças, piolho, ácaros), secreções ou diarreia.
     - "health_assessment": Parecer clínico visual do estado físico e corporal do animal observado na foto (postura, pelagem/penas, olhos, bico/focinho, aprumos e vitalidade).
     - "detected_diseases": Problemas, parasitas, lesões ou doenças identificados visualmente na foto (ou "Nenhum sinal clínico visível").
   - Características e Guia de Maneio:
     - "diet": Alimentação adequada (pastagem, feno, ração balanceada, grãos, água fresca e limpa).
     - "housing_space": Alojamento e espaço exterior ideal (abrigo arejado, cama seca de palha, cerca segura, proteção de predadores).
     - "farm_benefit": Papel e benefícios na quinta (produção de ovos/leite/carne, adubo natural/estrume rico para a horta, controlo de ervas e insetos, polinização).
     - "behavior_tips": Comportamento social, maneio e bem-estar animal.
   - Doenças e Pragas que o animal pode apresentar:
     - "common_diseases": Principais doenças comuns e graves que afetam a espécie (ex: coriza aviária, coccidiose, peste, mastite, enterotoxemia, pododermatite, sarna).
     - "animal_pests": Parasitas e pragas frequentes (ácaro vermelho, carraças, piolho das aves, pulgas, vermes internos, moscas).
     - "prevention_and_care": Protocolo de prevenção, biossegurança, desparasitação regular, vacinas essenciais e cuidados de higiene das instalações.
     - "action_immediate": Ação imediata recomendada para o criador com base no diagnóstico.
     - "immediate_actions": Lista de 2 a 4 passos práticos imediatos prioritários para o criador.

4. Se a imagem não contiver claramente nem planta nem animal:
   - "subject_type": "nenhum", "identified": false, "name": "Não identificado", "health_assessment": "Não foi possível reconhecer claramente uma planta ou animal nesta fotografia."`;
function combineWithCatalog(aiResult, farmAnimals = []) {
  if (!aiResult) return aiResult;

  // Se for planta, cruza com catálogo botânico
  if (aiResult.subject_type === "planta" || !aiResult.subject_type && !aiResult.diet) {
    const catalogResult = findPlantInCatalog(aiResult.name);
    if (!catalogResult) return {
      ...aiResult,
      subject_type: "planta"
    };
    return {
      ...aiResult,
      subject_type: "planta",
      name: catalogResult.name,
      category: catalogResult.category || aiResult.category,
      description: aiResult.description || catalogResult.description,
      sun: catalogResult.sun || aiResult.sun,
      water: catalogResult.water || aiResult.water,
      soil: catalogResult.soil || aiResult.soil,
      when_to_plant: catalogResult.when_to_plant || aiResult.when_to_plant,
      when_to_harvest: catalogResult.when_to_harvest || aiResult.when_to_harvest,
      common_pests: aiResult.common_pests || catalogResult.common_pests,
      tips: aiResult.tips || catalogResult.tips
    };
  }

  // Se for animal, cruza com base de dados de animais da quinta
  if (aiResult.subject_type === "animal") {
    const q = (aiResult.name || "").toLowerCase().trim();
    const matchedAnimal = (farmAnimals || []).find(a => a.name?.toLowerCase().includes(q) || q.includes(a.name?.toLowerCase()));
    if (matchedAnimal) {
      return {
        ...aiResult,
        farm_animal_id: matchedAnimal.id,
        category: matchedAnimal.category || aiResult.category,
        diet: aiResult.diet || matchedAnimal.feeding,
        housing_space: aiResult.housing_space || matchedAnimal.shelter,
        farm_benefit: aiResult.farm_benefit || matchedAnimal.garden_role,
        behavior_tips: aiResult.behavior_tips || matchedAnimal.fun_fact
      };
    }
  }
  return aiResult;
}
export default function IdentificarPlanta() {
  const {
    t: i18nT
  } = useI18n();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [catalogTab, setCatalogTab] = useState("plantas");
  const [catalogQuery, setCatalogQuery] = useState("");
  const [farmAnimals, setFarmAnimals] = useState([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const {
    isUltra,
    isPro,
    isPlus,
    remainingPhotos,
    canIdentify
  } = useSubscription();
  const fileRef = useRef(null);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    cachedList("farmanimals", () => base44.entities.FarmAnimal.list()).then(setFarmAnimals).catch(() => {});
  }, []);
  const handleFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };
  const identify = async () => {
    if (!image) return;
    if (!canIdentify) {
      setShowUpgradeModal(true);
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const aiResult = await identifyPlantWithGemini(image, UNIVERSAL_IDENTIFICATION_PROMPT, SCHEMA);
      setResult(combineWithCatalog(aiResult, farmAnimals));
      if (!isUltra) {
        const updatedCount = incrementPhotoUsage();
        if (isPro) {
          toast({
            title: `Identificação por IA concluída (${updatedCount} de ${PRO_PHOTO_LIMIT} fotos este mês)`,
            description: updatedCount >= PRO_PHOTO_LIMIT ? "Atingiste o teu limite de 15 fotos deste mês no Plano Pro. Para fotos infinitas, podes atualizar para o Horta Viva Ultra!" : `Ficha gerada com sucesso! Ainda tens ${Math.max(0, PRO_PHOTO_LIMIT - updatedCount)} foto(s) com IA este mês.`
          });
        } else if (isPlus) {
          toast({
            title: `Identificação por IA concluída (${updatedCount} de ${PLUS_PHOTO_LIMIT} fotos este mês)`,
            description: updatedCount >= PLUS_PHOTO_LIMIT ? "Atingiste o teu limite de 10 fotos deste mês no Plano Plus. Para mais fotos, podes atualizar para o Horta Viva Pro ou Ultra!" : `Ficha gerada com sucesso! Ainda tens ${Math.max(0, PLUS_PHOTO_LIMIT - updatedCount)} foto(s) com IA este mês.`
          });
        } else {
          toast({
            title: `Identificação por IA concluída (${updatedCount} de ${FREE_PHOTO_LIMIT} fotos gratuitas este mês)`,
            description: updatedCount >= FREE_PHOTO_LIMIT ? "Atingiste as tuas 3 fotos gratuitas deste mês! Escolhe o Plano Plus (1,99€), Pro (2,99€) ou Ultra (3,99€) para continuares." : `Ficha gerada com sucesso! Ainda tens ${Math.max(0, FREE_PHOTO_LIMIT - updatedCount)} foto(s) gratuita(s) este mês.`
          });
        }
      } else {
        toast({
          title: "Identificação por IA concluída ⭐",
          description: "Ficha gerada com sucesso com o Plano Ultra (fotos infinitas)."
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Não foi possível identificar com a IA",
        description: String(err?.message || err)
      });
    } finally {
      setLoading(false);
    }
  };
  const selectCatalogPlant = plant => {
    const identifiedResult = findPlantInCatalog(plant.name);
    if (identifiedResult) {
      setResult({
        ...identifiedResult,
        subject_type: "planta"
      });
      setShowCatalogModal(false);
      toast({
        title: `${plant.name} selecionada!`,
        description: "Ficha botânica e guia de cultivo carregados."
      });
    }
  };
  const selectCatalogAnimal = animal => {
    setResult({
      identified: true,
      subject_type: "animal",
      name: animal.name,
      scientific_name: animal.scientific_name || animal.name,
      category: animal.category || "Animais da Quinta",
      confidence: "alta",
      description: `${animal.name} é um animal muito útil na quinta sustentável. Dificuldade de maneio: ${animal.difficulty || "Fácil"}.`,
      health_status: "saudavel",
      health_assessment: "Ficha informativa carregada a partir do catálogo oficial de animais da quinta.",
      detected_diseases: "Nenhum sinal clínico registado.",
      diet: animal.feeding || "Alimentação balanceada, pastagem e água limpa abundante.",
      housing_space: animal.shelter || "Abrigo seguro, seco e bem arejado.",
      farm_benefit: animal.garden_role || animal.products || "Produção e estrume orgânico de alta qualidade.",
      behavior_tips: animal.fun_fact || "Proporcionar enriquecimento ambiental e boa convivência em grupo.",
      common_diseases: "Doenças respiratórias, parasitoses intestinais e pododermatites.",
      animal_pests: "Ácaros, carraças, piolhos e pulgas.",
      prevention_and_care: "Desparasitação regular, vacinação adequada e desinfeção periódica do abrigo.",
      immediate_actions: ["Verificar água fresca e disponibilidade de comida limpa.", "Inspecionar a cama de palha para garantir que se mantém seca.", "Observar o comportamento e vitalidade do grupo."]
    });
    setShowCatalogModal(false);
    toast({
      title: `${animal.name} selecionado!`,
      description: "Ficha zootécnica e guia de saúde carregados."
    });
  };
  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };
  const confidenceColor = c => c === "alta" ? "bg-green-100 text-green-700 border border-green-200" : c === "média" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-red-100 text-red-700 border border-red-200";
  const filteredCatalogPlants = DEFAULT_PLANTS.filter(p => !catalogQuery.trim() || p.name.toLowerCase().includes(catalogQuery.toLowerCase()) || (p.category || "").toLowerCase().includes(catalogQuery.toLowerCase()));
  const filteredCatalogAnimals = (farmAnimals || []).filter(a => !catalogQuery.trim() || a.name.toLowerCase().includes(catalogQuery.toLowerCase()) || (a.category || "").toLowerCase().includes(catalogQuery.toLowerCase()));
  return <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-cyan-50 via-teal-50/40 to-emerald-50/50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-cyan-50/60 to-white/90 backdrop-blur-lg border-b border-cyan-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-cyan-600 hover:border-cyan-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-teal-700 flex items-center justify-center shadow-lg shadow-teal-300/50">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-stone-800 leading-none truncate">{i18nT("Identificar com IA")}</h1>
              <p className="text-xs text-stone-500 truncate">{i18nT("Plantas, culturas e animais da quinta")}</p>
            </div>
            {isUltra ? <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border bg-gradient-to-r from-purple-50 to-pink-50 text-purple-900 border-purple-300 shadow-sm" title={i18nT("Plano Ultra Ativo")}>
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{i18nT("Ultra Ilimitado")}</span>
              </span> : isPro ? <button onClick={() => setShowUpgradeModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 shadow-sm bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-900 border-amber-300 hover:shadow" title={i18nT("Plano Pro Ativo")}>
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{i18nT(remainingPhotos)}{i18nT(" de ")}{i18nT(PRO_PHOTO_LIMIT)}{i18nT(" fotos este mês")}</span>
              </button> : isPlus ? <button onClick={() => setShowUpgradeModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 shadow-sm bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-200 hover:border-emerald-300 hover:shadow" title={i18nT("Plano Plus Ativo")}>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{i18nT(remainingPhotos)}{i18nT(" de ")}{i18nT(PLUS_PHOTO_LIMIT)}{i18nT(" fotos este mês")}</span>
              </button> : <button onClick={() => setShowUpgradeModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 shadow-sm bg-gradient-to-r from-amber-50 to-teal-50 text-teal-800 border-teal-200 hover:border-amber-300 hover:shadow" title={i18nT("Ver planos")}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {remainingPhotos > 0 ? <span>{i18nT(remainingPhotos)}{i18nT(" de ")}{i18nT(FREE_PHOTO_LIMIT)} {remainingPhotos === 1 ? i18nT("foto grátis") : i18nT("fotos grátis")}</span> : <span className="font-bold text-amber-700">{i18nT("Planos (1,99€)")}</span>}
              </button>}
            <NavigationDrawer />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Banner de Limite Atingido */}
        {!isUltra && remainingPhotos === 0 && <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-teal-50 border border-amber-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600 text-lg">
                ⭐
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-800">
                    {isPro ? i18nT("Limite mensal de fotos atingido ({v0}/{v1})", {
                  v0: PRO_PHOTO_LIMIT,
                  v1: PRO_PHOTO_LIMIT
                }) : isPlus ? i18nT("Limite mensal de fotos atingido ({v0}/{v1})", {
                  v0: PLUS_PHOTO_LIMIT,
                  v1: PLUS_PHOTO_LIMIT
                }) : i18nT("Limite mensal de fotos gratuitas atingido ({v0}/{v1})", {
                  v0: FREE_PHOTO_LIMIT,
                  v1: FREE_PHOTO_LIMIT
                })}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {isPro ? i18nT("Upgrade Ultra") : isPlus ? i18nT("Upgrade Pro") : i18nT("A partir de 1,99€")}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5 max-w-md">
                  {isPro ? i18nT("Atingiste o teu limite de 15 fotos deste mês no Plano Pro. Atualiza para o Horta Viva Ultra (3,99€/mês) para identificares sem restrições!", {}) : isPlus ? i18nT("Atingiste o teu limite de 10 fotos deste mês no Plano Plus. Atualiza para o Pro (2,99€ com 15 fotos) ou Ultra (3,99€ com fotos infinitas)!", {}) : i18nT("Atingiste as 3 fotos gratuitas deste mês. Desbloqueia mais fotos no Plano Plus (1,99€), Pro (2,99€) ou Ultra (3,99€)!", {})}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button type="button" onClick={() => setShowCatalogModal(true)} className="flex-1 sm:flex-none text-xs text-stone-600 hover:text-stone-800 font-medium px-3 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-colors">{i18nT("Catálogo grátis")}</button>
              <button type="button" onClick={() => setShowUpgradeModal(true)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-200/50 transition-all active:scale-95 whitespace-nowrap">
                <Sparkles className="w-3.5 h-3.5" />
                {isPro ? i18nT("Upgrade Ultra (3,99€)") : isPlus ? i18nT("Upgrade Pro (2,99€)") : i18nT("Ver Planos (1,99€)")}
              </button>
            </div>
          </div>}

        {/* Upload / captura */}
        {!preview && <label className="block cursor-pointer">
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
            <div className="bg-white rounded-3xl border-2 border-dashed border-cyan-200 hover:border-cyan-400 transition-colors py-12 px-6 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Camera className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-lg font-bold text-stone-800 mb-1">{i18nT("Tira ou carrega uma foto")}</h2>
              <p className="text-xs sm:text-sm text-stone-500 mb-4 max-w-md mx-auto">{i18nT("Fotografa uma planta, legume, folha, fruto ")}<strong>{i18nT("OU um animal da quinta")}</strong>{i18nT(". A IA deteta automaticamente se é planta ou animal e apresenta diagnóstico, características e doenças/pragas.")}</p>
              
              {/* Badges do que a IA reconhece */}
              <div className="flex items-center justify-center gap-2 flex-wrap mb-5">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">{i18nT("🌱 Plantas & Culturas")}</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-800 border border-orange-200">{i18nT("🐾 Animais da Quinta")}</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">{i18nT("🐛 Doenças & Pragas")}</span>
              </div>

              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-600 to-teal-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-md shadow-teal-200/50 hover:shadow-lg transition-all active:scale-95">
                <Camera className="w-5 h-5" />{i18nT(" Abrir câmara ou galeria")}</span>
            </div>
          </label>}

        {/* Pré-visualização + ação */}
        {preview && <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm">
            <div className="relative">
              <img src={preview} alt={i18nT("Pré-visualização")} className="w-full max-h-80 object-cover" />
              <button onClick={reset} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors shadow-md" aria-label={i18nT("Remover foto")}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <button onClick={identify} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-teal-600 to-teal-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-200/50 hover:shadow-xl transition-all disabled:opacity-60 active:scale-[0.98]">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" />{i18nT(" A identificar com IA (Planta ou Animal)...")}</> : <><Sparkles className="w-5 h-5" />{i18nT(" Identificar Foto com IA")}</>}
              </button>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                <button type="button" onClick={() => setShowCatalogModal(true)} className="text-xs text-stone-600 hover:text-teal-700 flex items-center gap-1.5 font-medium py-1">
                  <BookOpen className="w-3.5 h-3.5 text-teal-600" />{i18nT("Ou escolher do Catálogo da Quinta")}</button>
                <span className="text-[11px] text-stone-400 font-medium py-1">{i18nT("Reconhecimento Universal")}</span>
              </div>

              {loading && <p className="text-xs text-stone-400 text-center animate-pulse">{i18nT("A analisar detalhes anatómicos, estado de saúde, características e pragas na imagem…")}</p>}
            </div>
          </div>}

        {/* Resultado */}
        {result && <UniversalResultCard result={result} image={image} preview={preview} confidenceColor={confidenceColor} onReset={reset} onChooseCatalog={() => setShowCatalogModal(true)} onAddToFarmPlanting={() => navigate("/minha-quinta")} onAddToFarmAnimal={() => navigate("/minha-quinta")} />}

        {!result && !loading && !preview && <div className="space-y-4">
            <div className="bg-white/70 rounded-2xl border border-stone-200/70 p-4">
              <h3 className="text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />{i18nT(" O que a IA reconhece automaticamente:")}</h3>
              <ul className="text-xs text-stone-600 space-y-2">
                <li className="flex items-center gap-2">🌱 <span><strong>{i18nT("Hortícolas e Legumes:")}</strong>{i18nT(" Tomate, alface, fava, cenoura, couves, batata.")}</span></li>
                <li className="flex items-center gap-2">🌳 <span><strong>{i18nT("Árvores e Pomares:")}</strong>{i18nT(" Macieira, pereira, oliveira, citrinos, vinha.")}</span></li>
                <li className="flex items-center gap-2">🐔 <span><strong>{i18nT("Animais da Quinta:")}</strong>{i18nT(" Galinhas, patos, cabras, ovelhas, porcos, coelhos, abelhas.")}</span></li>
                <li className="flex items-center gap-2">🐛 <span><strong>{i18nT("Pragas e Doenças:")}</strong>{i18nT(" Míldio, oídio, pulgões, ácaros, carraças e parasitas de animais.")}</span></li>
                <li className="flex items-center gap-2">🌿 <span><strong>{i18nT("Ervas Aromáticas & Flores:")}</strong>{i18nT(" Alecrim, salsa, coentros, hortelã, tomilho.")}</span></li>
              </ul>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/70 rounded-2xl">
              <div>
                <p className="text-xs font-bold text-stone-800">{i18nT("Catálogo Integrado da Quinta")}</p>
                <p className="text-[11px] text-stone-500">{i18nT("Consulta mais de 50 plantas e 33 espécies de animais")}</p>
              </div>
              <button onClick={() => setShowCatalogModal(true)} className="shrink-0 text-xs font-semibold bg-white text-teal-800 border border-teal-200 px-3.5 py-2 rounded-xl hover:bg-teal-50 transition-colors shadow-sm">{i18nT("Ver Catálogo")}</button>
            </div>
          </div>}
      </main>

      {/* Modal de Catálogos (Plantas e Animais) */}
      {showCatalogModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-stone-100 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-stone-800 text-sm">{i18nT("Catálogo da Quinta")}</h3>
              </div>
              <button onClick={() => setShowCatalogModal(false)} className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600">
                ✕
              </button>
            </div>

            {/* Separador de Catálogo: Plantas ou Animais */}
            <div className="flex border-b border-stone-200 bg-stone-50/50 p-2 gap-2">
              <button type="button" onClick={() => setCatalogTab("plantas")} className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${catalogTab === "plantas" ? "bg-emerald-600 text-white shadow-xs" : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300"}`}>{i18nT("🌱 Plantas & Culturas (")}{i18nT(DEFAULT_PLANTS.length)})
              </button>
              <button type="button" onClick={() => setCatalogTab("animais")} className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${catalogTab === "animais" ? "bg-orange-600 text-white shadow-xs" : "bg-white text-stone-600 border border-stone-200 hover:border-orange-300"}`}>{i18nT("🐾 Animais da Quinta (")}{farmAnimals.length || 33})
              </button>
            </div>

            <div className="p-3 border-b border-stone-100">
              <div className="flex items-center gap-2 bg-stone-100 rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-stone-400" />
                <input type="text" value={catalogQuery} onChange={e => setCatalogQuery(e.target.value)} placeholder={catalogTab === "plantas" ? i18nT("Filtrar plantas por nome...") : i18nT("Filtrar animais por nome...")} className="bg-transparent text-xs w-full outline-none text-stone-700" />
              </div>
            </div>

            <div className="p-3 overflow-y-auto space-y-2 flex-1">
              {catalogTab === "plantas" ? i18nT(filteredCatalogPlants.map(p => <button key={p.id} onClick={() => selectCatalogPlant(p)} className="w-full text-left flex items-center gap-3 p-2.5 rounded-2xl hover:bg-teal-50/60 border border-transparent hover:border-teal-200 transition-all">
                    <span className="text-2xl">{p.emoji || i18nT("🌱")}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-800 text-xs truncate">{i18nT(p.name)}</p>
                      <p className="text-[11px] text-stone-500 truncate">{i18nT(p.category)} · {p.sun_requirements || i18nT("Sol pleno")}{i18nT(" · Rega ")}{p.water_requirements || i18nT("Moderada")}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200/60">{i18nT("Ver ficha")}</span>
                  </button>)) : i18nT(filteredCatalogAnimals.map(a => <button key={a.id} onClick={() => selectCatalogAnimal(a)} className="w-full text-left flex items-center gap-3 p-2.5 rounded-2xl hover:bg-orange-50/60 border border-transparent hover:border-orange-200 transition-all">
                    <span className="text-2xl">🐾</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-800 text-xs truncate">{i18nT(a.name)}</p>
                      <p className="text-[11px] text-stone-500 truncate">{i18nT(a.category)} · {a.scientific_name || i18nT("Animal de quinta")}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200/60">{i18nT("Ver ficha")}</span>
                  </button>))}
            </div>
          </div>
        </div>}

      {/* Modal de Upgrade Pro / Pagamento */}
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} onExploreCatalog={() => setShowCatalogModal(true)} reason="photos" />

      <footer className="text-center pt-4 pb-28 text-xs">
        <span className="bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent font-medium">{i18nT("🌱 Horta Viva — Cultiva e cuida com sabedoria")}</span>
      </footer>
    </div>;
}
function UniversalResultCard({
  result,
  image,
  preview,
  confidenceColor,
  onReset,
  onChooseCatalog,
  onAddToFarmPlanting,
  onAddToFarmAnimal
}) {
  const {
    t: i18nT
  } = useI18n();
  const r = result;
  if (r.identified === false || r.subject_type === "nenhum") {
    return <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm">
        {preview && <img src={preview} alt="" className="w-full max-h-48 object-cover" />}
        <div className="p-6 text-center">
          <div className="text-4xl mb-2">🤔</div>
          <h2 className="text-lg font-bold text-stone-800 mb-1">{i18nT("Não consegui reconhecer")}</h2>
          <p className="text-sm text-stone-500 mb-4 max-w-sm mx-auto">{i18nT("A IA não detetou com clareza uma planta ou animal. Experimenta tirar outra foto com boa luz, enquadrando bem as folhas/frutos ou o animal.")}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button onClick={onReset} className="inline-flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
              <RotateCcw className="w-4 h-4" />{i18nT(" Tentar outra foto")}</button>
            <button onClick={onChooseCatalog} className="inline-flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
              <BookOpen className="w-4 h-4" />{i18nT(" Escolher no catálogo")}</button>
          </div>
          <PhotoQuestionPanel image={image} result={r} />
        </div>
      </div>;
  }

  // Se a IA reconheceu um ANIMAL
  if (r.subject_type === "animal") {
    return <AnimalResultCard result={r} image={image} preview={preview} confidenceColor={confidenceColor} onReset={onReset} onAddToFarm={onAddToFarmAnimal} />;
  }

  // Se a IA reconheceu uma PLANTA
  return <PlantResultCard result={r} image={image} preview={preview} confidenceColor={confidenceColor} onReset={onReset} onAddToFarm={onAddToFarmPlanting} />;
}

// -------------------------------------------------------------
// COMPONENTE DO RESULTADO DE ANIMAL
// -------------------------------------------------------------
function AnimalResultCard({
  result: r,
  image,
  preview,
  confidenceColor,
  onReset,
  onAddToFarm
}) {
  const {
    t: i18nT
  } = useI18n();
  const isSick = r.health_status === "doente";
  const isWarning = r.health_status === "alerta";
  return <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm space-y-4 animate-in fade-in duration-300">
      {/* Cabeçalho do Animal */}
      <div className="p-5 bg-gradient-to-br from-amber-50 via-orange-50 to-stone-50 border-b border-orange-100/60">
        <div className="flex items-start gap-4">
          {preview && <img src={preview} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-orange-200 shadow-sm" />}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl">🐾</span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-800 leading-tight">{r.name || i18nT("Animal Identificado")}</h2>
              {r.confidence && <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${confidenceColor(r.confidence)}`}>{i18nT("confiança ")}{i18nT(r.confidence)}
                </span>}
            </div>
            {r.scientific_name && <p className="text-xs sm:text-sm italic text-orange-900 font-medium mt-0.5">{i18nT(r.scientific_name)}</p>}
            {r.category && <span className="inline-block mt-2 text-xs font-semibold bg-white text-orange-800 border border-orange-200 rounded-full px-3 py-0.5 shadow-2xs">
                {i18nT(r.category)}
              </span>}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-5">
        <PhotoQuestionPanel image={image} result={r} />

        {r.description && <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50/70 p-3.5 rounded-2xl border border-stone-100">
            {i18nT(r.description)}
          </p>}

        {/* 1. DIAGNÓSTICO VETERINÁRIO & SAÚDE VISUAL */}
        <div className={`rounded-2xl border p-4 sm:p-5 space-y-3 transition-all ${isSick ? "bg-rose-50/70 border-rose-200/90" : isWarning ? "bg-amber-50/70 border-amber-200/90" : "bg-emerald-50/70 border-emerald-200/90"}`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${isSick ? "bg-rose-100 text-rose-700" : isWarning ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                {isSick ? <Bug className="w-5 h-5" /> : isWarning ? <AlertTriangle className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">{i18nT("Avaliação de Saúde & Bem-Estar")}</h3>
                <p className="text-[11px] text-stone-500">{i18nT("Diagnóstico visual de postura, pelagem/penas e vitalidade")}</p>
              </div>
            </div>

            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${isSick ? "bg-rose-100 text-rose-800 border-rose-300" : isWarning ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-100 text-emerald-800 border-emerald-300"}`}>
              {isSick ? i18nT("🚨 Suspeita de Doença / Problema") : isWarning ? i18nT("⚠️ Sinais de Alerta / Atenção") : i18nT("🐾 Animal Aparentemente Saudável")}
            </span>
          </div>

          {/* Sintomas ou doenças detetadas na foto */}
          {r.detected_diseases && <div className="bg-white/95 p-3 rounded-xl border border-stone-200/70 text-xs shadow-2xs">
              <span className="font-bold text-stone-700 block mb-0.5">{i18nT("Sinais / Parasitas Observados na Imagem:")}</span>
              <p className={`font-semibold ${isSick ? "text-rose-700" : isWarning ? "text-amber-800" : "text-emerald-700"}`}>
                {i18nT(r.detected_diseases)}
              </p>
            </div>}

          {/* Parecer detalhado da IA */}
          {r.health_assessment && <p className="text-xs text-stone-700 leading-relaxed bg-white/50 p-2.5 rounded-xl border border-stone-100/80">
              {i18nT(r.health_assessment)}
            </p>}
        </div>

        {/* 2. DOENÇAS & PRAGAS QUE O ANIMAL PODE APRESENTAR */}
        <div className="bg-gradient-to-br from-stone-50 via-rose-50/20 to-orange-50/20 rounded-2xl border border-orange-200/80 p-4 sm:p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-800">{i18nT("Doenças, Pragas & Parasitas Típicos")}</h3>
              <p className="text-[11px] text-stone-500">{i18nT("O que vigiar e como proteger esta espécie")}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {r.common_diseases && <ActionCard icon={<Stethoscope className="w-4 h-4" />} iconBg="bg-rose-100 text-rose-700 border-rose-200" title={i18nT("Principais Doenças Comuns")} content={r.common_diseases} />}
            {r.animal_pests && <ActionCard icon={<Bug className="w-4 h-4" />} iconBg="bg-amber-100 text-amber-700 border-amber-200" title={i18nT("Parasitas & Pragas Frequentes")} content={r.animal_pests} />}
          </div>

          {r.prevention_and_care && <div className="bg-white/95 p-3.5 rounded-xl border border-emerald-200 text-xs shadow-2xs space-y-1">
              <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />{i18nT(" Prevenção, Desparasitação & Biossegurança:")}</span>
              <p className="text-stone-700 leading-relaxed">{i18nT(r.prevention_and_care)}</p>
            </div>}
        </div>

        {/* 3. CARACTERÍSTICAS & GUIA DE MANEIO DO ANIMAL */}
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <PawPrint className="w-3.5 h-3.5 text-orange-600" />{i18nT(" Características & Cuidados na Quinta")}</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {r.diet && <ActionCard icon={<Wheat className="w-4 h-4" />} iconBg="bg-amber-100 text-amber-800 border-amber-200" title={i18nT("Alimentação & Água")} content={r.diet} />}
            {r.housing_space && <ActionCard icon={<HomeIcon className="w-4 h-4" />} iconBg="bg-teal-100 text-teal-800 border-teal-200" title={i18nT("Alojamento & Espaço")} content={r.housing_space} />}
            {r.farm_benefit && <ActionCard icon={<Heart className="w-4 h-4" />} iconBg="bg-emerald-100 text-emerald-800 border-emerald-200" title={i18nT("Papel & Benefício na Horta")} content={r.farm_benefit} />}
            {r.behavior_tips && <ActionCard icon={<Sparkles className="w-4 h-4" />} iconBg="bg-purple-100 text-purple-800 border-purple-200" title={i18nT("Bem-Estar & Comportamento")} content={r.behavior_tips} />}
          </div>
        </div>

        {/* 4. O QUE DEVES FAZER AGORA (CHECKLIST) */}
        {Array.isArray(r.immediate_actions) && r.immediate_actions.length > 0 && <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-orange-600" />{i18nT(" Ações Imediatas Recomendadas:")}</span>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {i18nT(r.immediate_actions.map((act, idx) => <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {i18nT(idx + 1)}
                  </span>
                  <span className="leading-snug">{i18nT(act)}</span>
                </li>))}
            </ul>
          </div>}

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-stone-100">
          <button onClick={onReset} className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold py-3 rounded-xl transition-colors">
            <RotateCcw className="w-4 h-4" />{i18nT(" Identificar outra foto")}</button>
          <button onClick={onAddToFarm} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 hover:from-orange-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold py-3 rounded-xl shadow-md shadow-orange-200/50 transition-all">
            <PawPrint className="w-4 h-4" />{i18nT(" Ver na Minha Quinta")}</button>
        </div>
      </div>
    </div>;
}

// -------------------------------------------------------------
// COMPONENTE DO RESULTADO DE PLANTA
// -------------------------------------------------------------
function PlantResultCard({
  result: r,
  image,
  preview,
  confidenceColor,
  onReset,
  onAddToFarm
}) {
  const {
    t: i18nT
  } = useI18n();
  const isSick = r.health_status === "doente";
  const isWarning = r.health_status === "alerta";
  return <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm space-y-4 animate-in fade-in duration-300">
      {/* Cabeçalho */}
      <div className="p-5 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 border-b border-teal-100/60">
        <div className="flex items-start gap-4">
          {preview && <img src={preview} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-stone-200 shadow-sm" />}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl">🌱</span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-800 leading-tight">{r.name || i18nT("—")}</h2>
              {r.confidence && <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${confidenceColor(r.confidence)}`}>{i18nT("confiança ")}{i18nT(r.confidence)}
                </span>}
            </div>
            {r.scientific_name && <p className="text-xs sm:text-sm italic text-teal-800 font-medium mt-0.5">{i18nT(r.scientific_name)}</p>}
            {r.category && <span className="inline-block mt-2 text-xs font-semibold bg-white text-teal-700 border border-teal-200 rounded-full px-3 py-0.5 shadow-2xs">
                {i18nT(r.category)}
              </span>}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-5">
        <PhotoQuestionPanel image={image} result={r} />

        {r.description && <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-stone-50/70 p-3.5 rounded-2xl border border-stone-100">
            {i18nT(r.description)}
          </p>}

        {/* 1. DIAGNÓSTICO FITOSSANITÁRIO & DOENÇAS */}
        <div className={`rounded-2xl border p-4 sm:p-5 space-y-3 transition-all ${isSick ? "bg-rose-50/70 border-rose-200/90" : isWarning ? "bg-amber-50/70 border-amber-200/90" : "bg-emerald-50/70 border-emerald-200/90"}`}>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${isSick ? "bg-rose-100 text-rose-700" : isWarning ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                {isSick ? <Bug className="w-5 h-5" /> : isWarning ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">{i18nT("Diagnóstico Fitossanitário & Saúde")}</h3>
                <p className="text-[11px] text-stone-500">{i18nT("Análise de doenças e pragas na foto")}</p>
              </div>
            </div>

            <span className={`text-xs font-extrabold px-3 py-1 rounded-full border shadow-2xs ${isSick ? "bg-rose-100 text-rose-800 border-rose-300" : isWarning ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-emerald-100 text-emerald-800 border-emerald-300"}`}>
              {isSick ? i18nT("🚨 Doença / Praga Detetada") : isWarning ? i18nT("⚠️ Sinais de Alerta / Atenção") : i18nT("🌱 Planta Saudável")}
            </span>
          </div>

          {/* Doenças detetadas */}
          {r.detected_diseases && <div className="bg-white/95 p-3 rounded-xl border border-stone-200/70 text-xs shadow-2xs">
              <span className="font-bold text-stone-700 block mb-0.5">{i18nT("Pragas / Doenças Observadas:")}</span>
              <p className={`font-semibold ${isSick ? "text-rose-700" : isWarning ? "text-amber-800" : "text-emerald-700"}`}>
                {i18nT(r.detected_diseases)}
              </p>
            </div>}

          {/* Parecer detalhado da IA */}
          {r.health_assessment && <p className="text-xs text-stone-700 leading-relaxed bg-white/50 p-2.5 rounded-xl border border-stone-100/80">
              {i18nT(r.health_assessment)}
            </p>}
        </div>

        {/* 2. O QUE DEVES FAZER À PLANTAÇÃO (PLANO DE AÇÃO IMEDIATO) */}
        <div className="bg-gradient-to-br from-stone-50 via-teal-50/20 to-emerald-50/20 rounded-2xl border border-stone-200/80 p-4 sm:p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 shadow-2xs">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-800">{i18nT("O Que Deves Fazer Agora")}</h3>
              <p className="text-[11px] text-stone-500">{i18nT("Recomendações práticas e imediatas para o cultivo")}</p>
            </div>
          </div>

          {/* Ações Imediatas Prioritárias (Checklist) */}
          {Array.isArray(r.immediate_actions) && r.immediate_actions.length > 0 && <div className="bg-white p-3.5 rounded-xl border border-teal-100/90 shadow-2xs space-y-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-800 block">{i18nT("Passos Imediatos Recomendados:")}</span>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {i18nT(r.immediate_actions.map((act, idx) => <li key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                      {i18nT(idx + 1)}
                    </span>
                    <span className="leading-snug">{i18nT(act)}</span>
                  </li>))}
              </ul>
            </div>}

          {/* Grelha de Ações: Rega, Colheita, Tratamento, Poda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {r.action_water && <ActionCard icon={<Droplets className="w-4 h-4" />} iconBg="bg-sky-100 text-sky-700 border-sky-200" title={i18nT("Rega")} content={r.action_water} />}
            {r.action_harvest && <ActionCard icon={<Sprout className="w-4 h-4" />} iconBg="bg-amber-100 text-amber-700 border-amber-200" title={i18nT("Colheita")} content={r.action_harvest} />}
            {r.action_treatment && <ActionCard icon={<ShieldCheck className="w-4 h-4" />} iconBg="bg-emerald-100 text-emerald-700 border-emerald-200" title={i18nT("Tratamento Biológico & Pragas")} content={r.action_treatment} />}
            {r.action_pruning && <ActionCard icon={<Scissors className="w-4 h-4" />} iconBg="bg-purple-100 text-purple-700 border-purple-200" title={i18nT("Poda & Manutenção")} content={r.action_pruning} />}
          </div>
        </div>

        {/* 3. GUIA DE CULTIVO & CARACTERÍSTICAS GERAIS */}
        <div className="space-y-3 pt-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">{i18nT("Ficha Botânica & Condições Ideais")}</h4>

          {/* Cuidados gerais */}
          {(r.sun || r.water || r.soil) && <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {r.sun && <InfoTile icon={<Sun className="w-4 h-4" />} color="#f59e0b" label={i18nT("Sol")} value={r.sun} />}
              {r.water && <InfoTile icon={<Droplets className="w-4 h-4" />} color="#0ea5e9" label={i18nT("Rega habitual")} value={r.water} />}
              {r.soil && <InfoTile icon={<Sprout className="w-4 h-4" />} color="#16a34a" label={i18nT("Solo ideal")} value={r.soil} />}
            </div>}

          {/* Épocas */}
          {(r.when_to_plant || r.when_to_harvest) && <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {r.when_to_plant && <InfoRow icon={<Calendar className="w-4 h-4" />} color="#16a34a" label={i18nT("Quando plantar na tua região")} value={r.when_to_plant} />}
              {r.when_to_harvest && <InfoRow icon={<Calendar className="w-4 h-4" />} color="#ea580c" label={i18nT("Época típica de colheita")} value={r.when_to_harvest} />}
            </div>}

          {/* Pragas comuns da espécie */}
          {r.common_pests && <InfoBlock icon={<Bug className="w-4 h-4" />} color="#dc2626" label={i18nT("Pragas comuns nesta espécie")} value={r.common_pests} />}

          {/* Dicas */}
          {r.tips && <InfoBlock icon={<Sparkles className="w-4 h-4" />} color="#7c3aed" label={i18nT("Dicas de cultivo da Horta Viva")} value={r.tips} />}
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-stone-100">
          <button onClick={onReset} className="flex-1 flex items-center justify-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-semibold py-3 rounded-xl transition-colors">
            <RotateCcw className="w-4 h-4" />{i18nT(" Identificar outra foto")}</button>
          <button onClick={onAddToFarm} className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs sm:text-sm font-bold py-3 rounded-xl shadow-md shadow-emerald-200/50 transition-all">
            <Sprout className="w-4 h-4" />{i18nT(" Adicionar à Minha Quinta")}</button>
        </div>
      </div>
    </div>;
}
function PhotoQuestionPanel({
  image,
  result
}) {
  const {
    t: i18nT
  } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const {
    isUltra,
    isPro,
    canUseAI
  } = useSubscription();
  if (!image) return null;
  const isAnimal = result?.subject_type === "animal";
  const askQuestion = async value => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    if (!canUseAI) {
      setShowUpgradeModal(true);
      return;
    }
    const userMessage = {
      role: "user",
      text: trimmed
    };
    const recentConversation = [...messages, userMessage].slice(-6).map(message => `${message.role === "user" ? "Utilizador" : "Assistente"}: ${message.text}`).join("\n");
    setMessages(current => [...current, userMessage]);
    setQuestion("");
    setLoading(true);
    try {
      const systemPrompt = isAnimal ? `És o assistente veterinário e especialista em pecuária e animais da quinta da Horta Viva. Analisa a fotografia enviada e responde na língua configurada na app, de forma clara, empática e prática.

Análise inicial desta fotografia de animal:
- Animal: ${result.name || "não confirmado"}
- Espécie/Raça: ${result.scientific_name || "não indicada"}
- Estado visual de saúde: ${result.health_status || "não avaliado"}
- Diagnóstico clínico: ${result.health_assessment || "sem detalhes"}
- Doenças ou parasitas detetados: ${result.detected_diseases || "sem diagnóstico confirmado"}
- Doenças comuns da espécie: ${result.common_diseases || "—"}

Conversa:
${recentConversation}

Usa sempre a fotografia como contexto. Dá orientações zootécnicas e preventivas sobre alimentação, desparasitação, higiene do abrigo e bem-estar animal. Ressalva que, perante sintomas graves, deve sempre consultar-se um médico veterinário.` : `És o assistente agrícola da Horta Viva. Analisa a fotografia enviada e responde na língua configurada na app, de forma clara e prática.

Análise inicial desta fotografia:
- Planta ou cultura: ${result.name || "não confirmada"}
- Estado visual: ${result.health_status || "não avaliado"}
- Diagnóstico: ${result.health_assessment || "sem detalhes"}
- Pragas ou doenças: ${result.detected_diseases || "sem diagnóstico confirmado"}

Conversa:
${recentConversation}

Usa sempre a fotografia como contexto. Distingue o que é visível do que exige confirmação no local. Para a plantação, indica passos concretos e seguros sobre rega, tratamento, colheita, solo ou manutenção quando a pergunta o justificar.`;
      const answer = await askGeminiAboutPhoto(image, systemPrompt);
      setMessages(current => [...current, {
        role: "assistant",
        text: answer
      }]);
      if (!isPro && !isUltra) incrementAIUsage();
    } catch (error) {
      setMessages(current => [...current, {
        role: "assistant",
        text: `Não consegui responder sobre esta foto agora. ${String(error?.message || error)}`
      }]);
    } finally {
      setLoading(false);
    }
  };
  return <section className="border-t border-stone-100 pt-4" aria-label={i18nT("Perguntar à IA sobre esta foto")}>
      <button type="button" onClick={() => setIsOpen(current => !current)} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-teal-200 bg-teal-50/70 px-4 py-3 text-left transition-colors hover:bg-teal-100" aria-expanded={isOpen}>
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
            <MessageCircle className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-bold text-stone-800">{i18nT("Perguntar à IA sobre esta foto")}</span>
            <span className="block text-[11px] text-stone-500">
              {isAnimal ? i18nT("Sintomas, alimentação, desparasitação e cuidados") : i18nT("Cuidados, doenças, rega e próximos passos")}
            </span>
          </span>
        </span>
        <span className="text-xs font-bold text-teal-700">{isOpen ? i18nT("Fechar") : i18nT("Perguntar")}</span>
      </button>

      {isOpen && <div className="mt-3 space-y-3 rounded-2xl border border-stone-200 bg-stone-50/80 p-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {isAnimal ? i18nT(["Que doença pode causar estes sintomas?", "Qual a alimentação diária ideal?", "Como desparasitar este animal?"].map(sug => <button key={sug} type="button" onClick={() => askQuestion(sug)} className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600 transition-colors hover:border-teal-300 hover:text-teal-700">
                    {i18nT(sug)}
                  </button>)) : i18nT(["O que devo fazer já hoje?", "Como tratar esta praga sem químicos?", "Quando é a altura certa para colher?"].map(sug => <button key={sug} type="button" onClick={() => askQuestion(sug)} className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] font-medium text-stone-600 transition-colors hover:border-teal-300 hover:text-teal-700">
                    {i18nT(sug)}
                  </button>))}
            </div>

            {messages.length > 0 && <div className="max-h-60 space-y-2 overflow-y-auto rounded-xl bg-white p-3 border border-stone-100">
                {i18nT(messages.map((m, index) => <div key={index} className={`rounded-xl p-2.5 text-xs leading-relaxed ${m.role === "user" ? "bg-teal-50 text-teal-900 ml-4 font-medium" : "bg-stone-50 text-stone-700 mr-4 whitespace-pre-line"}`}>
                    <span className="block font-bold text-[10px] uppercase tracking-wide opacity-70 mb-0.5">
                      {m.role === "user" ? i18nT("Tu") : i18nT("IA Horta Viva")}
                    </span>
                    {i18nT(m.text)}
                  </div>))}
              </div>}

            <div className="flex items-center gap-2">
              <input type="text" value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === "Enter" && askQuestion(question)} placeholder={isAnimal ? i18nT("Ex: Tem perda de penas e apatia, o que pode ser?") : i18nT("Ex: As folhas estão amarelas, devo regar?")} className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-700 outline-none transition-colors focus:border-teal-400" disabled={loading} />
              <button type="button" onClick={() => askQuestion(question)} disabled={loading || !question.trim()} className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white transition-opacity disabled:opacity-50" aria-label={i18nT("Enviar pergunta")}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>}

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} reason="ai" />
    </section>;
}
function ActionCard({
  icon,
  iconBg,
  title,
  content
}) {
  const {
    t: i18nT
  } = useI18n();
  return <div className="bg-white p-3 rounded-xl border border-stone-200/70 shadow-2xs space-y-1">
      <div className="flex items-center gap-2">
        <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${iconBg}`}>
          {i18nT(icon)}
        </div>
        <span className="font-bold text-xs text-stone-800">{i18nT(title)}</span>
      </div>
      <p className="text-xs text-stone-600 leading-snug pl-8">{i18nT(content)}</p>
    </div>;
}
function InfoTile({
  icon,
  color,
  label,
  value
}) {
  const {
    t: i18nT
  } = useI18n();
  return <div className="bg-white rounded-xl border border-stone-200/70 p-2.5 sm:p-3 text-center shadow-2xs">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto mb-1.5" style={{
      backgroundColor: color + "18"
    }}>
        <span style={{
        color
      }}>{i18nT(icon)}</span>
      </div>
      <p className="text-[10px] text-stone-400 uppercase tracking-wide font-bold">{i18nT(label)}</p>
      <p className="text-xs font-semibold text-stone-700 mt-0.5 truncate">{i18nT(value)}</p>
    </div>;
}
function InfoRow({
  icon,
  color,
  label,
  value
}) {
  const {
    t: i18nT
  } = useI18n();
  return <div className="bg-white rounded-xl border border-stone-200/70 p-3 shadow-2xs flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{
      backgroundColor: color + "18"
    }}>
        <span style={{
        color
      }}>{i18nT(icon)}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-stone-400 uppercase tracking-wide font-bold">{i18nT(label)}</p>
        <p className="text-xs font-semibold text-stone-700 mt-0.5">{i18nT(value)}</p>
      </div>
    </div>;
}
function InfoBlock({
  icon,
  color,
  label,
  value
}) {
  const {
    t: i18nT
  } = useI18n();
  return <div className="bg-white rounded-xl border border-stone-200/70 p-3 shadow-2xs">
      <div className="flex items-center gap-2 mb-1">
        <span style={{
        color
      }}>{i18nT(icon)}</span>
        <span className="text-xs font-bold text-stone-700">{i18nT(label)}</span>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed pl-6">{i18nT(value)}</p>
    </div>;
}
