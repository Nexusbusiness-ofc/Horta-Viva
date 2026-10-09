import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Boxes, Check, ChevronDown, Droplets, Heart, Loader2, Send, Settings2, ShoppingBag, Sparkles, Sprout, Trophy } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';
import { feedMascot, claimHydrationReward } from '@/lib/mascot';
import { readAccountScope } from '@/lib/accountScope';
import { readRegionalPreferences } from '@/lib/regionalPreferences';
import MascotAvatar from '@/components/mascot/MascotAvatar';
import MascotGarden from '@/components/mascot/MascotGarden';
import useMascotFarm from '@/components/mascot/useMascotFarm';
import ProduceIllustration from '@/components/mascot/ProduceIllustration';

function CareMeter({ icon: Icon, title, value, hint, color }) {
  const { t } = useI18n();
  return <div className="rounded-2xl border border-[#d8c79e] bg-[#fffaf0] p-4">
    <div className="flex items-center gap-2"><Icon className={`h-4 w-4 ${color === 'rose' ? 'text-rose-400' : 'text-sky-500'}`}/><h3 className="flex-1 text-sm font-bold text-stone-700">{title}</h3><span className="text-lg font-black tabular-nums text-stone-800">{value}<span className="text-xs font-medium text-stone-400">/100</span></span></div>
    <div role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-valuetext={t('mascot.percent',{value})} className="mt-3 h-2.5 overflow-hidden rounded-full bg-stone-100"><div className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${color === 'rose' ? 'bg-gradient-to-r from-rose-300 to-rose-400' : 'bg-gradient-to-r from-sky-300 to-sky-500'}`} style={{width:`${value}%`}}/></div>
    <p className="mt-2.5 text-xs leading-relaxed text-stone-500">{hint}</p>
  </div>;
}

function CareChip({ icon: Icon, label, value, total, tone }) {
  return <div className="min-w-0 rounded-xl border border-[#d4bd8e] bg-[#fff8e4] px-2.5 py-2 shadow-[0_2px_0_#d9c49d] sm:px-3.5">
    <p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wide text-[#8b7650]"><Icon className={`h-3 w-3 shrink-0 ${tone}`}/><span className="truncate">{label}</span></p>
    <p className="mt-0.5 text-lg font-black leading-none tabular-nums text-[#4a5936]">{value}{total && <span className="ml-0.5 text-[10px] font-semibold text-[#a38e62]">/{total}</span>}</p>
  </div>;
}

function CozyGardenDecor() {
  return <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 360" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <g transform="translate(100 164)"><path d="M0 87V29L46 0L92 29V87Z" fill="#f5e7bd" stroke="#c0a275" strokeWidth="3"/><path d="M-10 31L46-7L102 31" fill="none" stroke="#b65d4a" strokeWidth="13" strokeLinejoin="round"/><path d="M32 87V47H62V87" fill="#8c7050"/><path d="M34 49L60 85M60 49L34 85" stroke="#b99a6c" strokeWidth="3"/><path d="M14 47H23V59H14Z" fill="#a9c9a2"/><path d="M71 47H80V59H71Z" fill="#a9c9a2"/></g>
    <path d="M0 323C100 300 171 320 241 312C354 296 448 324 600 304V360H0Z" fill="#89b16e"/>
    <path d="M0 351C116 336 205 347 293 341C399 332 493 354 600 340V360H0Z" fill="#709b5c"/>
    <g stroke="#d8bd86" strokeWidth="8" strokeLinecap="round"><path d="M0 281H153M447 281H600M0 302H158M442 302H600"/></g>
    <g fill="#f2d9a2" stroke="#bca071" strokeWidth="1.5">{[18,53,88,123,477,512,547,582].map(x=><path key={x} d={`M${x-5} 312V265L${x} 258L${x+5} 265V312Z`}/>)}</g>
    <g transform="translate(425 241)"><path d="M0 12Q20 4 42 12L38 46H4Z" fill="#91b8ac" stroke="#527e72" strokeWidth="2"/><path d="M0 19L-19 7L-24 12L1 35" fill="#91b8ac" stroke="#527e72" strokeWidth="2"/><path d="M42 16Q64 12 58 35L40 38" fill="none" stroke="#527e72" strokeWidth="5"/><path d="M10 7V1H32V7" fill="none" stroke="#527e72" strokeWidth="5"/><path d="M9 19H32" stroke="#cce3cf" strokeWidth="3" strokeLinecap="round"/></g>
    <g fill="#e5bd6d"><circle cx="154" cy="323" r="4"/><circle cx="458" cy="336" r="4"/><circle cx="83" cy="347" r="3"/></g>
  </svg>;
}

export default function Mascote() {
  const { t, locale } = useI18n();
  const { view, scope, hydration, weather, loading, error, refresh } = useMascotFarm();
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
  const scene = useRef(null);
  const active = useRef(true);
  const uiScope = useRef(readAccountScope());
  const inventory = view?.inventory || [];
  const selected = inventory.find(item => item.key === selectedKey) || inventory[0] || null;
  const enabled = view?.settings.enabled !== false;
  const actionsCurrent = scope !== null && scope === readAccountScope();
  const canFeed = Boolean(enabled && selected && view?.fullness < 100 && !busy && !error && actionsCurrent);

  const scopeIsCurrent = captured => active.current && captured !== null && captured === readAccountScope();
  const later = (callback, delay, captured = scope) => {
    if (!scopeIsCurrent(captured)) return;
    timers.current.push(setTimeout(() => {if (scopeIsCurrent(captured)) callback();},delay));
  };
  const resetForAccount = useCallback(() => {
    const current = readAccountScope();
    if (current === uiScope.current) return;
    uiScope.current = current;
    timers.current.forEach(clearTimeout); timers.current = [];
    pointer.current = null; suppressClick.current = false; previousProgress.current = null; locked.current = false;
    setSelectedKey(''); setFeedback(null); setReaction(null); setFlight(null); setDrag(null); setBusy(false);
  }, []);
  useEffect(() => {
    active.current = true;
    const events = ['hortaviva_auth_changed','hortaviva_remote_updated','hortaviva_data_changed','storage'];
    for (const event of events) window.addEventListener(event,resetForAccount);
    return () => {active.current=false;timers.current.forEach(clearTimeout);for(const event of events)window.removeEventListener(event,resetForAccount);};
  }, [resetForAccount]);
  useEffect(() => {resetForAccount();}, [scope,resetForAccount]);
  useEffect(() => {
    if (!view || !scopeIsCurrent(scope)) return;
    const previous = previousProgress.current;
    if (previous?.scope === scope && view.evolutionStage > previous.stage) {
      setReaction({type:'celebrate',id:Date.now()}); setFeedback({key:'mascot.evolution'});
      later(() => setReaction(null),1800,scope);
    } else if (previous?.scope === scope && view.level > previous.level) {
      setReaction({type:'celebrate',id:Date.now()}); setFeedback({key:'mascot.levelUp'});
      later(() => setReaction(null),1800,scope);
    }
    previousProgress.current = {level:view.level,stage:view.evolutionStage,scope};
  }, [view,scope]);

  const feed = async (origin = null) => {
    const captured = scope;
    if (!scopeIsCurrent(captured)) {resetForAccount();refresh();return;}
    if (!canFeed || locked.current) return;
    const preferences = readRegionalPreferences();
    if (!scopeIsCurrent(captured)) {resetForAccount();refresh();return;}
    locked.current = true; setBusy(true); setFeedback(null);
    try {
      const result = feedMascot(selected.key,{now:new Date(),timeZone:preferences.timeZone});
      if (!scopeIsCurrent(captured)) {resetForAccount();refresh();return;}
      if (!result.success) {
        setFeedback({key:result.reason === 'full' ? 'mascot.full' : result.reason === 'disabled' ? 'mascot.disabledTitle' : 'mascot.feedEmpty'});
        await refresh(); return;
      }
      const sceneBounds = scene.current?.getBoundingClientRect();
      setFlight({foodKey:selected.key,plantName:selected.plantName,x:(sceneBounds?.width || 350)/2-48+(origin?.x || 0),y:(sceneBounds?.height || 300)*0.18-48+(origin?.y || 0),id:Date.now()});
      setFeedback({key:'mascot.yum',vars:{gained:result.gained,xp:result.gainedXp}});
      const advanced = result.view?.level > view.level || result.view?.evolutionStage > view.evolutionStage;
      later(() => {setFlight(null);setReaction({type:advanced ? 'celebrate' : 'eat',id:Date.now()});},650,captured);
      later(() => setReaction(null),1900,captured);
      await refresh();
    } catch {if(scopeIsCurrent(captured))setFeedback({key:'mascot.storageError',error:true});}
    finally {later(() => {locked.current=false;setBusy(false);},850,captured);}
  };

  const reward = async () => {
    const captured = scope;
    if (!scopeIsCurrent(captured)) {resetForAccount();refresh();return;}
    if (busy || locked.current || error || !view) return;
    const preferences = readRegionalPreferences();
    if (!scopeIsCurrent(captured)) {resetForAccount();refresh();return;}
    locked.current = true; setBusy(true);
    try {
      const result = claimHydrationReward(hydration,{now:new Date(),timeZone:preferences.timeZone,weather,preferences});
      if (!scopeIsCurrent(captured)) {resetForAccount();refresh();return;}
      setFeedback({key:result.success ? 'mascot.rewardSuccess' : result.reason === 'already_claimed' ? 'mascot.rewardClaimed' : 'mascot.rewardNotReady',vars:{xp:result.gainedXp}});
      if (result.success) setReaction({type:'celebrate',id:Date.now()});
      await refresh();
    } catch {if(scopeIsCurrent(captured))setFeedback({key:'mascot.storageError',error:true});}
    finally {if(scopeIsCurrent(captured)){locked.current=false;setBusy(false);later(() => setReaction(null),1800,captured);}}
  };

  const pointerDown = event => {
    if (!canFeed || !scopeIsCurrent(scope) || event.button !== 0) return;
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
      later(() => {suppressClick.current=false;},100,scope);
      if (y < -45 && Math.abs(x) < 180) feed({x,y});
      else setFeedback({key:'mascot.throwAgain'});
    }
  };
  const cancelPointer = () => {pointer.current=null;setDrag(null);};
  const number = value => new Intl.NumberFormat(locale).format(value);
  const mood = view?.fullness < 35 ? 'hungry' : hydration.hydration < 40 && hydration.activeCount > 0 ? 'thirsty' : 'happy';
  const moodKey = view?.fullness >= 100 ? 'mascot.full' : `mascot.${mood}`;

  const careDetails = <div className="space-y-3">
    <section className="rounded-2xl border border-[#d8c79e] bg-[#fff4d7] p-4"><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dfc98f] bg-[#fffaf0] text-[#a18442]"><Trophy className="h-4 w-4"/></span><div className="min-w-0 flex-1"><h3 className="font-black text-[#655134]">{t('mascot.level',{level:number(view?.level || 1)})}</h3><p className="text-[11px] text-[#9a855d]">{t('mascot.nextEvolution',{level:number(view?.nextEvolutionLevel || 5)})}</p></div><span className="text-xs font-bold text-[#9d803f]">{number(view?.xp || 0)} / 100 XP</span></div><div role="progressbar" aria-label={t('mascot.level',{level:view?.level || 1})} aria-valuemin={0} aria-valuemax={100} aria-valuenow={view?.xp || 0} className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#e6d5a9]"><div className="h-full rounded-full bg-gradient-to-r from-[#e9c168] to-[#bf923e] transition-[width] motion-reduce:transition-none" style={{width:`${(view?.progress || 0)*100}%`}}/></div><p className="mt-2 text-[11px] text-[#9a855d]">{t('mascot.xpNext',{xp:number(view?.xpToNextLevel || 100)})}</p></section>
    <CareMeter icon={Heart} title={t('mascot.fullness')} value={view?.fullness || 0} hint={t('mascot.fullnessHint')} color="rose"/>
    <CareMeter icon={Droplets} title={t('mascot.hydration')} value={hydration.hydration} hint={hydration.rainEstimated ? t('mascot.rainHint') : !hydration.activeCount ? t('mascot.noCrops') : t('mascot.waterCare',{cared:hydration.caredForCount,total:hydration.activeCount})} color="sky"/>
    <div className="rounded-2xl border border-[#d8c79e] bg-[#fffaf0] p-4"><p className="text-xs leading-relaxed text-[#8b7958]">{t('mascot.rewardHint')}</p><button type="button" disabled={!enabled || !hydration.complete || view?.dailyRewardClaimed || busy || Boolean(error) || !actionsCurrent} onClick={reward} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#aec68e] bg-[#edf4dc] px-3 py-2.5 text-xs font-bold text-[#5e793f] disabled:border-[#e6dcc4] disabled:bg-[#f4efdf] disabled:text-[#b7a888]">{view?.dailyRewardClaimed ? <Check className="h-4 w-4"/> : <Sparkles className="h-4 w-4"/>}{t(view?.dailyRewardClaimed ? 'mascot.rewardClaimed' : 'mascot.reward')}</button><Link to="/tarefas-hoje" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#62814a]">{t('mascot.tasks')}<ArrowUpRight className="h-3 w-3"/></Link></div>
  </div>;

  return <main className="min-h-screen bg-[#f1efdc] pb-12 text-[#5b4a31]" style={{backgroundImage:'radial-gradient(#9aaf6920 1px, transparent 1px)',backgroundSize:'16px 16px'}}>
    <header className="border-b-2 border-[#c9ad76] bg-[#fbf0d4] shadow-[0_2px_0_#ffffff70]">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-3 sm:px-6">
        <Link to="/minha-quinta" aria-label={t('mascot.backFarm')} className="rounded-xl border border-[#d5bb87] bg-[#fff8e7] p-2.5 text-[#8e7145] shadow-[0_2px_0_#d2b583] hover:bg-white"><ArrowLeft className="h-4 w-4"/></Link>
        <div className="min-w-0 flex-1"><p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#8c9a62]">Horta Viva</p><h1 className="truncate text-base font-black sm:text-xl">{t('mascot.navTitle')}</h1></div>
        <Link to="/definicoes#mascote" aria-label={t('mascot.settings')} className="flex items-center gap-2 rounded-xl border border-[#d5bb87] bg-[#fff8e7] p-2.5 text-xs font-bold text-[#8e7145] shadow-[0_2px_0_#d2b583]"><Settings2 className="h-4 w-4"/><span className="hidden sm:inline">{t('mascot.settings')}</span></Link>
      </div>
    </header>
    <div className="mx-auto max-w-6xl space-y-4 px-3 pt-4 sm:space-y-5 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between gap-3"><div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#8b9d61]">{t('mascot.gardenTitle')}</p><h2 className="break-words text-2xl font-black leading-tight tracking-tight text-[#52663d] sm:text-3xl">{view?.settings.name || t('mascot.defaultName')}</h2></div><Link to="/mercado" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border-2 border-[#a95843] bg-[#b9614c] px-3 py-2.5 text-xs font-bold text-[#fff5d9] shadow-[0_3px_0_#944a38] hover:bg-[#a95843]"><ShoppingBag className="h-4 w-4"/>{t('mascot.marketShort')}<ArrowUpRight className="h-3 w-3"/></Link></div>
      {error && <div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"><p>{t(error === 'storage' ? 'mascot.storageError' : 'mascot.loadError')}</p><button type="button" onClick={refresh} className="mt-2 font-bold underline">{t('mascot.retry')}</button></div>}
      {loading && <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#d6c192] bg-[#fff8e7] py-24 text-sm text-[#8b7958]" role="status"><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none"/>{t('mascot.loading')}</div>}
      {!loading && view && <>
        <div className="grid items-start gap-4 lg:grid-cols-[1.25fr_.75fr] lg:gap-5">
          <section aria-label={t('mascot.yourCompanion')} className="min-w-0 overflow-hidden rounded-[1.6rem] border-[3px] border-[#b9955d] bg-[#d6b47b] p-1.5 shadow-[0_5px_0_#bd9c67,0_15px_30px_-20px_#65513460] sm:p-2">
            <div className="grid grid-cols-3 gap-2 pb-2"><CareChip icon={Heart} label={t('mascot.fullness')} value={number(view.fullness)} total="100" tone="text-[#d38075]"/><CareChip icon={Droplets} label={t('mascot.waterShort')} value={number(hydration.hydration)} total="100" tone="text-[#6c9fb3]"/><CareChip icon={Trophy} label={t('mascot.levelShort')} value={number(view.level)} tone="text-[#b79842]"/></div>
            <MascotGarden className="h-[300px] rounded-[1.1rem] border border-[#b2bd88] lg:h-[380px]">
              <div ref={scene} className="absolute inset-0">
                <CozyGardenDecor/>
                {hydration.rainEstimated && <span className="absolute left-3 top-3 z-10 flex max-w-[180px] items-center gap-1 rounded-full border border-white/80 bg-white/80 px-2.5 py-1.5 text-[10px] font-semibold text-sky-700"><Droplets className="h-3 w-3 shrink-0"/>{t('mascot.rainNow')}</span>}
                {enabled ? <>
                  <div className="absolute left-1/2 top-2 z-10 w-[220px] -translate-x-1/2 lg:top-5 lg:w-[280px]"><MascotAvatar key={reaction?.id || 'idle'} {...view.settings} level={view.level} evolutionStage={view.evolutionStage} mood={mood} reaction={reaction}/></div>
                  <div className="absolute bottom-4 left-3 z-10 max-w-[calc(100%_-_100px)]"><span className="inline-block rounded-2xl rounded-bl-sm border border-[#e4e5c4] bg-[#fffdf1]/95 px-3 py-2 text-[10px] font-semibold leading-relaxed text-[#69804c] shadow-sm sm:text-xs">{t(moodKey)}</span></div>
                  <button type="button" disabled={!canFeed} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelPointer} onLostPointerCapture={cancelPointer} onClick={() => {if(!suppressClick.current) feed();}} aria-label={selected ? t('mascot.feedHandle',{food:t(selected.plantName)}) : t('mascot.chooseFood')} className={`hv-pet-food-handle absolute bottom-4 right-4 z-20 flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#fff7dc] bg-[#e1bd7c] shadow-[0_3px_0_#ad8a54,0_4px_12px_#52663d30] disabled:opacity-60 ${canFeed ? 'cursor-grab active:cursor-grabbing focus:outline-none focus:ring-4 focus:ring-[#709548]/50' : ''}`} style={drag ? {transform:`translate(${drag.x}px,${drag.y}px)`} : undefined}>{selected ? <ProduceIllustration foodKey={selected.key} plantName={selected.plantName} className="h-12 w-12"/> : <Boxes className="h-7 w-7 text-[#fff3d4]"/>}</button>
                  {flight && <span key={flight.id} className="hv-pet-food-flight h-12 w-12" aria-hidden="true" style={{'--throw-x':`${flight.x}px`,'--throw-y':`${flight.y}px`}}><ProduceIllustration foodKey={flight.foodKey} plantName={flight.plantName} className="h-12 w-12"/></span>}
                </> : <div className="absolute inset-x-6 top-12 z-10 rounded-2xl border border-[#e2d6b3] bg-[#fffaf0]/95 p-5 text-center"><Sprout className="mx-auto h-7 w-7 text-[#809b5b]"/><h3 className="mt-2 text-sm font-bold">{t('mascot.disabledTitle')}</h3><p className="mt-2 text-xs leading-relaxed text-[#9a855e]">{t('mascot.disabledHint')}</p><Link to="/definicoes#mascote" className="mt-3 inline-flex text-xs font-bold text-[#6a8649] underline">{t('mascot.settings')}</Link></div>}
              </div>
            </MascotGarden>
            {enabled && <div className="rounded-b-xl bg-[#f7e9c8] px-3 pb-3 pt-3"><div className="flex items-center gap-2"><label className="min-w-0 flex-1"><span className="sr-only">{t('mascot.chooseFood')}</span><select value={selected?.key || ''} disabled={!selected || busy || Boolean(error) || !actionsCurrent} onChange={event=>setSelectedKey(event.target.value)} className="w-full rounded-xl border border-[#d4bb88] bg-[#fff9e9] px-2.5 py-2.5 text-xs font-bold text-[#75613f] outline-none focus:border-[#7d9855] focus:ring-2 focus:ring-[#afbf7f]/40">{inventory.length ? inventory.map(item=><option key={item.key} value={item.key}>{t(item.plantName)} · {number(item.quantity)}</option>) : <option value="">{t('mascot.chooseFood')}</option>}</select></label><button type="button" disabled={!canFeed} onClick={() => feed()} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-[#6a8b47] bg-[#7d9d55] px-3 py-2.5 text-xs font-black text-[#fff9e8] shadow-[0_2px_0_#5a783b] hover:bg-[#6e8e49] disabled:border-[#d0bd95] disabled:bg-[#e4d6b8] disabled:text-[#aa9873] disabled:shadow-none"><Send className="h-3.5 w-3.5"/>{t('mascot.feedAction')}</button></div><p className="mt-2 text-center text-[10px] leading-relaxed text-[#9b875d]">{t('mascot.feedShortHint')}</p></div>}
            <div role={feedback?.error ? 'alert' : 'status'} aria-live="polite" aria-atomic="true" className={`${feedback ? feedback.error ? 'border border-amber-300 bg-amber-50 text-amber-900' : 'border border-[#c2d196] bg-[#f0f5dd] text-[#678348]' : 'sr-only'} mt-2 rounded-xl px-3 py-2 text-center text-xs font-bold`}>{feedback ? t(feedback.key,feedback.vars || {}) : ''}</div>
          </section>
          <aside className="hidden lg:block"><h3 className="mb-3 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#8d7951]"><Sprout className="h-4 w-4"/>{t('mascot.careTitle')}</h3>{careDetails}</aside>
        </div>
        <details className="group rounded-2xl border border-[#d0bc8e] bg-[#fbf4df] lg:hidden"><summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-xs font-bold text-[#8b754a] [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-2"><Sprout className="h-4 w-4 text-[#839b60]"/>{t('mascot.careTitle')}</span><ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"/></summary><div className="border-t border-[#e4d5b3] p-3">{careDetails}</div></details>
        <section id="armazem" className="scroll-mt-4 overflow-hidden rounded-[1.6rem] border-[3px] border-[#b9955d] bg-[#f9efd4] shadow-[0_4px_0_#bd9c67]">
          <div className="flex items-center justify-between gap-3 border-b-2 border-[#d9bf8b] bg-[#e6c995] px-4 py-3 sm:px-5"><div className="flex min-w-0 items-center gap-2.5"><span className="rounded-xl border border-[#c7a96f] bg-[#f7e7bf] p-2 text-[#a5844d]"><Boxes className="h-5 w-5"/></span><div><h3 className="text-base font-black tracking-tight text-[#7a5b34] sm:text-xl">{t('mascot.warehouseTitle')}</h3><p className="hidden text-[10px] text-[#a18456] sm:block">{t('mascot.warehouseShortHint')}</p></div></div><Link to="/mercado" className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#a65c47] bg-[#bd7057] px-3 py-2 text-xs font-bold text-[#fff6de] shadow-[0_2px_0_#9c563f]"><ShoppingBag className="h-3.5 w-3.5"/>{t('mascot.marketShort')}<ArrowUpRight className="hidden h-3 w-3 sm:block"/></Link></div>
          <div className="p-3 sm:p-5"><p className="mb-3 text-[10px] leading-relaxed text-[#aa9166] sm:hidden">{t('mascot.warehouseShortHint')}</p>
            {inventory.length ? <div role="group" aria-label={t('mascot.chooseFood')} className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">{inventory.map(item=><button type="button" key={item.key} disabled={!actionsCurrent} onClick={()=>setSelectedKey(item.key)} aria-pressed={selected?.key === item.key} className={`relative min-w-0 overflow-hidden rounded-xl border-2 p-2 text-center transition-colors sm:p-3 ${selected?.key === item.key ? 'border-[#7b9854] bg-[#edf2d4] shadow-[0_2px_0_#a7ba76]' : 'border-[#dfcda4] bg-[#fff8e5] hover:border-[#acbc7c]'}`}><div className="relative mx-auto mb-1.5 flex h-16 w-16 max-w-full items-center justify-center rounded-xl bg-[#f4eacb]"><ProduceIllustration foodKey={item.key} plantName={item.plantName} className="h-16 w-16"/>{selected?.key === item.key && <span className="absolute -right-1 -top-1 rounded-full border-2 border-[#f9efd4] bg-[#809c55] p-0.5 text-[#fff9e8]"><Check className="h-2.5 w-2.5"/></span>}</div><h4 className="truncate text-[11px] font-black text-[#7f6841] sm:text-xs" title={t(item.plantName)}>{t(item.plantName)}</h4><p className="mt-1 text-[10px] font-bold text-[#7e9757]">{t(item.quantity === 1 ? 'mascot.stockOne' : 'mascot.stock',{quantity:number(item.quantity)})}</p><p className="mt-0.5 text-[8px] leading-tight text-[#b19a70] sm:text-[9px]">{t('mascot.nutrition',{nutrition:item.nutrition})}</p></button>)}</div> : <div className="rounded-2xl border-2 border-dashed border-[#ddcba0] bg-[#fff8e5] px-4 py-7 text-center"><Boxes className="mx-auto h-10 w-10 text-[#c5ac7c]"/><h4 className="mt-3 text-sm font-bold text-[#887047]">{t('mascot.emptyTitle')}</h4><p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#b39a6d]">{t('mascot.emptyHint')}</p><div className="mt-4 flex flex-wrap items-center justify-center gap-2"><Link to="/minha-quinta" className="inline-flex items-center gap-1 rounded-xl border border-[#9caf72] bg-[#819d55] px-4 py-2.5 text-xs font-bold text-[#fff7e3]">{t('mascot.backFarm')}<ArrowUpRight className="h-3 w-3"/></Link><Link to="/mercado" className="inline-flex items-center gap-1.5 rounded-xl border border-[#ab6549] bg-[#c27a58] px-4 py-2.5 text-xs font-bold text-[#fff7e3]"><ShoppingBag className="h-3.5 w-3.5"/>{t('mascot.marketShort')}</Link></div></div>}
          </div>
        </section>
      </>}
    </div>
  </main>;
}
