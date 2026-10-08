import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { readRegionalPreferences, writeRegionalPreferences, sanitizeRegionalPreferences, REGIONAL_STORAGE_KEY, REGIONAL_CHANGE_EVENT } from './regionalPreferences.js';

const RegionalPreferencesContext = createContext(null);

export function RegionalPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(readRegionalPreferences);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const changed = event => setPreferences(event.detail ? sanitizeRegionalPreferences(event.detail) : readRegionalPreferences());
    const storage = event => { if (event.key === REGIONAL_STORAGE_KEY || event.key === null) setPreferences(readRegionalPreferences()); };
    window.addEventListener(REGIONAL_CHANGE_EVENT, changed);
    window.addEventListener('storage', storage);
    return () => { window.removeEventListener(REGIONAL_CHANGE_EVENT, changed); window.removeEventListener('storage', storage); };
  }, []);
  const savePreferences = useCallback(value => {
    const next = sanitizeRegionalPreferences(value);
    try { const saved = writeRegionalPreferences(next); setPreferences(saved); setStorageError(false); return { preferences: saved, persisted: true }; }
    catch { setPreferences(next); setStorageError(true); return { preferences: next, persisted: false }; }
  }, []);
  return <RegionalPreferencesContext.Provider value={{ preferences, savePreferences, storageError }}>{children}</RegionalPreferencesContext.Provider>;
}

export function useRegionalPreferences() {
  const context = useContext(RegionalPreferencesContext);
  if (!context) throw new Error('RegionalPreferencesProvider is required');
  return context;
}
