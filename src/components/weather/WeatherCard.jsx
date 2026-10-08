import React, { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, CloudSun, CloudRain, Snowflake, CloudLightning, Sun, Wind, Droplets, MapPin, RefreshCw, AlertTriangle, Loader2, ChevronDown } from 'lucide-react';
import { useWeather } from '@/lib/WeatherContext.jsx';
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext.jsx';
import { useI18n } from '@/lib/I18nContext';
import { getWeatherAdvice, isWeatherUsable, localDateKey, weatherCoordinates } from '@/lib/weather.js';
function condition(symbol = '') {
  if (symbol.includes('thunder')) return {
    Icon: CloudLightning,
    key: 'thunder'
  };
  if (symbol.includes('snow') || symbol.includes('sleet')) return {
    Icon: Snowflake,
    key: 'snow'
  };
  if (symbol.includes('rain')) return {
    Icon: CloudRain,
    key: 'rain'
  };
  if (symbol.includes('fog')) return {
    Icon: Cloud,
    key: 'fog'
  };
  if (symbol.includes('clearsky')) return {
    Icon: Sun,
    key: 'sun'
  };
  if (symbol.includes('cloud')) return {
    Icon: CloudSun,
    key: 'cloud'
  };
  return {
    Icon: CloudSun,
    key: 'forecast'
  };
}
export default function WeatherCard({
  compact = false
}) {
  const {
    preferences
  } = useRegionalPreferences();
  const {
    weather,
    loading,
    error,
    refresh
  } = useWeather();
  const {
    t: i18nT,
    locale
  } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const detailsId = useId();
  const timeZone = preferences.timeZone || 'UTC';
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1
  });
  const dateTime = value => new Intl.DateTimeFormat(locale, {
    timeZone,
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
  const today = localDateKey(new Date(), timeZone);
  const tomorrow = localDateKey(new Date(Date.now() + 24 * 60 * 60 * 1000), timeZone);
  const valid = isWeatherUsable(weather);
  const advice = getWeatherAdvice(weather, preferences);
  const location = [preferences.locality, preferences.region].filter(Boolean).join(' · ');
  const days = weather?.days?.slice(0, compact ? 3 : 4) || [];
  const label = !preferences.weatherEnabled ? 'weather.disabled' : !weatherCoordinates(preferences) ? 'weather.locationRequired' : loading ? 'weather.loading' : 'weather.unavailable';
  const firstDay = days[0];
  const { Icon: SummaryIcon, key: summaryCondition } = condition(firstDay?.symbol || '');
  const dayLabel = date => date === today ? i18nT('weather.today') : date === tomorrow ? i18nT('weather.tomorrow') : new Intl.DateTimeFormat(locale, {
    weekday: 'short', timeZone: 'UTC'
  }).format(new Date(date + 'T12:00:00Z'));
  const statusKey = !preferences.weatherEnabled ? 'weather.disabledShort' : !weatherCoordinates(preferences) ? 'weather.locationRequiredShort' : loading && !weather ? 'weather.loading' : !weather ? 'weather.unavailableShort' : !valid ? weather.offline || error === 'offline' ? 'weather.offline' : 'weather.stale' : null;
  return <section className="overflow-hidden rounded-2xl border border-emerald-200/80 bg-white shadow-sm" aria-label={i18nT('weather.title')}>
      <div className="flex items-center gap-3 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 px-4 py-3 sm:px-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/60 bg-white text-emerald-700 shadow-sm">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <SummaryIcon className="h-6 w-6" aria-label={weather ? i18nT(`weather.${summaryCondition}`) : undefined} aria-hidden={!weather} />}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-bold text-stone-800">{i18nT('weather.title')}</h2>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500" title={location || undefined}>
            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" /><span className="truncate">{location || i18nT('weather.subtitle')}</span>
          </p>
          {statusKey && <p role="status" title={i18nT(statusKey)} className={`mt-1 flex items-center gap-1 text-[10px] leading-tight ${weather && !valid || error ? 'text-amber-800' : 'text-stone-500'}`}>
            {weather && !valid && <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />}<span className="truncate">{i18nT(statusKey)}</span>
          </p>}
        </div>
        {firstDay && <div className="shrink-0 text-right" title={i18nT('weather.estimatedRange')}>
          <p className="whitespace-nowrap text-xl font-bold leading-tight text-emerald-900">{Math.round(firstDay.maxTemp)}° <span className="text-sm font-medium text-stone-400">{Math.round(firstDay.minTemp)}°</span></p>
          <p className="mt-0.5 text-[10px] font-medium capitalize text-stone-500">{dayLabel(firstDay.date)}</p>
        </div>}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-emerald-100/70 px-4 py-1 sm:px-5">
        {weather ? <span className="min-w-0 text-[10px] text-stone-400"><a href="https://www.met.no/en" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-700">MET Norway</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-emerald-700">CC BY 4.0</a></span> : <Link to="/definicoes" className="text-xs font-medium text-emerald-700 underline decoration-emerald-200 underline-offset-4">{i18nT('weather.configure')}</Link>}
        <button type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls={detailsId} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
          {i18nT(expanded ? 'weather.collapse' : 'weather.expand')}<ChevronDown className={`h-4 w-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>
      <div id={detailsId} hidden={!expanded} className="border-t border-stone-100">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
          <h3 className="text-xs font-bold text-stone-600">{i18nT('weather.details')}</h3>
          {preferences.weatherEnabled && weatherCoordinates(preferences) && <button type="button" onClick={refresh} disabled={loading} title={i18nT('weather.refresh')} aria-label={i18nT('weather.refresh')} className="rounded-xl p-2 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>}
        </div>
      {!weather ? <div className="px-5 py-6"><p className="flex items-start gap-2 text-sm leading-relaxed text-stone-600">{loading && <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />}{i18nT(label)}</p></div> : <div className="space-y-4 p-4 sm:p-5">
        {!valid && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3" role="status"><p className="flex items-center gap-2 text-sm font-semibold text-amber-900"><AlertTriangle className="h-4 w-4" />{i18nT(weather.offline || error === 'offline' ? 'weather.offline' : 'weather.stale')}</p><p className="mt-1 text-xs leading-relaxed text-amber-900">{i18nT('weather.staleAdvice')}</p></div>}
        <div className={`grid gap-2 ${days.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
          {days.map(day => {
          const {
            Icon,
            key
          } = condition(day.symbol || '');
          const name = day.date === today ? i18nT('weather.today') : day.date === tomorrow ? i18nT('weather.tomorrow') : new Intl.DateTimeFormat(locale, {
            weekday: 'short',
            timeZone: 'UTC'
          }).format(new Date(day.date + 'T12:00:00Z'));
          return <div key={day.date} className="min-w-0 rounded-2xl bg-stone-50 px-2 py-3 text-center">
              <p className="text-xs font-semibold capitalize text-stone-600">{name}</p><Icon className="mx-auto my-2 h-7 w-7 text-emerald-700" aria-label={i18nT(`weather.${key}`)} />
              <p className="whitespace-nowrap text-sm font-bold text-stone-800" title={i18nT('weather.estimatedRange')}>{Math.round(day.maxTemp)}° <span className="font-normal text-stone-400">{Math.round(day.minTemp)}°</span></p>
              {day.maxWind !== null && <p className="mt-1 flex items-center justify-center gap-1 text-[10px] text-stone-500"><Wind className="h-3 w-3" aria-label={i18nT('weather.wind')} />{Math.round(day.maxWind * 3.6)} km/h</p>}
              {day.isPartial && <p className="mt-1 text-[9px] text-amber-700">{i18nT('weather.partial')}</p>}
            </div>;
        })}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[[weather.next6h, 'weather.next6'], [weather.next24h, 'weather.next24']].map(([window, key]) => <div key={key} className="rounded-2xl border border-sky-100 bg-sky-50/60 p-3"><p className="flex items-center gap-1.5 text-[11px] font-medium text-sky-900"><Droplets className="h-3.5 w-3.5 shrink-0" />{i18nT(key)}</p><p className="mt-1 text-lg font-bold text-sky-950">{window?.complete ? `${formatter.format(window.precipitationMm)} mm` : '—'}</p>{!window?.complete && <p className="text-[10px] text-sky-800">{i18nT('weather.incomplete')}</p>}</div>)}
        </div>
        {weather.next6h?.start && <p className="-mt-2 text-[10px] text-stone-500">{i18nT('weather.from', {
          time: new Intl.DateTimeFormat(locale, {
            timeZone,
            hour: '2-digit',
            minute: '2-digit'
          }).format(new Date(weather.next6h.start))
        })}</p>}
        {advice.length > 0 && <div className="space-y-2">{advice.slice(0, compact ? 2 : 5).map(item => <div key={item.kind} className={`rounded-2xl border p-3 ${item.severity === 'warning' ? 'border-amber-200 bg-amber-50/70' : 'border-emerald-100 bg-emerald-50/70'}`}><p className="text-xs font-bold text-stone-800">{i18nT(item.titleKey)}</p><p className="mt-1 text-xs leading-relaxed text-stone-600">{i18nT(item.bodyKey, item.vars)}</p></div>)}</div>}
        <p className="text-[10px] text-stone-500">{i18nT('weather.updated', {
          date: dateTime(weather.updatedAt)
        })}</p>
      </div>}
        {weather && <div className="border-t border-stone-100 px-4 py-3 sm:px-5"><Link to="/definicoes" className="text-xs font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-4">{i18nT('weather.changeLocation')}</Link></div>}
      </div>
    </section>;
}
