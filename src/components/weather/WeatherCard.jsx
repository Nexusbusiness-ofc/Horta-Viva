import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud, CloudSun, CloudRain, Snowflake, CloudLightning, Sun, Wind, Droplets, MapPin, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
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
  return <section className="overflow-hidden rounded-3xl border border-emerald-200/80 bg-white shadow-sm" aria-label={i18nT('weather.title')}>
      <div className="flex items-start justify-between gap-3 bg-emerald-950 px-4 py-4 text-white sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-2xl bg-white/10 p-2.5"><CloudSun className="h-6 w-6 text-lime-200" /></div>
          <div className="min-w-0"><h2 className="text-base font-bold">{i18nT('weather.title')}</h2>
            <p className="mt-1 flex items-center gap-1 text-xs text-emerald-100"><MapPin className="h-3 w-3 shrink-0" /><span className="break-words">{location || i18nT('weather.subtitle')}</span></p>
          </div>
        </div>
        {preferences.weatherEnabled && weatherCoordinates(preferences) && <button onClick={refresh} disabled={loading} title={i18nT('weather.refresh')} aria-label={i18nT('weather.refresh')} className="rounded-xl p-2 text-emerald-100 hover:bg-white/10 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /></button>}
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
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 px-4 py-3 sm:px-5">
        <Link to="/definicoes" className="text-xs font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-4">{i18nT(weather ? 'weather.changeLocation' : 'weather.configure')}</Link>
        {weather && <span className="text-[10px] text-stone-500"><a href="https://www.met.no/en" target="_blank" rel="noreferrer" className="underline">MET Norway</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline">CC BY 4.0</a></span>}
      </div>
    </section>;
}
