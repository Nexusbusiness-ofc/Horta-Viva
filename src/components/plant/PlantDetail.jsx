import { useI18n, CatalogLanguageNote } from "@/lib/I18nContext";
import { translatedMonth } from "@/lib/i18n";
import RegionalCalendarNotice from "@/components/regional/RegionalCalendarNotice";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sun, Droplets, Sprout, Calendar, Package, Shovel, Heart, ClipboardList, PlusCircle } from "lucide-react";
import PlantCareCalendar from "@/components/plant/PlantCareCalendar";
import { Image } from "@/components/ui/image";
import Emoji3D from "@/components/ui/Emoji3D";

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
            <div className="absolute bottom-3 left-4">
              <Emoji3D item={plant} size="xl" badge />
            </div>
          </div>
        )}

        <div
          className="relative px-6 pt-6 pb-5"
          style={{ background: `linear-gradient(135deg, ${color}24, ${color}08)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/85 hover:bg-white flex items-center justify-center text-stone-600 transition-colors shadow-sm"
          >
            ✕
          </button>

          {!plant.image_url && (
            <div className="mb-3">
              <Emoji3D item={plant} size="2xl" badge />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span
                className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-1.5"
                style={{ backgroundColor: color, color: "#fff" }}
              >
                {i18nT(plant.category)}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-800 leading-tight">
                {i18nT(plant.name)}
              </h2>
            </div>

            <Link
              to="/minha-quinta"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{i18nT("Plantar na Minha Quinta")}</span>
            </Link>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {badges.map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-2xs"
                style={{ backgroundColor: b.bg, color: b.fg }}
              >
                <b.icon className="w-3.5 h-3.5" />
                {i18nT(b.label)}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          <CatalogLanguageNote />
          <RegionalCalendarNotice />

          {/* Botão Curas e Cuidados do Dia a Dia */}
          <button
            onClick={() => setShowCuras(true)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-200/60 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <ClipboardList className="w-4 h-4" />
            <span>{i18nT("🌿 Curas, Adubação e Cuidados do Dia a Dia")}</span>
          </button>

          {/* Calendário Visual de 12 Meses */}
          <div className="rounded-3xl bg-white border border-stone-200/90 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {i18nT("Calendário Anual da Cultura")}
              </p>
              <span className="text-[10px] font-bold text-stone-400">
                {i18nT("Mês atual destacado")}
              </span>
            </div>

            <div className="space-y-2.5">
              {calendarRows.map(row => (
                <div key={row.key} className={`rounded-2xl border p-2.5 space-y-1.5 ${row.bg}`}>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-extrabold text-stone-800 flex items-center gap-1.5">
                      <span>{row.emoji}</span>
                      <span>{i18nT(row.label)}</span>
                    </span>
                    <span className="font-bold text-[11px] truncate" style={{ color: row.color }}>
                      {monthBadges(row.months, language) || "—"}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => {
                      const active = row.months.includes(m);
                      const isNow = m === currentMonth;
                      return (
                        <span
                          key={m}
                          className={`flex-1 text-center text-[9px] leading-none rounded-md py-1.5 font-extrabold ${
                            active ? "text-white shadow-2xs" : "bg-white/80 text-stone-300"
                          } ${isNow ? "ring-1 ring-stone-900" : ""}`}
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

          {/* Instructions */}
          <div className="grid grid-cols-1 gap-3">
            {plant.sow_instructions && (
              <Section icon={Sprout} title={i18nT("Como Semear")} color={color}>
                {i18nT(plant.sow_instructions)}
              </Section>
            )}

            {plant.plant_instructions && (
              <Section icon={Shovel} title={i18nT("Como Plantar")} color={color}>
                {i18nT(plant.plant_instructions)}
              </Section>
            )}

            {plant.care_instructions && (
              <Section icon={Heart} title={i18nT("Cuidados Durante o Crescimento")} color={color}>
                {i18nT(plant.care_instructions)}
              </Section>
            )}

            {plant.storage_instructions && (
              <Section icon={Package} title={i18nT("Como Conservar após a Colheita")} color={color}>
                {i18nT(plant.storage_instructions)}
              </Section>
            )}
          </div>
        </div>
      </div>

      {showCuras && <PlantCareCalendar plant={plant} onClose={() => setShowCuras(false)} />}
    </div>
  );
}
