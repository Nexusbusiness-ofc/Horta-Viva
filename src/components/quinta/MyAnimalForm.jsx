import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { X, PawPrint, MapPin, Calendar, Package, StickyNote } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function MyAnimalForm({ animals, onClose, onSaved, editing }) {
  const [form, setForm] = useState({
    animal_name: editing?.animal_name || "",
    animal_id: editing?.animal_id || "",
    animal_emoji: editing?.animal_emoji || "🐾",
    animal_color: editing?.animal_color || "#ea580c",
    quantity: editing?.quantity ?? 1,
    location: editing?.location || "",
    notes: editing?.notes || "",
    added_date: editing?.added_date || new Date().toISOString().split("T")[0],
  });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const filtered = search.trim()
    ? animals.filter(a => a.name.toLowerCase().includes(search.toLowerCase().trim()))
    : animals;

  const handleSelect = (a) => {
    setForm(f => ({
      ...f,
      animal_name: a.name,
      animal_id: a.id,
      animal_emoji: a.emoji,
      animal_color: a.color,
    }));
    setSearch("");
  };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = { ...form };
    if (!data.animal_name && search.trim()) data.animal_name = search.trim();
    if (!data.animal_name) return;
    data.quantity = data.quantity === "" ? 1 : (parseInt(data.quantity) || 1);
    Object.keys(data).forEach(k => { if (data[k] === "") delete data[k]; });
    setSaving(true);
    try {
      if (editing?.id) {
        await base44.entities.MyAnimal.update(editing.id, data);
      } else {
        await base44.entities.MyAnimal.create(data);
      }
      onSaved();
    } catch (err) {
      setSaving(false);
      toast({
        variant: "destructive",
        title: "Não foi possível guardar",
        description: String(err?.message || err),
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90dvh] overflow-y-auto overscroll-contain shadow-2xl animate-in slide-in-from-bottom duration-300"
        style={{ WebkitOverflowScrolling: "touch" }}
        onClick={e => e.stopPropagation()}
      >
        <div
          className="relative px-6 pt-8 pb-6"
          style={{ background: `linear-gradient(135deg, ${form.animal_color}28, ${form.animal_color}08)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-6xl mb-2">{form.animal_emoji}</div>
          <h2 className="text-2xl font-bold text-stone-800">{editing ? "Editar animal" : "Novo animal na quinta"}</h2>
          <p className="text-sm text-stone-500 mt-1">Regista os animais que tens para receber lembretes diários</p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Seleção de animal do catálogo */}
          {!editing && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
                <PawPrint className="w-4 h-4 text-orange-600" /> Animal *
              </label>
              {form.animal_name ? (
                <div
                  className="flex items-center gap-3 rounded-xl p-3 border-2"
                  style={{ borderColor: form.animal_color + "40", backgroundColor: form.animal_color + "10" }}
                >
                  <span className="text-3xl">{form.animal_emoji}</span>
                  <span className="flex-1 font-semibold text-stone-800">{form.animal_name}</span>
                  <button type="button" onClick={() => { set("animal_name", ""); set("animal_id", ""); setSearch(""); }} className="text-stone-400 hover:text-stone-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Pesquisar animal do catálogo..."
                    className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  {search.trim() && (
                    <div className="max-h-40 overflow-y-auto space-y-1 -mx-1 px-1 rounded-lg border border-stone-100 bg-white">
                      {filtered.slice(0, 20).map(a => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => handleSelect(a)}
                          className="w-full flex items-center gap-2 text-left rounded-lg px-3 py-2 hover:bg-orange-50 transition-colors"
                        >
                          <span className="text-2xl">{a.emoji}</span>
                          <span className="text-sm text-stone-700">{a.name}</span>
                          <span className="text-xs text-stone-400 ml-auto">{a.category}</span>
                        </button>
                      ))}
                      {filtered.length === 0 && search.trim() && (
                        <p className="px-3 py-2 text-xs text-stone-400">Sem resultados — podes usar o nome que escreveste.</p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Quantidade e local */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-orange-600" /> Quantidade
              </label>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={e => set("quantity", e.target.value)}
                className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" /> Local
              </label>
              <input
                type="text"
                value={form.location}
                onChange={e => set("location", e.target.value)}
                placeholder="Galinheiro, pasto..."
                className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300"
              />
            </div>
          </div>

          {/* Desde */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-orange-600" /> Na quinta desde
            </label>
            <input
              type="date"
              value={form.added_date}
              onChange={e => set("added_date", e.target.value)}
              className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5">
              <StickyNote className="w-3.5 h-3.5 text-stone-500" /> Notas
            </label>
            <textarea
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="Observações, saúde, reprodução..."
              rows={2}
              className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving || (!form.animal_name && !search.trim())}
            className="w-full bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {saving ? "A guardar..." : editing ? "Guardar alterações" : "Adicionar à quinta"}
          </button>
        </form>
      </div>
    </div>
  );
}