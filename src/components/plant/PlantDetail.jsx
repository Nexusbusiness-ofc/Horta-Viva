import { useI18n, CatalogLanguageNote } from "@/lib/I18nContext";
import { translatedMonth } from "@/lib/i18n";
import RegionalCalendarNotice from "@/components/regional/RegionalCalendarNotice";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Droplets, Sprout, Calendar, Package, Shovel, Heart, ClipboardList, PlusCircle } from "lucide-react";
import PlantCareCalendar from "@/components/plant/PlantCareCalendar";
import { Image } from "@/components/ui/image";

const MONTH_SHORT = ["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function monthBadges(months, language) {
  return (months || [])
    .map(m => {
      const raw = translatedMonth(m - 1, language, 'short').replace(/\.$/, "");
      return raw.charAt(0).toUpperCase() + raw.slice(1);
    })
    .join(" · ");
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
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-2xs space-y-2">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: color + "20" }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="font-extrabold text-stone-800 text-xs sm:text-sm uppercase tracking-wider">
          {i18nT(title)}
        </h3>
      </div>
      <p className="text-stone-600 text-sm leading-relaxed pl-0.5">
        {i18nT(children)}
      </p>
    </div>
  );
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
  const color = plant.color || "#16a34a";
  const currentMonth = new Date().getMonth() + 1;

  const badges = [
    {
      icon: Sun,
      label: plant.sun_requirements,
      bg: "#fef3c7",
      fg: "#d97706"
    },
    {
      icon: Droplets,
      label: `Rega ${plant.water_requirements?.toLowerCase()}`,
      bg: "#dbeafe",
      fg: "#2563eb"
    },
    {
      icon: Sprout,
      label: plant.difficulty,
      bg: "#dcfce7",
      fg: "#16a34a"
    },
    ...(plant.days_to_harvest
      ? [
          {
            icon: Calendar,
            label: plant.days_to_harvest,
            bg: "#f3e8ff",
            fg: "#9333ea"
          }
        ]
      : [])
  ];

  const calendarRows = [
    {
      key: "sow",
      emoji: "🌱",
      label: "Sementeira",
      months: plant.sow_months || [],
      color: "#059669",
      bg: "bg-emerald-50/80 border-emerald-200/80"
    },
    {
      key: "plant",
      emoji: "🌿",
      label: "Plantação",
      months: plant.plant_months || [],
      color: "#0284c7",
      bg: "bg-sky-50/80 border-sky-200/80"
    },
    {
      key: "harvest",
      emoji: "🧺",
      label: "Colheita",
      months: plant.harvest_months || [],
      color: "#d97706",
      bg: "bg-amber-50/80 border-amber-200/80"
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-white to-emerald-50/30 w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header com imagem da planta */}
        {plant.image_url && (
          <div className="relative w-full h-48 sm:h-60 overflow-hidden">
            <Image
              src={plant.image_url}
              fittingType="fill"
              alt={i18nT(plant.name)}
              className="w-full h-full block"
              focalPointY={0.4}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
            <span className="absolute bottom-3 left-4 text-4xl drop-shadow-lg">
              {i18nT(plant.emoji)}
            </span>
          </div>
        )}

        <div
          className="relative px-6 pt-6 pb-5"
          style={{ background: `linear-gradient(135deg, ${color}24, ${color}08)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-stone-600 transition-colors shadow-sm"
          >
            ✕
          </button>
          {!plant.image_url && <div className="text-6xl mb-2">{i18nT(plant.emoji)}</div>}
          <span
            className="inline-block text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-1.5"
            style={{ backgroundColor: color + "22", color }}
          >
            {i18nT(plant.category)}
          </span>
          <h2 className="text-2xl font-black text-stone-800">{i18nT(plant.name)}</h2>

          <div className="flex flex-wrap gap-2 mt-3.5">
            {i18nT(
              badges.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-white/90 border border-stone-200/60 rounded-xl px-3 py-1.5 shadow-2xs"
                >
                  <b.icon className="w-3.5 h-3.5" style={{ color: b.fg }} />
                  <span className="text-xs font-bold text-stone-700">{i18nT(b.label)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Botões de Ação Rápida */}
        <div className="px-6 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            onClick={() => setShowCuras(s => !s)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-2xl shadow-md shadow-orange-200/50 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <ClipboardList className="w-4 h-4" />
            <span>
              {showCuras ? i18nT("Fechar calendário de curas") : i18nT("Ver calendário de curas")}
            </span>
          </button>

          <Link
            to="/minha-quinta"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-2xl shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{i18nT("Plantar na Minha Quinta")}</span>
          </Link>
        </div>

        {/* Calendário de curas */}
        {showCuras && (
          <div className="px-6 pt-4">
            <PlantCareCalendar plant={plant} />
          </div>
        )}

        {/* Conteúdo */}
        <div className="px-6 py-5 space-y-4">
          <CatalogLanguageNote />
          <RegionalCalendarNotice item={plant} />

          {/* Calendário Visual de 12 Meses (Sementeira, Plantação, Colheita) */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{i18nT("Calendário Anual da Cultura")}</span>
            </h3>
            <div className="space-y-2.5">
              {calendarRows.map((row) => (
                <div key={row.key} className={`rounded-xl p-2.5 border space-y-1.5 ${row.bg}`}>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-extrabold text-stone-800 flex items-center gap-1.5">
                      <span>{row.emoji}</span>
                      <span>{i18nT(row.label)}</span>
                    </span>
                    <span className="font-bold text-stone-700 text-[11px]">
                      {monthBadges(row.months, language) || i18nT("—")}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                      const active = row.months.includes(m);
                      const isNow = m === currentMonth;
                      return (
                        <span
                          key={m}
                          className={`flex-1 text-center text-[9px] leading-none rounded-md py-1.5 font-extrabold ${
                            active ? "text-white shadow-2xs" : "bg-white/80 text-stone-300"
                          } ${isNow ? "ring-1.5 ring-stone-900" : ""}`}
                          style={active ? { backgroundColor: row.color } : {}}
                        >
                          {i18nT(MONTH_SHORT[m])}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {plant.sow_instructions && (
            <Section icon={Sprout} title={i18nT("Como Semear")} color="#16a34a">
              {i18nT(plant.sow_instructions)}
            </Section>
          )}
          {plant.plant_instructions && (
            <Section icon={Shovel} title={i18nT("Como Plantar")} color="#0891b2">
              {i18nT(plant.plant_instructions)}
            </Section>
          )}
          {plant.care_instructions && (
            <Section icon={Heart} title={i18nT("Cuidados")} color="#db2777">
              {i18nT(plant.care_instructions)}
            </Section>
          )}
          {plant.storage_instructions && (
            <Section icon={Package} title={i18nT("Como Armazenar")} color="#7c3aed">
              {i18nT(plant.storage_instructions)}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
