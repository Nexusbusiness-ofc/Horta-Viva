import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Droplets, Heart, Sprout } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';
import MascotAvatar from './MascotAvatar';
import useMascotFarm from './useMascotFarm';

export default function MascotHomeCard() {
  const { t } = useI18n();
  const { view, hydration, loading, error, refresh } = useMascotFarm();
  if (loading) return <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 text-sm text-stone-500" role="status">{t('mascot.loading')}</div>;
  if (error || !view) return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><p>{t('mascot.storageError')}</p><button type="button" onClick={refresh} className="mt-2 font-bold underline">{t('mascot.retry')}</button></div>;
  const enabled = view.settings.enabled !== false;
  return <Link to={enabled ? '/mascote' : '/mascote#armazem'} className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-[#f0f5e5] via-white to-[#fbf4e5] p-3.5 shadow-sm transition-shadow hover:shadow-md">
    <div className="w-[78px] shrink-0 rounded-2xl bg-white/50">{enabled ? <MascotAvatar {...view.settings} level={view.level} evolutionStage={view.evolutionStage} mood={view.fullness < 35 ? 'hungry' : 'happy'}/> : <Sprout className="m-5 h-9 w-9 text-emerald-600"/>}</div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold uppercase tracking-[.15em] text-emerald-700">{t('mascot.yourCompanion')}</p>
      <h3 className="truncate text-base font-black text-stone-800">{view.settings.name || t('mascot.defaultName')} <span className="text-xs font-semibold text-stone-500">· {t('mascot.level',{level:view.level})}</span></h3>
      {enabled ? <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-stone-600"><span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-rose-400"/>{view.fullness}/100</span><span className="flex items-center gap-1"><Droplets className="h-3.5 w-3.5 text-sky-500"/>{hydration.hydration}/100</span></div> : <p className="mt-1 text-xs text-stone-500">{t('mascot.disabledTitle')}</p>}
    </div>
    <ArrowUpRight className="h-5 w-5 shrink-0 text-emerald-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"/>
  </Link>;
}
