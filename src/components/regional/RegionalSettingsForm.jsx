import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CloudSun, Globe2, Languages, Loader2, LocateFixed, MapPin, ShieldCheck, Sprout } from 'lucide-react';
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import { readRegionalPreferences, LANGUAGES, getCountryName, getCountryOptions, hasCoordinates, validTimeZone } from '@/lib/regionalPreferences';
import { loadLocations, nearestLocation, searchLocations } from '@/lib/locationSearch';
import { regionalMessage } from '@/lib/regionalMessages';
import { localAuth } from '@/lib/localStorageStore';
import { readAppearance } from '@/lib/appearance';
import { useAppearance } from '@/lib/AppearanceContext';
import { readFarmProfile, sanitizeFarmProfile } from '@/lib/farmProfile';
import { readMascotState, writeMascotSettings } from '@/lib/mascot';
import MascotSettingsFields from '@/components/mascot/MascotSettingsFields';
import FarmProfileFields from './FarmProfileFields';
import AppearanceFields from './AppearanceFields';
import SyncBackupModal from '@/components/quinta/SyncBackupModal';

const fieldClass = 'w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm text-stone-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100';
const labelClass = 'mb-2 block text-xs font-bold uppercase tracking-wide text-stone-600';
const mascotStorageMessages = {
  'pt-PT': 'Não foi possível ler os dados da mascote. A cópia existente foi mantida e não será substituída ao guardar. Podes guardar as restantes definições e tentar novamente mais tarde.',
  'pt-BR': 'Não foi possível ler os dados da mascote. A cópia existente foi mantida e não será substituída ao salvar. Você pode salvar as outras configurações e tentar novamente mais tarde.',
  en: 'The pet data could not be read. The existing copy has been kept and will not be replaced when saving. You can save your other settings and try again later.',
  es: 'No se pudieron leer los datos de la mascota. Se conserva la copia existente y no se sustituirá al guardar. Puedes guardar los demás ajustes e intentarlo de nuevo más tarde.',
};
const mascotRetryMessages = { 'pt-PT': 'Tentar novamente', 'pt-BR': 'Tentar novamente', en: 'Try again', es: 'Intentar de nuevo' };
function readMascotEditor() {
  try { return { settings: readMascotState().settings, failed: false }; }
  catch { return { settings: null, failed: true }; }
}

