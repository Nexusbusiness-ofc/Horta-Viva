import React from "react";
import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";

export default function ReminderBanner({ plantings }) {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const weekFromNow = new Date(today.getTime() + 7 * 86400000).toISOString().split("T")[0];

  const overdue = plantings.filter(p =>
    p.status !== "Colhida" && p.expected_harvest_date && p.expected_harvest_date < todayStr
  );
  const readyToday = plantings.filter(p =>
    p.status !== "Colhida" && p.expected_harvest_date === todayStr
  );
  const thisWeek = plantings.filter(p =>
    p.status !== "Colhida" && p.expected_harvest_date > todayStr && p.expected_harvest_date <= weekFromNow
  );
  const harvested = plantings.filter(p => p.status === "Colhida");

  if (plantings.length === 0) return null;

  const cards = [];

  if (overdue.length > 0) {
    cards.push({
      icon: AlertTriangle,
      title: "Atrasadas",
      count: overdue.length,
      subtitle: "para além da data",
      gradient: "from-red-500 to-rose-600",
      bg: "bg-red-50 border-red-100",
      iconBg: "bg-red-500"
    });
  }
  if (readyToday.length > 0) {
    cards.push({
      icon: Clock,
      title: "Colher hoje",
      count: readyToday.length,
      subtitle: "prontas agora",
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-50 border-amber-100",
      iconBg: "bg-amber-500"
    });
  }
  if (thisWeek.length > 0) {
    cards.push({
      icon: Clock,
      title: "Esta semana",
      count: thisWeek.length,
      subtitle: "nos próximos 7 dias",
      gradient: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50 border-emerald-100",
      iconBg: "bg-emerald-500"
    });
  }

  return (
    <div className="space-y-3">
      {cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {cards.map((c, i) => (
            <div key={i} className={`rounded-2xl border p-4 ${c.bg}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-sm`}>
                  <c.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-stone-700">{c.title}</span>
              </div>
              <p className="text-2xl font-bold text-stone-800 ml-10">{c.count}</p>
              <p className="text-xs text-stone-500 ml-10">{c.subtitle}</p>
            </div>
          ))}
        </div>
      )}
      {harvested.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-stone-500 bg-stone-50 rounded-xl px-4 py-2.5">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          <span>{harvested.length} plantação{harvested.length !== 1 ? "ns" : ""} já colhida{harvested.length !== 1 ? "s" : ""} 🎉</span>
        </div>
      )}
    </div>
  );
}