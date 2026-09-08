import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Loader2, MapPin, Sprout, Heart, Sun, Leaf } from "lucide-react";

const FARMER_TYPES = ["Amador", "Profissional", "Agricultura biológica", "Quinta familiar", "Permacultura", "Autossuficiência"];
const SEASONS = [
  { v: "Primavera", e: "🌸" },
  { v: "Verão", e: "☀️" },
  { v: "Outono", e: "🍂" },
  { v: "Inverno", e: "❄️" },
];
const EMOJIS = ["🌱", "🌾", "🌻", "🍅", "🐓", "🐝", "🚜", "🌳", "🥕", "🌿"];

export default function ProfileForm({ user, onSaved }) {
  const [form, setForm] = useState({
    avatar_url: user?.avatar_url || "",
    avatar_emoji: user?.avatar_emoji || "🌱",
    farm_name: user?.farm_name || "",
    location: user?.location || "",
    farmer_type: user?.farmer_type || "Amador",
    experience_years: user?.experience_years ?? 0,
    favorite_crops: user?.favorite_crops || "",
    favorite_season: user?.favorite_season || "Primavera",
    bio: user?.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      set("avatar_url", file_url);
    } catch (err) {
      toast({ variant: "destructive", title: "Erro ao enviar foto", description: String(err?.message || err) });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form };
      if (data.experience_years === "") data.experience_years = 0;
      Object.keys(data).forEach(k => { if (data[k] === "") delete data[k]; });
      await base44.auth.updateMe(data);
      await onSaved?.();
      toast({ title: "Perfil guardado ✅", description: "Os teus dados foram atualizados." });
    } catch (err) {
      setSaving(false);
      toast({ variant: "destructive", title: "Não foi possível guardar", description: String(err?.message || err) });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Foto de perfil */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-stone-100 border-4 border-white shadow-lg flex items-center justify-center">
          {form.avatar_url ? (
            <img src={form.avatar_url} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-5xl">{form.avatar_emoji || "🌱"}</span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
            </div>
          )}
        </div>
        <label className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors">
          <Camera className="w-4 h-4" />
          {form.avatar_url ? "Trocar foto" : "Adicionar foto"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        {form.avatar_url && (
          <button type="button" onClick={() => set("avatar_url", "")} className="text-xs text-stone-400 hover:text-red-500">Remover foto</button>
        )}
        <div className="flex flex-wrap justify-center gap-1.5">
          {EMOJIS.map(em => (
            <button
              key={em}
              type="button"
              onClick={() => set("avatar_emoji", em)}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${form.avatar_emoji === em && !form.avatar_url ? "bg-emerald-100 ring-2 ring-emerald-400" : "bg-stone-100 hover:bg-stone-200"}`}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Nome da quinta + localização */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5"><Sprout className="w-3.5 h-3.5 text-emerald-600" /> Nome da quinta</label>
          <input value={form.farm_name} onChange={e => set("farm_name", e.target.value)} placeholder="Quinta da Serra..." className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-orange-500" /> Localização</label>
          <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="Concelho, distrito..." className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
        </div>
      </div>

      {/* Tipo de agricultor */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-green-600" /> Tipo de agricultor</label>
        <div className="flex flex-wrap gap-2">
          {FARMER_TYPES.map(t => (
            <button key={t} type="button" onClick={() => set("farmer_type", t)} className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all ${form.farmer_type === t ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>{t}</button>
          ))}
        </div>
      </div>

      {/* Experiência + culturas favoritas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-600">Anos de experiência</label>
          <input type="number" min="0" value={form.experience_years} onChange={e => set("experience_years", e.target.value)} className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-500" /> Culturas favoritas</label>
          <input value={form.favorite_crops} onChange={e => set("favorite_crops", e.target.value)} placeholder="Tomate, couve, morango..." className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300" />
        </div>
      </div>

      {/* Estação favorita */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-500" /> Estação favorita</label>
        <div className="flex flex-wrap gap-2">
          {SEASONS.map(s => (
            <button key={s.v} type="button" onClick={() => set("favorite_season", s.v)} className={`text-sm font-medium px-3 py-1.5 rounded-full transition-all ${form.favorite_season === s.v ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-sm" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>{s.e} {s.v}</button>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-stone-600">Sobre mim</label>
        <textarea value={form.bio} onChange={e => set("bio", e.target.value)} placeholder="Conta algo sobre ti e a tua quinta..." rows={3} className="w-full bg-stone-50 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300 resize-none" />
      </div>

      <button type="submit" disabled={saving || uploading} className="w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all disabled:opacity-50 active:scale-[0.98]">
        {saving ? "A guardar..." : "Guardar perfil"}
      </button>
    </form>
  );
}