import React from 'react';
import { Info } from 'lucide-react';
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import { regionalMessage } from '@/lib/regionalMessages';

export default function RegionalCalendarNotice({ item, className = '' }) {
  const { preferences } = useRegionalPreferences();
  const adaptation = item?.regional_adaptation;
  const notes = Array.isArray(adaptation?.notes) ? adaptation.notes : adaptation?.notes ? [adaptation.notes] : [];
  return <div role="note" className={`flex gap-2.5 rounded-xl border border-amber-100 bg-amber-50/70 p-3 text-xs text-amber-950 ${className}`}><Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /><div><p className="font-bold">{regionalMessage('estimated',preferences.language)}</p><p className="mt-1 leading-relaxed text-amber-900/80">{notes.length?notes.join(' '):regionalMessage('estimateBody',preferences.language)}</p></div></div>;
}
