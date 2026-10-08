import React from 'react';
import { Sprout } from 'lucide-react';
import { FARMER_TYPES, FAVORITE_SEASONS, PROFILE_EMOJIS } from '@/lib/farmProfile';
import { translate } from '@/lib/i18n';
import { regionalMessage } from '@/lib/regionalMessages';
const inputClass = 'w-full rounded-xl border border-stone-200 bg-white px-3.5 py-3 text-sm text-stone-800 outline-none focus:ring-2 focus:ring-emerald-200';
export default function FarmProfileFields({ profile, onChange, language }) {
  const t = key => regionalMessage(key,language);
  const patch = (key,value) => onChange({ ...profile, [key]:value });
  return <section className="space-y-5 p-1 sm:p-2">
    <div><h2 className="flex items-center gap-2 text-xl font-bold text-stone-800"><Sprout className="h-5 w-5 text-emerald-700" />{t('farmProfile')}</h2><p className="mt-2 text-sm leading-relaxed text-stone-500">{t('profileIntro')}</p></div>
    <fieldset><legend className="mb-2 text-xs font-bold text-stone-600">{t('avatar')}</legend><div className="flex flex-wrap gap-2">{PROFILE_EMOJIS.map(emoji=><button type="button" key={emoji} aria-label={emoji} aria-pressed={profile.avatar_emoji===emoji} onClick={()=>patch('avatar_emoji',emoji)} className={`rounded-xl border p-2 text-2xl ${profile.avatar_emoji===emoji?'border-emerald-600 bg-emerald-50':'border-stone-200'}`}>{emoji}</button>)}</div></fieldset>
    {[['farm_name','farmName',100],['full_name','yourName',100]].map(([key,label,max])=><label key={key} className="block space-y-2 text-xs font-bold text-stone-600">{t(label)}<input className={inputClass} value={profile[key]||''} maxLength={max} onChange={event=>patch(key,event.target.value)} autoComplete={key==='full_name'?'name':'off'} /></label>)}
    <div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-xs font-bold text-stone-600">{t('experience')}<input type="number" min="0" max="100" step="1" className={inputClass} value={profile.experience_years} onChange={event=>patch('experience_years',event.target.value)} /></label><label className="space-y-2 text-xs font-bold text-stone-600">{t('farmerType')}<select className={inputClass} value={profile.farmer_type} onChange={event=>patch('farmer_type',event.target.value)}>{FARMER_TYPES.map(value=><option key={value} value={value}>{translate(value,language)}</option>)}</select></label></div>
    <label className="block space-y-2 text-xs font-bold text-stone-600">{t('favoriteSeason')}<select className={inputClass} value={profile.favorite_season} onChange={event=>patch('favorite_season',event.target.value)}>{FAVORITE_SEASONS.map(value=><option key={value} value={value}>{translate(value,language)}</option>)}</select></label>
    <label className="block space-y-2 text-xs font-bold text-stone-600">{t('favoriteCrops')}<input className={inputClass} value={profile.favorite_crops||''} maxLength={300} onChange={event=>patch('favorite_crops',event.target.value)} /></label>
    <label className="block space-y-2 text-xs font-bold text-stone-600">{t('gardenGoal')}<textarea rows="3" className={inputClass} value={profile.bio||''} maxLength={500} onChange={event=>patch('bio',event.target.value)} /></label>
  </section>;
}
