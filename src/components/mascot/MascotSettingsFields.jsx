import React from 'react';
import { translate } from '@/lib/i18n';
import MascotAvatar from './MascotAvatar';

export default function MascotSettingsFields({ value = {}, onChange, language = 'pt-PT' }) {
  const t = (key) => translate(key, language);
  const update = (patch) => onChange?.({ ...value, ...patch });
  return <fieldset className="space-y-5 min-w-0">
    <legend className="text-base font-bold text-stone-800 mb-1">{t('mascot.settings.title')}</legend>
    <p className="text-sm text-stone-500">{t('mascot.settings.subtitle')}</p>
    <label className="block text-sm font-semibold text-stone-700">{t('mascot.settings.name')}
      <input value={value.name || ''} maxLength={40} onChange={event => update({ name: event.target.value })} placeholder={t('mascot.settings.namePlaceholder')} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"/>
    </label>
    <div role="group" aria-label={t('mascot.settings.species')} className="grid grid-cols-3 gap-2">
      {['sprout','fox','bunny'].map(species => <button key={species} type="button" aria-pressed={(value.species || 'sprout') === species} onClick={() => update({ species })} className={`min-w-0 rounded-2xl border-2 p-2 text-center transition-colors ${(value.species || 'sprout') === species ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100' : 'border-stone-200 bg-white hover:border-emerald-300'}`}>
        <MascotAvatar species={species} accessory={value.accessory || 'none'} className="mx-auto max-w-[100px]"/>
        <span className="block text-xs font-semibold text-stone-700">{t(`mascot.species.${species}`)}</span>
      </button>)}
    </div>
    <div>
      <p className="text-sm font-semibold text-stone-700 mb-2">{t('mascot.settings.accessory')}</p>
      <div role="group" aria-label={t('mascot.settings.accessory')} className="flex flex-wrap gap-2">
        {['none','flower','hat','bow'].map(accessory => <button key={accessory} type="button" aria-pressed={(value.accessory || 'none') === accessory} onClick={() => update({ accessory })} className={`rounded-full border px-3 py-2 text-xs font-semibold ${(value.accessory || 'none') === accessory ? 'bg-emerald-700 border-emerald-700 text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-300'}`}>{t(`mascot.accessory.${accessory}`)}</button>)}
      </div>
    </div>
    <label className="flex items-center gap-3 rounded-xl bg-stone-50 p-3 text-sm text-stone-600">
      <input type="checkbox" checked={value.enabled !== false} onChange={event => update({enabled:event.target.checked})} className="h-4 w-4 accent-emerald-700"/>{t('mascot.settings.enabled')}
    </label>
    <p className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs leading-relaxed text-emerald-800">{t('mascot.settings.progressHint')}</p>
  </fieldset>;
}
