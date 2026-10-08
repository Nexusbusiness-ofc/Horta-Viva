import { useI18n, CatalogLanguageNote } from "@/lib/I18nContext";
import { translatedMonth } from "@/lib/i18n";
import RegionalCalendarNotice from "@/components/regional/RegionalCalendarNotice";
import React, { useState } from "react";
import { Sun, Droplets, Sprout, Calendar, Package, Shovel, Heart, ClipboardList } from "lucide-react";
import PlantCareCalendar from "@/components/plant/PlantCareCalendar";
import { Image } from "@/components/ui/image";
function monthBadges(months, language) {
  return (months || []).map(m => translatedMonth(m - 1, language, 'short')).join(" · ");
}
function Section({
  icon: Icon,
  title,
  children,
  color
}) {
  const {
    t: i18nT
  } = useI18n();
  return <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
        backgroundColor: color + "22"
      }}>
          <Icon className="w-4 h-4" style={{
          color
        }} />
        </div>
        <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide">{i18nT(title)}</h3>
      </div>
      <p className="text-stone-600 text-sm leading-relaxed pl-9">{i18nT(children)}</p>
    </div>;
}
export default function PlantDetail({
  plant,
  onClose
}) {
  const {
    t: i18nT,
    language
  } = useI18n();
  const [showCuras, setShowCuras] = useState(false);
  if (!plant) return null;
  const color = plant.color || "#84cc16";
  const badges = [{
    icon: Sun,
    label: plant.sun_requirements,
    bg: "#fef3c7",
    fg: "#d97706"
  }, {
    icon: Droplets,
    label: `Rega ${plant.water_requirements?.toLowerCase()}`,
    bg: "#dbeafe",
    fg: "#2563eb"
  }, {
    icon: Sprout,
    label: plant.difficulty,
    bg: "#dcfce7",
    fg: "#16a34a"
  }, ...(plant.days_to_harvest ? [{
    icon: Calendar,
    label: plant.days_to_harvest,
    bg: "#f3e8ff",
    fg: "#9333ea"
  }] : [])];
  return <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-gradient-to-br from-white to-emerald-50/20 w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
        {/* Header com gradiente da cor da planta */}
        {plant.image_url && <div className="relative w-full h-44 sm:h-56 overflow-hidden">
            <Image src={plant.image_url} fittingType="fill" alt={i18nT(plant.name)} className="w-full h-full block" focalPointY={0.4} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            <span className="absolute bottom-3 left-4 text-4xl drop-shadow-lg">{i18nT(plant.emoji)}</span>
          </div>}
        <div className="relative px-6 pt-8 pb-6" style={{
        background: `linear-gradient(135deg, ${color}28, ${color}08)`
      }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 transition-colors shadow-sm">
            ✕
          </button>
          {!plant.image_url && <div className="text-6xl mb-2">{i18nT(plant.emoji)}</div>}
          <h2 className="text-2xl font-bold text-stone-800">{i18nT(plant.name)}</h2>
          <span className="inline-block mt-1 text-xs font-medium px-3 py-1 rounded-full" style={{
          backgroundColor: color + "22",
          color
        }}>
            {i18nT(plant.category)}
          </span>
          <div className="flex flex-wrap gap-2 mt-4">
            {i18nT(badges.map((b, i) => <div key={i} className="flex items-center gap-1.5 bg-white/70 rounded-lg px-2.5 py-1">
                <b.icon className="w-3.5 h-3.5" style={{
              color: b.fg
            }} />
                <span className="text-xs font-medium text-stone-600">{i18nT(b.label)}</span>
              </div>))}
          </div>
        </div>

        {/* Botão Ver Curas */}
        <div className="px-6 pt-1">
          <button onClick={() => setShowCuras(s => !s)} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-orange-200/50 hover:shadow-lg transition-all active:scale-[0.98]">
            <ClipboardList className="w-4 h-4" />
            {showCuras ? i18nT("Fechar calendário de curas") : i18nT("Ver calendário de curas")}
          </button>
        </div>

        {/* Calendário de curas */}
        {showCuras && <div className="px-6 pt-4">
            <PlantCareCalendar plant={plant} />
          </div>}

        {/* Conteúdo */}
        <div className="px-6 py-6 space-y-5">
          <CatalogLanguageNote />
          <RegionalCalendarNotice item={plant} />
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-lg">🌱</div>
              <div>
                <p className="text-xs text-stone-500 font-medium">{i18nT("Sementeira")}</p>
                <p className="text-sm font-semibold text-stone-700">{monthBadges(plant.sow_months, language) || i18nT("—")}</p>
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-lg">🌿</div>
              <div>
                <p className="text-xs text-stone-500 font-medium">{i18nT("Plantação")}</p>
                <p className="text-sm font-semibold text-stone-700">{monthBadges(plant.plant_months, language) || i18nT("—")}</p>
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-lg">🧺</div>
              <div>
                <p className="text-xs text-stone-500 font-medium">{i18nT("Colheita")}</p>
                <p className="text-sm font-semibold text-stone-700">{monthBadges(plant.harvest_months, language) || i18nT("—")}</p>
              </div>
            </div>
          </div>

          {plant.sow_instructions && <Section icon={Sprout} title={i18nT("Como Semear")} color="#16a34a">{i18nT(plant.sow_instructions)}</Section>}
          {plant.plant_instructions && <Section icon={Shovel} title={i18nT("Como Plantar")} color="#0891b2">{i18nT(plant.plant_instructions)}</Section>}
          {plant.care_instructions && <Section icon={Heart} title={i18nT("Cuidados")} color="#db2777">{i18nT(plant.care_instructions)}</Section>}
          {plant.storage_instructions && <Section icon={Package} title={i18nT("Como Armazenar")} color="#7c3aed">{i18nT(plant.storage_instructions)}</Section>}
        </div>
      </div>
    </div>;
}
