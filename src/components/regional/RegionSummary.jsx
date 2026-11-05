import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Settings2, Globe2 } from 'lucide-react';
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import { getClimateProfile } from '@/lib/regionalClimate';
import { getCountryName } from '@/lib/regionalPreferences';
import { regionalMessage } from '@/lib/regionalMessages';

export default function RegionSummary() {
  const { preferences } = useRegionalPreferences();
  const profile = getClimateProfile(preferences);
  const t = key => regionalMessage(key, preferences.language);

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-white via-emerald-50/40 to-white px-4 py-3 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-200">
          <MapPin className="h-4.5 w-4.5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-xs sm:text-sm font-extrabold text-stone-800">
            {preferences.locality || preferences.region} · {getCountryName(preferences.countryCode, preferences.language)}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-stone-500">
            <Globe2 className="h-3 w-3 text-emerald-600 shrink-0" />
            <span className="truncate">
              {t(profile.climateKey || profile.id || 'unknown')} · {t(profile.hemisphere || 'unknown')}
            </span>
          </p>
        </div>
      </div>
      <Link
        to="/definicoes"
        aria-label={t('configure')}
        title={t('configure')}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 px-3 py-2 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-100 active:scale-95"
      >
        <Settings2 className="h-4 w-4 text-emerald-700" />
        <span className="hidden sm:inline">{t('configure')}</span>
      </Link>
    </div>
  );
}
