import React, { createContext, useContext, useEffect, useState } from 'react';
import { APPEARANCE_STORAGE_KEY, APPEARANCE_CHANGE_EVENT, THEMES, readAppearance, writeAppearance } from './appearance';
const AppearanceContext = createContext(null);
export function AppearanceProvider({ children }) {
  const [appearance, setAppearance] = useState(readAppearance);
  useEffect(() => {
    const update = () => setAppearance(readAppearance());
    const storage = event => { if (!event.key || event.key === APPEARANCE_STORAGE_KEY) update(); };
    window.addEventListener(APPEARANCE_CHANGE_EVENT, update); window.addEventListener('storage', storage);
    return () => { window.removeEventListener(APPEARANCE_CHANGE_EVENT, update); window.removeEventListener('storage', storage); };
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    [50,100,200,300,400,500,600,700,800,900,950].forEach((shade, index) => {
      const hex = THEMES[appearance.theme][index];
      root.style.setProperty(`--hv-color-${shade}`, [0,2,4].map(start => parseInt(hex.slice(start,start+2),16)).join(' '));
    });
    root.dataset.hvTexture = appearance.texture;
    root.dataset.hvFont = appearance.fontSize;
    root.dataset.hvMotion = appearance.reduceMotion ? 'reduced' : 'normal';
    root.dataset.hvContrast = appearance.highContrast ? 'high' : 'normal';
  }, [appearance]);
  return <AppearanceContext.Provider value={{ appearance, saveAppearance: writeAppearance }}>{children}</AppearanceContext.Provider>;
}
export const useAppearance = () => useContext(AppearanceContext);
