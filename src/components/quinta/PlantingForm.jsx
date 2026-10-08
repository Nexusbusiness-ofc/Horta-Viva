import { useI18n } from "@/lib/I18nContext";
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, Sprout, MapPin, Calendar, Package, StickyNote } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { canAddPlantation, FREE_PLANTATIONS_LIMIT } from "@/lib/subscription";
const STATUS_OPTIONS = ["Plantada", "Em crescimento", "Pronta a colher", "Colhida"];
export default function PlantingForm({
  plants,
  onClose,
  onSaved,
  editing
}) {
  const { preferences } = useRegionalPreferences();
  const {
    t: i18nT
  } = useI18n();
  const [form, setForm] = useState({
    plant_name: editing?.plant_name || "",
    plant_emoji: editing?.plant_emoji || "🌱",
    plant_color: editing?.plant_color || "#84cc16",
    planted_date: editing?.planted_date || new Date().toISOString().split("T")[0],
    expected_harvest_date: editing?.expected_harvest_date || "",
    location: editing?.location || "",
    growing_environment: editing?.growing_environment || preferences.growingEnvironment || 'outdoor',
    quantity: editing?.quantity || "",
    notes: editing?.notes || "",
    status: editing?.status || "Plantada"
  });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const {
    toast
  } = useToast();
  const filteredPlants = search.trim() ? plants.filter(p => p.name.toLowerCase().includes(search.toLowerCase().trim())) : plants;
  const handlePlantSelect = plant => {
    setForm(f => ({
      ...f,
      plant_name: plant.name,
      plant_emoji: plant.emoji,
      plant_color: plant.color
    }));
    setSearch("");
  };
  const set = (key, val) => setForm(f => ({
    ...f,
    [key]: val
  }));
  const handleSubmit = async e => {
    e.preventDefault();
    let data = {
      ...form
    };
    if (!data.plant_name && search.trim()) {
      data.plant_name = search.trim();
    }
    if (!data.plant_name || !data.planted_date) return;
    // Remove strings vazias para não falhar validação de formatos (ex: date)
    Object.keys(data).forEach(k => {
      if (data[k] === "") delete data[k];
    });
    setSaving(true);
    try {
      if (editing?.id) {
        await base44.entities.Planting.update(editing.id, data);
      } else {
        const currentList = await base44.entities.Planting.list().catch(() => []);
        if (!canAddPlantation(currentList.length)) {
          setSaving(false);
          toast({
            variant: "destructive",
            title: `Limite atingido (${FREE_PLANTATIONS_LIMIT}/${FREE_PLANTATIONS_LIMIT} plantações)`,
            description: `O plano base permite até ${FREE_PLANTATIONS_LIMIT} plantações. Ativa o Horta Viva Pro para cultivares sem limites!`
          });
          return;
        }
        await base44.entities.Planting.create(data);
      }
      onSaved();
    } catch (err) {
      setSaving(false);
      toast({
        variant: "destructive",
        title: "Não foi possível guardar",
        description: String(err?.message || err)
      });
    }
  };
  return <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90dvh] overflow-y-auto overscroll-contain shadow-2xl animate-in slide-in-from-bottom duration-300" style={{
      WebkitOverflowScrolling: "touch"
    }} onClick={e => e.stopPropagation()}>
        <div className="relative px-6 pt-8 pb-6" style={{
        background: `linear-gradient(135deg, ${form.plant_color}28, ${form.plant_color}08)`
      }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 shadow-sm">
            <X className="w-5 h-5" />
          </button>
          <div className="text-6xl mb-2">{i18nT(form.plant_emoji)}</div>
          <h2 className="text-2xl font-bold text-stone-800">{editing ? i18nT("Editar plantação") : i18nT("Nova plantação")}</h2>
          <p className="text-sm text-stone-500 mt-1">{i18nT("Regista o que plantaste na tua quinta")}</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Seleção de planta */}
          {!editing && <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />{i18nT(" Planta *")}</label>
              {form.plant_name ? <div className="flex items-center gap-3 rounded-xl p-3 border-2" style={{
            borderColor: form.plant_color + "40",
            backgroundColor: form.plant_color + "10"
          }}>
                  <span className="text-3xl">{i18nT(form.plant_emoji)}</span>
                  <span className="flex-1 font-semibold text-stone-800">{i18nT(form.plant_name)}</span>
                  <button type="button" onClick={() => {
              set("plant_name", "");
              setSearch("");
            }} className="text-stone-400 hover:text-stone-600">
                    <X className="w-4 h-4" />
                  </button>
                </div> : <>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={i18nT("Pesquisar ou escrever nome da planta...")} className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
                  {search.trim() && <div className="max-h-40 overflow-y-auto space-y-1 -mx-1 px-1 rounded-lg border border-stone-100 bg-white">
                      {i18nT(filteredPlants.slice(0, 20).map(p => <button key={p.id} type="button" onClick={() => handlePlantSelect(p)} className="w-full flex items-center gap-2 text-left rounded-lg px-3 py-2 hover:bg-emerald-50 transition-colors">
                          <span className="text-2xl">{i18nT(p.emoji)}</span>
                          <span className="text-sm text-stone-700">{i18nT(p.name)}</span>
                          <span className="text-xs text-stone-400 ml-auto">{i18nT(p.category)}</span>
                        </button>))}
                      {filteredPlants.length === 0 && search.trim() && <p className="px-3 py-2 text-xs text-stone-400">{i18nT("Sem resultados — podes usar o nome que escreveste.")}</p>}
                    </div>}
                </>}
            </div>}

          {/* Datas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />{i18nT(" Plantada a *")}</label>
              <input type="date" value={form.planted_date} onChange={e => set("planted_date", e.target.value)} required className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-orange-500" />{i18nT(" Colher até")}</label>
              <input type="date" value={form.expected_harvest_date} onChange={e => set("expected_harvest_date", e.target.value)} className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
          </div>

          <div className="space-y-2"><label htmlFor="planting-environment" className="text-sm font-semibold text-stone-700">{i18nT('Ambiente de cultivo')}</label><select id="planting-environment" value={form.growing_environment} onChange={e=>set('growing_environment',e.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-sm">{[['outdoor','Ao ar livre'],['container','Em vaso / floreira'],['greenhouse','Em estufa'],['indoor','No interior']].map(([key,label])=><option key={key} value={key}>{i18nT(label)}</option>)}</select><p className="text-xs text-stone-500">{i18nT('A chuva só é considerada na rega de plantações ao ar livre. Verifica sempre a humidade do solo.')}</p></div>
          {/* Localização e quantidade */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />{i18nT(" Local")}</label>
              <input type="text" value={form.location} onChange={e => set("location", e.target.value)} placeholder={i18nT("Canteiro 1, estufa...")} className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-stone-500" />{i18nT(" Quantidade")}</label>
              <input type="text" value={form.quantity} onChange={e => set("quantity", e.target.value)} placeholder={i18nT("5 sementes, 3 linhas...")} className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
            </div>
          </div>

          {/* Estado */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600">{i18nT("Estado")}</label>
            <div className="flex flex-wrap gap-2">
              {i18nT(STATUS_OPTIONS.map(s => <button key={s} type="button" onClick={() => set("status", s)} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${form.status === s ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>
                  {i18nT(s)}
                </button>))}
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-stone-500" />{i18nT(" Notas")}</label>
            <textarea value={form.notes} onChange={e => set("notes", e.target.value)} placeholder={i18nT("Observações, adubações, pragas...")} rows={2} className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
          </div>

          <button type="submit" disabled={saving || !form.plant_name && !search.trim()} className="w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all disabled:opacity-50 active:scale-[0.98]">
            {saving ? i18nT("A guardar...") : editing ? i18nT("Guardar alterações") : i18nT("Adicionar à quinta")}
          </button>
        </form>
      </div>
    </div>;
}
