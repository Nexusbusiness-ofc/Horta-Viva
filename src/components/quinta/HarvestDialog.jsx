import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sprout, PackageCheck, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';

export default function HarvestDialog({ planting, onClose, onHarvest }) {
  const { t } = useI18n();
  const [method, setMethod] = useState(planting.quantity_method || (planting.rows && (planting.columns || planting.cols) ? 'grid' : 'count'));
  const [rows, setRows] = useState(planting.rows || '');
  const [columns, setColumns] = useState(planting.columns || planting.cols || '');
  const [count, setCount] = useState(planting.plant_count || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const total = method === 'grid' ? Number(rows) * Number(columns) : Number(count);
  const validNumber = value => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 1000000;
  const valid = method === 'grid' ? validNumber(rows) && validNumber(columns) && total <= 1000000 : Number.isInteger(total) && total > 0 && total <= 1000000;
  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    if (!valid) { setError(t('harvest.invalid')); return; }
    setBusy(true); setError('');
    try { await onHarvest({ quantity_method: method, rows: method === 'grid' ? Number(rows) : null, columns: method === 'grid' ? Number(columns) : null, plant_count: total }); }
    catch { setError(t('harvest.error')); setBusy(false); }
  };
  const numberInput = (label, value, setter, max = 1000000) => <label className="block space-y-2 text-xs font-bold text-stone-600">{t(label)}<input type="number" inputMode="numeric" min="1" max={max} step="1" required value={value} onChange={event=>setter(event.target.value)} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-3 text-base text-stone-800" /></label>;
  return <Dialog open onOpenChange={open=>{ if (!open && !busy) onClose(); }}><DialogContent className="max-w-md rounded-3xl"><DialogHeader><span className="mb-2 text-5xl" aria-hidden="true">{planting.plant_emoji || '🌱'}</span><DialogTitle>{t('harvest.title')}</DialogTitle><DialogDescription>{t('harvest.body')}</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-4">
    <p className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 font-bold text-emerald-900"><Sprout className="h-4 w-4" />{t(planting.plant_name)}</p>
    <label className="block space-y-2 text-xs font-bold text-stone-600">{t('harvest.method')}<select value={method} onChange={event=>setMethod(event.target.value)} className="w-full rounded-xl border border-stone-200 bg-white p-3 text-sm"><option value="grid">{t('harvest.grid')}</option><option value="count">{t('harvest.count')}</option></select></label>
    {method === 'grid' ? <div className="grid grid-cols-2 gap-3">{numberInput('harvest.rows',rows,setRows)}{numberInput('harvest.columns',columns,setColumns)}</div> : numberInput('harvest.count',count,setCount,1000000)}
    <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">{t('harvest.total',{count:valid?total:'—'})}</p><p className="text-xs leading-relaxed text-stone-500">{t('harvest.virtual')}</p>
    {error && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
    <div className="flex gap-3"><button type="button" disabled={busy} onClick={onClose} className="rounded-xl border border-stone-200 px-4 py-3 text-sm font-semibold text-stone-600">{t('harvest.cancel')}</button><button type="submit" disabled={busy} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{busy?<Loader2 className="h-4 w-4 animate-spin" />:<PackageCheck className="h-4 w-4" />}{t(busy?'harvest.saving':'harvest.confirm')}</button></div>
  </form></DialogContent></Dialog>;
}
