import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Boxes, Check, Droplets, Heart, Loader2, Send, Settings2, ShoppingBag, Sparkles, Sprout, Trophy } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';
import { feedMascot, claimHydrationReward } from '@/lib/mascot';
import MascotAvatar from '@/components/mascot/MascotAvatar';
import MascotGarden from '@/components/mascot/MascotGarden';
import useMascotFarm from '@/components/mascot/useMascotFarm';

function CareMeter({ icon: Icon, title, value, hint, color }) {
  const { t } = useI18n();
  return <div className="rounded-2xl border border-stone-200/70 bg-white p-4 sm:p-5">
    <div className="flex items-center gap-2"><Icon className={`h-4 w-4 ${color === 'rose' ? 'text-rose-400' : 'text-sky-500'}`}/><h3 className="flex-1 text-sm font-bold text-stone-700">{title}</h3><span className="text-lg font-black tabular-nums text-stone-800">{value}<span className="text-xs font-medium text-stone-400">/100</span></span></div>
    <div role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-valuetext={t('mascot.percent',{value})} className="mt-3 h-2.5 overflow-hidden rounded-full bg-stone-100"><div className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${color === 'rose' ? 'bg-gradient-to-r from-rose-300 to-rose-400' : 'bg-gradient-to-r from-sky-300 to-sky-500'}`} style={{width:`${value}%`}}/></div>
    <p className="mt-2.5 text-xs leading-relaxed text-stone-500">{hint}</p>
  </div>;
}

export default function Mascote() {
  const { t, locale } = useI18n();
  const { view, hydration, preferences, weather, loading, error, refresh } = useMascotFarm();
  const [selectedKey, setSelectedKey] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [flight, setFlight] = useState(null);
  const [drag, setDrag] = useState(null);
  const [busy, setBusy] = useState(false);
  const timers = useRef([]);
  const pointer = useRef(null);
  const suppressClick = useRef(false);
  const previousProgress = useRef(null);
  const locked = useRef(false);
  const inventory = view?.inventory || [];
  const selected = inventory.find(item => item.key === selectedKey) || inventory[0] || null;
  const enabled = view?.settings.enabled !== false;
  const canFeed = Boolean(enabled && selected && view?.fullness < 100 && !busy && !error);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (!view) return;
    const previous = previousProgress.current;
    if (previous && view.evolutionStage > previous.stage) {
      setReaction({type:'celebrate',id:Date.now()}); setFeedback({key:'mascot.evolution'});
      timers.current.push(setTimeout(() => setReaction(null), 1800));
    } else if (previous && view.level > previous.level) {
      setReaction({type:'celebrate',id:Date.now()}); setFeedback({key:'mascot.levelUp'});
      timers.current.push(setTimeout(() => setReaction(null), 1800));
    }
    previousProgress.current = {level:view.level,stage:view.evolutionStage};
  }, [view]);

  const feed = async (origin = null) => {
    if (!canFeed || locked.current) return;
    locked.current = true; setBusy(true); setFeedback(null);
    try {
      const result = feedMascot(selected.key, {now:new Date(),timeZone:preferences.timeZone});
      if (!result.success) {
        setFeedback({key:result.reason === 'full' ? 'mascot.full' : result.reason === 'disabled' ? 'mascot.disabledTitle' : 'mascot.feedEmpty'});
        await refresh(); return;
      }
      setFlight({emoji:selected.emoji,x:origin?.x || 0,y:origin?.y || 0,id:Date.now()});
      setFeedback({key:'mascot.yum',vars:{gained:result.gained,xp:result.gainedXp}});
      const advanced = result.view?.level > view.level || result.view?.evolutionStage > view.evolutionStage;
      timers.current.push(setTimeout(() => { setFlight(null); setReaction({type:advanced ? 'celebrate' : 'eat',id:Date.now()}); }, 650));
      timers.current.push(setTimeout(() => setReaction(null), 1900));
      await refresh();
    } catch {
      setFeedback({key:'mascot.storageError',error:true});
    } finally {
      timers.current.push(setTimeout(() => { locked.current = false; setBusy(false); }, 850));
    }
  };

  const reward = async () => {
    if (busy || locked.current) return;
    locked.current = true; setBusy(true);
    try {
      const result = claimHydrationReward(hydration, {now:new Date(),timeZone:preferences.timeZone,weather,preferences});
      setFeedback({key:result.success ? 'mascot.rewardSuccess' : result.reason === 'already_claimed' ? 'mascot.rewardClaimed' : 'mascot.rewardNotReady',vars:{xp:result.gainedXp}});
      if (result.success) setReaction({type:'celebrate',id:Date.now()});
      await refresh();
    } catch { setFeedback({key:'mascot.storageError',error:true}); }
    finally { locked.current = false; setBusy(false); timers.current.push(setTimeout(() => setReaction(null),1800)); }
  };

  const pointerDown = event => {
    if (!canFeed || event.button !== 0) return;
    pointer.current = {id:event.pointerId,x:event.clientX,y:event.clientY};
    event.currentTarget.setPointerCapture(event.pointerId); setDrag({x:0,y:0});
  };
  const pointerMove = event => {
    if (!pointer.current || event.pointerId !== pointer.current.id) return;
    setDrag({x:Math.max(-160,Math.min(160,event.clientX-pointer.current.x)),y:Math.max(-200,Math.min(60,event.clientY-pointer.current.y))});
  };
  const pointerUp = event => {
    const start = pointer.current;
    if (!start || event.pointerId !== start.id) return;
    const x = event.clientX - start.x, y = event.clientY - start.y;
    pointer.current = null; setDrag(null);
    if (Math.hypot(x,y) > 12) {
      suppressClick.current = true;
      timers.current.push(setTimeout(() => {suppressClick.current=false;},100));
      if (y < -45 && Math.abs(x) < 180) feed({x,y});
      else setFeedback({key:'mascot.throwAgain'});
    }
  };
  const cancelPointer = () => {pointer.current=null;setDrag(null);};
  const number = value => new Intl.NumberFormat(locale).format(value);
  const mood = view?.fullness < 35 ? 'hungry' : hydration.hydration < 40 && hydration.activeCount > 0 ? 'thirsty' : 'happy';
  const moodKey = view?.fullness >= 100 ? 'mascot.full' : `mascot.${mood}`;

  return <main className="min-h-screen bg-[#faf9f3] pb-16 text-stone-800">
    <header className="border-b border-stone-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
        <Link to="/minha-quinta" aria-label={t('mascot.backFarm')} className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-600 hover:border-emerald-400"><ArrowLeft className="h-4 w-4"/></Link>
        <div className="flex-1"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-emerald-700">Horta Viva</p><h1 className="text-lg font-black sm:text-xl">{t('mascot.navTitle')}</h1></div>
        <Link to="/definicoes#mascote" aria-label={t('mascot.settings')} className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-bold text-stone-600"><Settings2 className="h-4 w-4"/><span className="hidden sm:inline">{t('mascot.settings')}</span></Link>
      </div>
    </header>
    <div className="mx-auto max-w-6xl space-y-6 px-4 pt-7 sm:px-6 sm:pt-10">
      <div className="max-w-2xl"><p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-emerald-700"><Sprout className="h-3.5 w-3.5"/>{t('mascot.yourCompanion')}</p><h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{t('mascot.title')}</h2><p className="mt-2 text-sm leading-relaxed text-stone-500">{t('mascot.subtitle')}</p><Link to="/mercado" className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-bold text-amber-900 hover:bg-amber-100"><ShoppingBag className="h-4 w-4"/>{t('market.goMarket')}<ArrowUpRight className="h-3.5 w-3.5"/></Link></div>
      {error && <div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"><p>{t(error === 'storage' ? 'mascot.storageError' : 'mascot.loadError')}</p><button type="button" onClick={refresh} className="mt-2 font-bold underline">{t('mascot.retry')}</button></div>}
      {loading && <div className="flex items-center justify-center gap-3 rounded-[2rem] bg-white py-24 text-sm text-stone-500" role="status"><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none"/>{t('mascot.loading')}</div>}
      {!loading && view && <>
        <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <section className="min-w-0 rounded-[2rem] border border-[#dce5ce] bg-white p-2 shadow-[0_12px_45px_-30px_#5c7052]">
            <MascotGarden className="min-h-[420px] sm:min-h-[460px]">
              <div className="relative z-10 flex items-start justify-between p-5"><div><p className="text-xs font-semibold text-emerald-800/70">{t('mascot.yourCompanion')}</p><h3 className="max-w-[220px] break-words text-2xl font-black tracking-tight text-[#315342]">{view.settings.name || t('mascot.defaultName')}</h3></div><span className="flex items-center gap-1 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-xs font-bold text-[#506c43]"><Sparkles className="h-3 w-3"/>{t('mascot.level',{level:number(view.level)})}</span></div>
              {enabled ? <>
                <div className="absolute left-1/2 top-[95px] z-10 w-[225px] -translate-x-1/2 sm:top-[100px] sm:w-[250px]"><MascotAvatar key={reaction?.id || 'idle'} {...view.settings} level={view.level} evolutionStage={view.evolutionStage} mood={mood} reaction={reaction}/></div>
                <div className="absolute inset-x-5 bottom-[86px] z-10 text-center"><span className="inline-block rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-semibold text-[#466548]">{t(moodKey)}</span></div>
                <button type="button" disabled={!canFeed} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelPointer} onLostPointerCapture={cancelPointer} onClick={() => {if(!suppressClick.current) feed();}} aria-label={selected ? t('mascot.feedHandle',{food:t(selected.plantName)}) : t('mascot.chooseFood')} className={`hv-pet-food-handle absolute bottom-4 left-1/2 z-20 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white/90 bg-white/80 text-3xl shadow-lg shadow-emerald-950/10 disabled:opacity-50 ${canFeed ? 'cursor-grab active:cursor-grabbing focus:outline-none focus:ring-4 focus:ring-emerald-500/50' : ''}`} style={drag ? {transform:`translate(calc(-50% + ${drag.x}px),${drag.y}px)`} : undefined}>{selected?.emoji || '🧺'}</button>
                {flight && <span key={flight.id} className="hv-pet-food-flight" aria-hidden="true" style={{'--throw-x':`${flight.x}px`,'--throw-y':`${flight.y}px`}}>{flight.emoji}</span>}
              </> : <div className="absolute inset-x-8 top-32 z-10 rounded-2xl border border-white/80 bg-white/85 p-6 text-center"><Sprout className="mx-auto h-8 w-8 text-emerald-600"/><h3 className="mt-3 font-bold">{t('mascot.disabledTitle')}</h3><p className="mt-2 text-xs leading-relaxed text-stone-500">{t('mascot.disabledHint')}</p><Link to="/definicoes#mascote" className="mt-4 inline-flex text-xs font-bold text-emerald-700 underline">{t('mascot.settings')}</Link></div>}
            </MascotGarden>
            {enabled && <div className="p-3 text-center sm:p-4"><button type="button" disabled={!canFeed} onClick={() => feed()} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#326b4c] px-7 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-500"><Send className="h-4 w-4"/>{t('mascot.feed')}</button><p className="mx-auto mt-2.5 max-w-sm text-[11px] leading-relaxed text-stone-500">{t('mascot.feedHint')}</p></div>}
          </section>
          <div className="space-y-3">
            <section className="rounded-2xl border border-[#e5dcc7] bg-[#fbf4e7] p-4 sm:p-5"><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/70 text-[#a18442]"><Trophy className="h-4 w-4"/></span><div className="flex-1"><h3 className="font-black text-stone-800">{t('mascot.level',{level:number(view.level)})}</h3><p className="text-[11px] text-stone-500">{t('mascot.nextEvolution',{level:number(view.nextEvolutionLevel)})}</p></div><span className="text-xs font-bold text-[#9d803f]">{number(view.xp)} / 100 XP</span></div><div role="progressbar" aria-label={t('mascot.level',{level:view.level})} aria-valuemin={0} aria-valuemax={100} aria-valuenow={view.xp} className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8dfcb]"><div className="h-full rounded-full bg-gradient-to-r from-[#c8ae70] to-[#a78c4a] transition-[width] motion-reduce:transition-none" style={{width:`${view.progress*100}%`}}/></div><p className="mt-2 text-[11px] text-stone-500">{t('mascot.xpNext',{xp:number(view.xpToNextLevel)})}</p></section>
            <CareMeter icon={Heart} title={t('mascot.fullness')} value={view.fullness} hint={t('mascot.fullnessHint')} color="rose"/>
            <CareMeter icon={Droplets} title={t('mascot.hydration')} value={hydration.hydration} hint={hydration.rainEstimated ? t('mascot.rainHint') : !hydration.activeCount ? t('mascot.noCrops') : t('mascot.waterCare',{cared:hydration.caredForCount,total:hydration.activeCount})} color="sky"/>
            {hydration.rainEstimated && <p className="flex items-center gap-1.5 px-1 text-xs font-semibold text-sky-700"><Droplets className="h-3.5 w-3.5"/>{t('mascot.rainNow')}</p>}
            <div className="rounded-2xl border border-stone-200/70 bg-white p-4"><p className="text-xs leading-relaxed text-stone-500">{t('mascot.rewardHint')}</p><button type="button" disabled={!enabled || !hydration.complete || view.dailyRewardClaimed || busy || Boolean(error)} onClick={reward} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 disabled:border-stone-100 disabled:bg-stone-50 disabled:text-stone-400">{view.dailyRewardClaimed ? <Check className="h-4 w-4"/> : <Sparkles className="h-4 w-4"/>}{t(view.dailyRewardClaimed ? 'mascot.rewardClaimed' : 'mascot.reward')}</button><Link to="/tarefas-hoje" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">{t('mascot.tasks')}<ArrowUpRight className="h-3 w-3"/></Link></div>
          </div>
        </div>
        <div role={feedback?.error ? 'alert' : 'status'} aria-live="polite" aria-atomic="true" className={`min-h-10 rounded-xl px-4 py-2.5 text-center text-sm font-semibold ${feedback ? feedback.error ? 'bg-amber-50 text-amber-900' : 'bg-emerald-50 text-emerald-800' : ''}`}>{feedback ? t(feedback.key,feedback.vars || {}) : ''}</div>
        <section id="armazem" className="scroll-mt-6 rounded-[2rem] border border-stone-200/80 bg-white p-5 sm:p-7">
          <div className="mb-5 flex items-start gap-3"><span className="rounded-xl bg-[#f4eddd] p-3 text-[#9a8050]"><Boxes className="h-5 w-5"/></span><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#9a8050]">{t('mascot.warehouse')}</p><h3 className="text-xl font-black tracking-tight">{t('mascot.inventoryTitle')}</h3><p className="mt-1 max-w-2xl text-xs leading-relaxed text-stone-500">{t('mascot.inventoryHint')}</p></div></div>
          {inventory.length ? <div role="group" aria-label={t('mascot.chooseFood')} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{inventory.map(item => <button type="button" key={item.key} onClick={() => setSelectedKey(item.key)} aria-pressed={selected?.key === item.key} className={`relative min-w-0 rounded-2xl border-2 p-4 text-left transition-colors ${selected?.key === item.key ? 'border-emerald-500 bg-emerald-50/70' : 'border-stone-100 bg-[#fafaf7] hover:border-emerald-200'}`}><div className="mb-3 flex items-center justify-between"><span className="text-3xl" aria-hidden="true">{item.emoji}</span>{selected?.key === item.key && <span className="rounded-full bg-emerald-600 p-1 text-white"><Check className="h-3 w-3"/></span>}</div><h4 className="break-words text-sm font-bold text-stone-700">{t(item.plantName)}</h4><p className="mt-1 text-xs font-semibold text-emerald-700">{t(item.quantity === 1 ? 'mascot.stockOne' : 'mascot.stock',{quantity:number(item.quantity)})}</p><p className="mt-1 text-[10px] text-stone-500">{t('mascot.nutrition',{nutrition:item.nutrition})}</p></button>)}</div> : <div className="rounded-2xl border border-dashed border-stone-200 bg-[#fafaf7] px-5 py-9 text-center"><span className="text-4xl" aria-hidden="true">🧺</span><h4 className="mt-3 text-sm font-bold text-stone-700">{t('mascot.emptyTitle')}</h4><p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-stone-500">{t('mascot.emptyHint')}</p><Link to="/minha-quinta" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white">{t('mascot.backFarm')}<ArrowUpRight className="h-3.5 w-3.5"/></Link><Link to="/mercado" className="ml-2 mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-5 py-2.5 text-xs font-bold text-amber-900"><ShoppingBag className="h-3.5 w-3.5"/>{t('market.goMarket')}</Link></div>}
        </section>
      </>}
    </div>
  </main>;
}
