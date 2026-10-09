import { useEffect } from 'react';
import { useWeather } from '@/lib/WeatherContext';
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import { claimHydrationReward } from '@/lib/mascot';
import { readRegionalPreferences } from '@/lib/regionalPreferences';
import { settleMarketSales } from '@/lib/mascotMarket';

// Reward completed care from any section, including the daily watering list.
// The domain rechecks saved crops, weather freshness and the unique daily key.
export default function MascotCareObserver() {
  const { weather } = useWeather();
  const { preferences } = useRegionalPreferences();
  useEffect(() => {
    let active = true;
    const check = () => {
      if (!active) return;
      try { settleMarketSales({ preferences: readRegionalPreferences() }); }
      catch { /* The market keeps its saved ledger intact on storage failure. */ }
      try { claimHydrationReward(null, { weather, preferences: readRegionalPreferences() }); }
      catch { /* Farming remains available; the mascot page explains storage errors. */ }
    };
    check();
    const events = ['hortaviva_watered_update', 'hortaviva_remote_updated', 'focus'];
    events.forEach(event=>window.addEventListener(event,check));
    const timer = setInterval(check,60000);
    return () => { active = false; clearInterval(timer); events.forEach(event=>window.removeEventListener(event,check)); };
  }, [weather, preferences]);
  return null;
}