export default function RegionalSettingsForm({ onboarding = false }) {
  const { preferences, savePreferences, storageError } = useRegionalPreferences();
  const [draft, setDraft] = useState(preferences);
  const { appearance, saveAppearance } = useAppearance();
  const [appearanceDraft, setAppearanceDraft] = useState(appearance);
  const [mascotEditor, setMascotEditor] = useState(readMascotEditor);
  const [profile, setProfile] = useState(readFarmProfile);
  const [saving, setSaving] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [step, setStep] = useState(0);
  const [locations, setLocations] = useState([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState(false);
  const [query, setQuery] = useState(preferences.locality);
  const [selectedLocation, setSelectedLocation] = useState(hasCoordinates(preferences));
  const [geoBusy, setGeoBusy] = useState(false);
  const [gpsNote, setGpsNote] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [latitudeInput, setLatitudeInput] = useState(preferences.latitude?.toString() || '');
  const [longitudeInput, setLongitudeInput] = useState(preferences.longitude?.toString() || '');
  const [timeZoneInput, setTimeZoneInput] = useState(preferences.timeZone);
  const alive = useRef(true);
  const t = (key, vars) => regionalMessage(key, draft.language, vars);
  const countries = useMemo(() => getCountryOptions(draft.language), [draft.language]);
  const results = useMemo(() => searchLocations(locations, query, draft.countryCode), [locations, query, draft.countryCode]);
  const timeZones = useMemo(() => typeof Intl.supportedValuesOf === 'function' ? ['UTC', ...Intl.supportedValuesOf('timeZone')] : [draft.timeZone, 'UTC'], [draft.timeZone]);
  const patch = value => { setDraft(current => ({ ...current, ...value })); setError(''); setSaved(false); };

  useEffect(() => {
    const restored = () => { const next = readRegionalPreferences(); setDraft(next); setAppearanceDraft(readAppearance()); setMascotEditor(readMascotEditor()); setProfile(readFarmProfile()); setQuery(next.locality); setSelectedLocation(hasCoordinates(next)); };
    window.addEventListener('hortaviva_remote_updated', restored);
    return () => window.removeEventListener('hortaviva_remote_updated', restored);
  }, []);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    if (onboarding && step !== 1) return;
    let active = true;
    setPlacesLoading(true);
    loadLocations().then(data => { if (active) { setLocations(data); setPlacesError(false); } }).catch(() => { if (active) setPlacesError(true); }).finally(() => { if (active) setPlacesLoading(false); });
    return () => { active = false; };
  }, [step, onboarding]);

  const chooseCity = city => {
    patch({ countryCode: city.countryCode, region: city.region || city.name, locality: city.name, latitude: city.latitude, longitude: city.longitude, timeZone: city.timeZone, weatherEnabled: true });
    setQuery(city.name); setSelectedLocation(true); setGpsNote('');
    setLatitudeInput(String(city.latitude)); setLongitudeInput(String(city.longitude)); setTimeZoneInput(city.timeZone);
  };

  const locate = () => {
    if (!navigator.geolocation) { setError(t('geoUnsupported')); return; }
    setGeoBusy(true); setError('');
    navigator.geolocation.getCurrentPosition(async position => {
      const latitude = Math.round(position.coords.latitude * 100) / 100;
      const longitude = Math.round(position.coords.longitude * 100) / 100;
      let nearest = null;
      try { nearest = nearestLocation(await loadLocations(), latitude, longitude); } catch { /* Coordinates remain usable when the local gazetteer cannot load. */ }
      if (!alive.current) return;
      const locality = nearest?.name || draft.region;
      patch({ latitude, longitude, locality, countryCode: nearest?.countryCode || draft.countryCode, region: nearest?.region || draft.region || locality, timeZone: nearest?.timeZone || draft.timeZone, weatherEnabled: true });
      setQuery(locality); setSelectedLocation(true); setGpsNote(nearest?.name || '');
      setLatitudeInput(String(latitude)); setLongitudeInput(String(longitude)); setTimeZoneInput(nearest?.timeZone || draft.timeZone); setGeoBusy(false);
    }, failure => {
      if (!alive.current) return;
      setGeoBusy(false); setError(t(failure.code === 1 ? 'geoDenied' : 'geoFailure'));
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
  };

  const applyCoordinates = () => {
    const latitude = Number(latitudeInput.replace(',', '.'));
    const longitude = Number(longitudeInput.replace(',', '.'));
    if (!latitudeInput.trim() || !longitudeInput.trim() || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180 || !validTimeZone(timeZoneInput)) { setError(t('invalidCoordinates')); return; }
    patch({ latitude: Math.round(latitude*100)/100, longitude: Math.round(longitude*100)/100, timeZone: timeZoneInput, locality: draft.locality || draft.region, weatherEnabled: true });
    setSelectedLocation(true); setGpsNote('');
  };

  const next = () => {
    if (step === 0 && !draft.region.trim()) { setError(t('regionRequired')); return; }
    if (step === 1 && draft.weatherEnabled && !hasCoordinates(draft)) { setError(t('locationRequired')); return; }
    if (step === 2 && !profile.farm_name.trim()) { setError(t('farmRequired')); return; }
    setError(''); setStep(current => Math.min(5, current + 1));
  };

  const submit = async event => {
    event.preventDefault();
    if (onboarding && step < 5) { next(); return; }
    if (!draft.region.trim()) { setError(t('regionRequired')); if (onboarding) setStep(0); return; }
    if (draft.weatherEnabled && !hasCoordinates(draft)) { setError(t('locationRequired')); if (onboarding) setStep(1); return; }
    if (!profile.farm_name.trim()) { setError(t('farmRequired')); if (onboarding) setStep(2); return; }
    setSaving(true);
    setError(''); setSaved(false);
    try {
      const cleaned = sanitizeFarmProfile(profile);
      await localAuth.updateMe({ ...cleaned, location: [draft.locality || draft.region, getCountryName(draft.countryCode,draft.language)].filter(Boolean).join(' · ') });
      saveAppearance(appearanceDraft);
      if (!mascotEditor.failed) {
        try { writeMascotSettings(mascotEditor.settings); }
        catch (failure) { setMascotEditor({ settings: null, failed: true }); throw failure; }
      }
      const result = savePreferences({ ...draft, onboarded: true });
      if (!result.persisted) { setError(t('saveFailure')); return; }
      setSaved(result.persisted);
    } catch { setError(t('saveFailure')); }
    finally { setSaving(false); }
  };

  return <div className={onboarding ? 'min-h-screen bg-[#f5f7f2] p-4 sm:p-8' : ''}>
    <div className={onboarding ? 'mx-auto grid max-w-5xl overflow-hidden rounded-[28px] border border-emerald-950/10 bg-white shadow-xl shadow-emerald-950/5 lg:grid-cols-[0.82fr_1.18fr]' : ''}>
      {onboarding && <aside className="relative overflow-hidden bg-gradient-to-br from-[#123c2b] via-[#165b38] to-[#3b6a3c] p-7 text-white sm:p-9">
        <div className="absolute -right-16 -top-14 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full border border-white/10" />
        <div className="relative">
          <div className="mb-7 flex items-center gap-3"><img src={`${import.meta.env.BASE_URL}icons/icon-192x192.png`} className="h-12 w-12 rounded-2xl" alt="Horta Viva" /><span className="text-xl font-black tracking-tight">Horta Viva</span></div>
          <span className="mb-4 inline-flex rounded-full border border-emerald-100/20 bg-white/10 px-3 py-1.5 text-xs font-semibold"><Globe2 className="mr-2 h-4 w-4" />{t('manage')}</span>
          <h1 className="max-w-sm text-3xl font-black leading-tight sm:text-4xl lg:text-[42px]">{t('welcome')}</h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-emerald-50/85">{t('welcomeBody')}</p>
          <div className="mt-7 hidden space-y-3 text-sm font-medium sm:block">{[['estimated',Sprout],['weather',CloudSun],['language',Languages]].map(([key,Icon]) => <div key={key} className="flex items-center gap-3"><Icon className="h-5 w-5 text-[#e7d7a7]" />{t(key)}</div>)}</div>
          <p className="mt-7 flex items-start gap-2 text-xs leading-relaxed text-emerald-100/75"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />{t('device')}</p>
        </div>
      </aside>}
      <form onSubmit={submit} className={onboarding ? 'p-5 sm:p-8' : 'space-y-5'}>
        {onboarding && <div className="mb-6"><p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-700">{t('step',{step:step+1})}</p><div className="flex gap-2">{[0,1,2,3,4,5].map(index => <span key={index} className={`h-1.5 flex-1 rounded-full ${index<=step?'bg-emerald-600':'bg-stone-100'}`} />)}</div></div>}
        {(!onboarding || step === 0) && <section className="space-y-5 rounded-2xl border border-stone-100 bg-white p-1 sm:p-2">
          <h2 className="flex items-center gap-2 text-xl font-bold text-stone-800"><Globe2 className="h-5 w-5 text-emerald-700" />{t('place')}</h2>
          {onboarding&&<button type="button" onClick={()=>setShowSync(true)} className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm font-bold text-emerald-900">{t('restoreGoogle')}</button>}
          <div><label htmlFor="regional-language" className={labelClass}>{t('language')}</label><select id="regional-language" className={fieldClass} value={draft.language} onChange={event=>patch({language:event.target.value})}>{LANGUAGES.map(language=><option key={language.code} value={language.code}>{language.label}</option>)}</select></div>
          <div><label htmlFor="regional-country" className={labelClass}>{t('country')}</label><select id="regional-country" className={fieldClass} value={draft.countryCode} onChange={event=>{patch({countryCode:event.target.value,region:'',locality:'',latitude:null,longitude:null,weatherEnabled:false});setQuery('');setSelectedLocation(false);setGpsNote('');}}>{countries.map(country=><option key={country.code} value={country.code}>{country.name}</option>)}</select></div>
          <div><label htmlFor="regional-region" className={labelClass}>{t('region')}</label><input id="regional-region" maxLength={150} className={fieldClass} value={draft.region} onChange={event=>patch({region:event.target.value})} placeholder={t('regionPlaceholder')} autoComplete="address-level1" /><p className="mt-2 text-xs leading-relaxed text-stone-500">{t('regionTip')}</p></div>
          {!draft.language.startsWith('pt') && <p className="rounded-xl bg-stone-50 p-3 text-xs leading-relaxed text-stone-500">{t('libraryNote')}</p>}
        </section>}
        {(!onboarding || step === 1) && <section className="space-y-4 rounded-2xl border border-stone-100 bg-white p-1 sm:p-2">
          <h2 className="flex items-center gap-2 text-xl font-bold text-stone-800"><CloudSun className="h-5 w-5 text-emerald-700" />{t('weather')}</h2>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-emerald-50 p-3.5 text-sm font-semibold text-emerald-900">{t('enableWeather')}<input type="checkbox" className="h-5 w-5 accent-emerald-700" checked={draft.weatherEnabled} onChange={event=>patch({weatherEnabled:event.target.checked})} /></label>
          <p className="text-xs leading-relaxed text-stone-500">{t('weatherPrivacy')}</p>
          <button type="button" onClick={locate} disabled={geoBusy} className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-60">{geoBusy?<Loader2 className="h-4 w-4 animate-spin" />:<LocateFixed className="h-4 w-4" />}{t(geoBusy?'locating':'useLocation')}</button>
          <div><label htmlFor="regional-place-search" className={labelClass}>{t('manual')}</label><input id="regional-place-search" className={fieldClass} placeholder={t('searchPlaceholder')} value={query} autoComplete="off" onChange={event=>{setQuery(event.target.value);setSelectedLocation(false);setGpsNote('');patch({latitude:null,longitude:null,locality:''});}} /><p className="mt-2 text-xs leading-relaxed text-stone-500">{t('searchHint')}</p>
            {placesLoading&&<p className="mt-2 flex items-center gap-2 text-xs text-stone-500"><Loader2 className="h-3 w-3 animate-spin" />{t('loadingPlaces')}</p>}
            {placesError&&<p className="mt-2 text-xs text-amber-800">{t('placeFailure')}</p>}
            {!selectedLocation&&query.trim().length>=2&&!placesLoading&&<div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-stone-200">{results.length?results.map((city,index)=><button type="button" key={`${city.name}-${city.latitude}-${index}`} onClick={()=>chooseCity(city)} className="flex w-full items-center gap-3 border-b border-stone-100 px-3 py-3 text-left last:border-0 hover:bg-emerald-50"><MapPin className="h-4 w-4 shrink-0 text-emerald-700" /><span className="min-w-0"><span className="block text-sm font-semibold text-stone-800">{city.name}</span><span className="block text-xs text-stone-500">{city.region} · {getCountryName(city.countryCode,draft.language)}</span></span></button>):<p className="p-3 text-xs text-stone-500">{t('noPlaces')}</p>}</div>}
          </div>
          {hasCoordinates(draft)&&<div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3.5"><p className="flex items-center gap-2 text-sm font-bold text-emerald-900"><CheckCircle2 className="h-4 w-4" />{draft.locality||t('approximate')}</p><p className="mt-1 text-xs text-emerald-800">{draft.latitude.toFixed(2)}, {draft.longitude.toFixed(2)} · {draft.timeZone}</p>{gpsNote&&<p className="mt-2 text-xs leading-relaxed text-stone-600">{t('nearest',{place:gpsNote})}</p>}<button type="button" className="mt-2 text-xs font-semibold text-stone-600 underline" onClick={()=>{patch({latitude:null,longitude:null,locality:'',weatherEnabled:false});setQuery('');setSelectedLocation(false);setGpsNote('');}}>{t('remove')}</button></div>}
          <details className="rounded-xl border border-stone-200 p-3"><summary className="cursor-pointer text-xs font-semibold text-stone-600">{t('coords')}</summary><div className="mt-3 grid grid-cols-2 gap-3"><label className="text-xs text-stone-600">{t('latitude')}<input aria-label={t('latitude')} className={`${fieldClass} mt-1`} inputMode="decimal" value={latitudeInput} onChange={event=>setLatitudeInput(event.target.value)} placeholder="38.72" /></label><label className="text-xs text-stone-600">{t('longitude')}<input aria-label={t('longitude')} className={`${fieldClass} mt-1`} inputMode="decimal" value={longitudeInput} onChange={event=>setLongitudeInput(event.target.value)} placeholder="-9.14" /></label><label className="col-span-2 text-xs text-stone-600">{t('timezone')}<select className={`${fieldClass} mt-1`} value={timeZoneInput} onChange={event=>setTimeZoneInput(event.target.value)}>{[...new Set([timeZoneInput,...timeZones])].map(zone=><option key={zone} value={zone}>{zone}</option>)}</select></label><button type="button" className="col-span-2 rounded-xl bg-stone-100 px-3 py-2.5 text-xs font-bold text-stone-700" onClick={applyCoordinates}>{t('applyCoordinates')}</button></div></details>
          <a href="https://www.geonames.org/" target="_blank" rel="noreferrer" className="inline-block text-[10px] text-stone-400 underline">{t('localSource')}</a>
        </section>}
        {(!onboarding || step === 2) && <FarmProfileFields profile={profile} onChange={setProfile} language={draft.language} />}
        {(!onboarding || step === 3) && <section className="space-y-5 rounded-2xl border border-stone-100 bg-white p-1 sm:p-2">
          <h2 className="flex items-center gap-2 text-xl font-bold text-stone-800"><Sprout className="h-5 w-5 text-emerald-700" />{t('cultivation')}</h2>
          <div><label htmlFor="regional-climate" className={labelClass}>{t('climate')}</label><select id="regional-climate" className={fieldClass} value={draft.climate} onChange={event=>patch({climate:event.target.value})}>{['auto','mediterranean','temperate','continental','tropical','arid'].map(climate=><option key={climate} value={climate}>{t(climate)}</option>)}</select><p className="mt-2 text-xs leading-relaxed text-stone-500">{t('climateHint')}</p></div>
          <fieldset><legend className={labelClass}>{t('environment')}</legend><div className="grid gap-2 sm:grid-cols-3">{['outdoor','greenhouse','container'].map(environment=><label key={environment} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs font-semibold ${draft.growingEnvironment===environment?'border-emerald-500 bg-emerald-50 text-emerald-900':'border-stone-200 text-stone-600'}`}><input type="radio" name="regional-environment" className="accent-emerald-700" value={environment} checked={draft.growingEnvironment===environment} onChange={()=>patch({growingEnvironment:environment})} />{t(environment)}</label>)}</div><p className="mt-2 text-xs leading-relaxed text-stone-500">{t('environmentHint')}</p></fieldset>
          {(draft.climate==='tropical'||(draft.climate==='auto'&&hasCoordinates(draft)&&Math.abs(draft.latitude)<23.5))&&<fieldset><legend className={labelClass}>{t('wetMonths')}</legend><div className="grid grid-cols-4 gap-2 sm:grid-cols-6">{Array.from({length:12},(_,index)=>index+1).map(month=><button type="button" key={month} aria-pressed={draft.wetSeasonMonths.includes(month)} onClick={()=>patch({wetSeasonMonths:draft.wetSeasonMonths.includes(month)?draft.wetSeasonMonths.filter(value=>value!==month):[...draft.wetSeasonMonths,month]})} className={`rounded-lg px-2 py-2 text-xs font-semibold ${draft.wetSeasonMonths.includes(month)?'bg-emerald-700 text-white':'bg-stone-100 text-stone-600'}`}>{new Intl.DateTimeFormat(draft.language,{month:'short',timeZone:'UTC'}).format(new Date(Date.UTC(2026,month-1,15)))}</button>)}</div><p className="mt-2 text-xs leading-relaxed text-stone-500">{t('wetHint')}</p></fieldset>}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4"><p className="text-sm font-bold text-amber-950">{t('estimated')}</p><p className="mt-1.5 text-xs leading-relaxed text-amber-900/80">{t('estimateBody')}</p></div>
        </section>}
        {(!onboarding || step === 4) && <AppearanceFields value={appearanceDraft} onChange={setAppearanceDraft} language={draft.language} />}
        {(!onboarding || step === 5) && <section id="mascote" className="scroll-mt-24">{mascotEditor.failed ? <div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"><p>{mascotStorageMessages[draft.language] || mascotStorageMessages['pt-PT']}</p><button type="button" disabled={saving} onClick={() => { setMascotEditor(readMascotEditor()); setSaved(false); }} className="mt-3 rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs font-bold disabled:opacity-60">{mascotRetryMessages[draft.language] || mascotRetryMessages['pt-PT']}</button></div> : <MascotSettingsFields value={mascotEditor.settings} onChange={value => { setMascotEditor({ settings: value, failed: false }); setError(''); setSaved(false); }} language={draft.language} />}</section>}
        {error&&<p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {storageError&&<p role="alert" className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{t('storageError')}</p>}
        {saved&&<p role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-900"><Check className="h-4 w-4" />{t('saved')}</p>}
        <div className="mt-6 flex items-center gap-3 border-t border-stone-100 pt-5">
          {onboarding&&step>0&&<button type="button" disabled={saving} onClick={()=>{setStep(value=>value-1);setError('');}} className="flex items-center gap-1 rounded-xl border border-stone-200 px-3 py-3 text-sm font-semibold text-stone-600 disabled:opacity-60"><ArrowLeft className="h-4 w-4" />{t('back')}</button>}
          <button type="submit" disabled={geoBusy||saving} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-900 disabled:opacity-60">{saving?<Loader2 className="h-4 w-4 animate-spin" />:t(onboarding?(step<5?'continue':'start'):'save')}<ArrowRight className="h-4 w-4 shrink-0" /></button>
        </div>
        {onboarding&&step===1&&draft.weatherEnabled&&!hasCoordinates(draft)&&<button type="button" className="mt-3 w-full text-center text-xs font-semibold text-stone-500 underline" onClick={()=>{patch({weatherEnabled:false});setStep(2);}}>{t('noWeather')}</button>}
      </form>
      <SyncBackupModal isOpen={showSync} onClose={()=>setShowSync(false)} />
    </div>
  </div>;
}
