import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Settings2 } from 'lucide-react';
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import { getClimateProfile } from '@/lib/regionalClimate';
import { getCountryName } from '@/lib/regionalPreferences';
import { regionalMessage } from '@/lib/regionalMessages';

export default function RegionSummary() {
  const { preferences } = useRegionalPreferences();
  const profile = getClimateProfile(preferences);
  const t = key => regionalMessage(key,preferences.language);
  return <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm"><div className="flex min-w-0 items-center gap-3"><span className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><MapPin className="h-4 w-4" /></span><div className="min-w-0"><p className="truncate text-xs font-bold text-stone-800">{preferences.locality||preferences.region} · {getCountryName(preferences.countryCode,preferences.language)}</p><p className="mt-0.5 text-[10px] text-stone-500">{t(profile.climateKey||profile.id||'unknown')} · {t(profile.hemisphere||'unknown')}</p></div></div><Link to="/definicoes" aria-label={t('configure')} title={t('configure')} className="shrink-0 rounded-lg bg-stone-50 p-2 text-stone-500 transition-colors hover:bg-emerald-50 hover:text-emerald-800"><Settings2 className="h-4 w-4" /></Link></div>;
}
