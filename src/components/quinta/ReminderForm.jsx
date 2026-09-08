import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Bell, Loader2, X, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ReminderForm({ treatment, plantName, plantEmoji, plantingId, defaultDate, onSaved }) {
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(defaultDate && defaultDate >= today ? defaultDate : today);
  const [productIdx, setProductIdx] = useState(0);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  if (!treatment) return null;

  const submit = async () => {
    if (!date) return;
    setSaving(true);
    try {
      const product = treatment.products?.[productIdx];
      await base44.entities.Reminder.create({
        title: `Aplicar ${treatment.label} — ${plantName}`,
        date,
        plant_name: plantName,
        plant_emoji: plantEmoji || "🌱",
        treatment_key: treatment.key,
        product_name: product?.name || treatment.label,
        how: treatment.how,
        ...(plantingId ? { planting_id: plantingId } : {}),
        done: false,
      });
      toast({ title: "🔔 Lembrete adicionado", description: `${treatment.label} · ${date}` });
      setOpen(false);
      onSaved?.();
    } catch (e) {
      toast({ title: "Erro", description: "Não foi possível adicionar o lembrete.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg px-3 py-2 transition-colors"
      >
        <Bell className="w-3.5 h-3.5" /> Adicionar lembrete / notificação
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50/60 p-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5" /> Novo lembrete
        </p>
        <button onClick={() => setOpen(false)} className="text-amber-500 hover:text-amber-700">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div>
        <label className="text-xs text-stone-600 font-medium block mb-1">Quando aplicar (data do lembrete)</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full text-sm rounded-lg border border-stone-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
      </div>

      {treatment.products?.length > 0 && (
        <div>
          <label className="text-xs text-stone-600 font-medium block mb-1">Produto fitofarmacêutico</label>
          <select
            value={productIdx}
            onChange={e => setProductIdx(Number(e.target.value))}
            className="w-full text-sm rounded-lg border border-stone-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-300"
          >
            {treatment.products.map((p, i) => (
              <option key={i} value={i}>
                {p.name} — {p.dose}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-2 pt-0.5">
        <button
          onClick={submit}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium rounded-lg px-3 py-2 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Adicionar
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-sm text-stone-500 hover:text-stone-700 px-3 py-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}