import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Droplets, Heart, Sprout, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';
import MascotAvatar from './MascotAvatar';
import useMascotFarm from './useMascotFarm';

export default function MascotHomeCard() {
  const { t } = useI18n();
  const { view, hydration, loading, error, refresh } = useMascotFarm();

  if (loading) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 text-sm text-stone-500" role="status">
        {t('mascot.loading')}
      </div>
    );
  }
  if (error || !view) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p>{t('mascot.storageError')}</p>
        <button type="button" onClick={refresh} className="mt-2 font-bold underline">
          {t('mascot.retry')}
        </button>
      </div>
    );
  }

  const enabled = view.settings.enabled !== false;
  const fullnessPct = Math.max(0, Math.min(100, Number(view.fullness) || 0));
  const hydrationPct = Math.max(0, Math.min(100, Number(hydration?.hydration) || 0));

  return (
    <Link
      to={enabled ? '/mascote' : '/mascote#armazem'}
      className="group relative flex items-center gap-3.5 overflow-hidden rounded-3xl border border-emerald-200/90 bg-gradient-to-r from-[#eef7ec] via-white to-[#fdf5e6] p-3.5 sm:p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-emerald-300"
    >
      <div className="w-[82px] h-[82px] shrink-0 rounded-2xl bg-white/90 border border-emerald-100 shadow-inner flex items-center justify-center overflow-hidden">
        {enabled ? (
          <MascotAvatar
            {...view.settings}
            level={view.level}
            evolutionStage={view.evolutionStage}
            mood={view.fullness < 35 ? 'hungry' : 'happy'}
          />
        ) : (
          <Sprout className="m-5 h-9 w-9 text-emerald-600" />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
            {t('mascot.yourCompanion')}
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200/80">
            {t('mascot.level', { level: view.level })}
          </span>
        </div>

        <h3 className="truncate text-base sm:text-lg font-black text-stone-800 leading-tight group-hover:text-emerald-800 transition-colors">
          {view.settings.name || t('mascot.defaultName')}
        </h3>

        {enabled ? (
          <div className="grid grid-cols-2 gap-2.5 max-w-sm pt-0.5">
            <div className="bg-white/85 rounded-xl px-2.5 py-1.5 border border-rose-100 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 mb-1">
                <span className="flex items-center gap-1">
                  <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
                </span>
                <span>{fullnessPct}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-rose-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-500"
                  style={{ width: `${fullnessPct}%` }}
                />
              </div>
            </div>

            <div className="bg-white/85 rounded-xl px-2.5 py-1.5 border border-sky-100 shadow-2xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-stone-700 mb-1">
                <span className="flex items-center gap-1">
                  <Droplets className="h-3.5 w-3.5 text-sky-500 fill-sky-500" />
                </span>
                <span>{hydrationPct}/100</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-sky-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${hydrationPct}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-xs text-stone-500">{t('mascot.disabledTitle')}</p>
        )}
      </div>

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none">
        <ArrowUpRight className="h-4.5 w-4.5" />
      </div>
    </Link>
  );
}
