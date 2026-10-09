import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { cachedList } from '@/lib/offlineCatalog';
import { readMascotState, getMascotView, getMascotHydration, MASCOT_CHANGE_EVENT } from '@/lib/mascot';
import { getLastWateredMap } from '@/lib/smartAlerts';
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import { useWeather } from '@/lib/WeatherContext';
import { readAccountScope } from '@/lib/accountScope';

export default function useMascotFarm() {
  const { preferences } = useRegionalPreferences();
  const { weather } = useWeather();
  const [snapshot, setSnapshot] = useState(null);
  const loadedScope = snapshot?.scope ?? null;
  const state = loadedScope !== null && loadedScope === readAccountScope() ? snapshot.state : null;
  const [farm, setFarm] = useState({ plantings: [], plants: [] });
  const [now, setNow] = useState(() => new Date());
  const [watered, setWatered] = useState(getLastWateredMap);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sequence = useRef(0);
  const mounted = useRef(true);
  const visibleScope = useRef(readAccountScope());
  const refresh = useCallback(async () => {
    const current = ++sequence.current;
    const scope = readAccountScope();
    if (visibleScope.current !== scope) {
      visibleScope.current = scope;
      setSnapshot(null); setFarm({ plantings: [], plants: [] }); setWatered({});
    }
    if (scope === null) {
      setSnapshot(null); setFarm({ plantings: [], plants: [] }); setWatered({});
      setError('storage'); setLoading(false); return;
    }
    const isCurrent = () => mounted.current && current === sequence.current && scope !== null && scope === readAccountScope();
    let next;
    try {
      next = readMascotState();
      const [plantings, plants] = await Promise.all([
        base44.entities.Planting.list(),
        cachedList('plants', () => base44.entities.Plant.list()),
      ]);
      if (!isCurrent()) return;
      setSnapshot({ state: next, scope }); setFarm({ plantings, plants }); setWatered(getLastWateredMap()); setNow(new Date()); setError(null);
    } catch (failure) {
      if (isCurrent()) {
        // Keep a readable warehouse available if loading the farm fails.
        if (next) setSnapshot({ state: next, scope });
        setError(next || failure?.code === 'invalid_farm_data' ? 'load' : 'storage');
      }
    } finally {
      if (isCurrent()) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    let queued;
    const changed = () => {
      sequence.current++;
      const scope = readAccountScope();
      if (scope !== visibleScope.current) {
        visibleScope.current = scope;
        setSnapshot(null); setFarm({ plantings: [], plants: [] }); setWatered({}); setLoading(true);
      }
      clearTimeout(queued); queued = setTimeout(refresh, 60);
    };
    const focus = () => { if (!document.hidden) refresh(); };
    const tick = setInterval(() => { setNow(new Date()); setWatered(getLastWateredMap()); }, 60_000);
    const events = [MASCOT_CHANGE_EVENT, 'hortaviva_data_changed', 'hortaviva_remote_updated', 'hortaviva_auth_changed', 'hortaviva_watered_update', 'storage', 'focus'];
    for (const event of events) window.addEventListener(event, changed);
    document.addEventListener('visibilitychange', focus);
    return () => {
      mounted.current = false; sequence.current++;
      clearInterval(tick); clearTimeout(queued);
      for (const event of events) window.removeEventListener(event, changed);
      document.removeEventListener('visibilitychange', focus);
    };
  }, [refresh]);

  const view = useMemo(() => state ? getMascotView(state, { now, timeZone: preferences.timeZone }) : null, [state, now, preferences.timeZone]);
  const hydration = useMemo(() => getMascotHydration({ ...farm, preferences, weather, lastWatered: watered, now }), [farm, preferences, weather, watered, now]);
  return { view, scope: loadedScope, hydration, preferences, weather, loading, error, refresh };
}
