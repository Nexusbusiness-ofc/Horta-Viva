import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings2 } from 'lucide-react';
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import { regionalMessage } from '@/lib/regionalMessages';
import RegionalSettingsForm from '@/components/regional/RegionalSettingsForm';
import SyncBackupModal from '@/components/quinta/SyncBackupModal';
export default function Definicoes() {
  const [showSync, setShowSync] = useState(false);
  const {
    preferences
  } = useRegionalPreferences();
  const t = key => regionalMessage(key, preferences.language);
  return <div className="min-h-screen bg-[#f5f7f2] pb-28"><header className="border-b border-stone-200 bg-white/90"><div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4"><Link to="/" aria-label={t('back')} className="rounded-xl border border-stone-200 p-2.5 text-stone-600"><ArrowLeft className="h-5 w-5" /></Link><div className="min-w-0 flex-1"><h1 className="flex items-center gap-2 text-xl font-bold text-stone-800"><Settings2 className="h-5 w-5 text-emerald-700" />{t('settings')}</h1><p className="mt-0.5 text-xs text-stone-500">{t('subtitle')}</p></div></div></header><main className="mx-auto max-w-3xl space-y-5 px-4 py-6"><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-900">{t('device')}</div><section className="rounded-3xl border border-stone-200 bg-white p-5"><h2 className="font-bold text-stone-800">☁️ {t('syncTitle')}</h2><p className="mt-2 text-sm leading-relaxed text-stone-500">{t('syncBody')}</p><button type="button" onClick={()=>setShowSync(true)} className="mt-4 rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white">{t('syncManage')}</button></section><div className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6"><RegionalSettingsForm /></div></main><SyncBackupModal isOpen={showSync} onClose={()=>setShowSync(false)} /></div>;
}
