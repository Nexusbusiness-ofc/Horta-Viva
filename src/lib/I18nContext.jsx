import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import { normalizeLanguage, translate } from '@/lib/i18n';

const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const { preferences } = useRegionalPreferences();
  const language = normalizeLanguage(preferences.language);
  const t = useCallback((key, vars = {}) => translate(key, language, vars), [language]);
  const locale = language === 'en' ? 'en-GB' : language === 'es' ? 'es-ES' : language;
  const value = useMemo(() => ({ t, language, locale }), [t, language, locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n requires I18nProvider');
  return context;
}

/** Long technical catalog descriptions retain the source language for accuracy. */
export function CatalogLanguageNote({ className = '' }) {
  const { t, language } = useI18n();
  if (language === 'pt-PT') return null;
  return <p className={`rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 ${className}`} role="note">{t('As descrições técnicas do catálogo e os guias detalhados mantêm o português original. Os nomes e os controlos são traduzidos; as recomendações de época dependem da região escolhida.')}</p>;
}
