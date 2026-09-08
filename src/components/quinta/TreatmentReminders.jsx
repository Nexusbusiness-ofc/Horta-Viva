import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, Check, Loader2 } from "lucide-react";

const MONTH_NAMES = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function fmtDate(d) {
  const date = new Date(d + "T00:00");
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth() + 1]}`;
}

export default function TreatmentReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const all = await base44.entities.Reminder.list("date");
      setReminders(all);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const today = new Date().toISOString().split("T")[0];
  const due = reminders.filter(r => !r.done && r.date <= today).sort((a, b) => a.date.localeCompare(b.date));

  const markDone = async (id) => {
    await base44.entities.Reminder.update(id, { done: true });
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  if (loading) return null;
  if (due.length === 0) return null;

  return (
    <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 p-4 shadow-lg shadow-orange-200/40">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-white" />
        <h3 className="text-sm font-bold text-white">Lembretes de tratamentos ({due.length})</h3>
      </div>
      <div className="space-y-2">
        {due.map(r => (
          <div key={r.id} className="flex items-center gap-3 bg-white/95 rounded-xl px-3 py-2.5">
            <span className="text-xl shrink-0">{r.plant_emoji || "🌱"}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800 truncate">{r.product_name}</p>
              <p className="text-xs text-stone-500 truncate">{r.plant_name}</p>
            </div>
            <span className="text-xs font-medium text-amber-700 shrink-0">{fmtDate(r.date)}</span>
            <button
              onClick={() => markDone(r.id)}
              className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-600 transition-colors shrink-0"
              title="Marcar como feito"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}