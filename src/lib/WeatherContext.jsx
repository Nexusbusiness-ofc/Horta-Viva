import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRegionalPreferences } from './RegionalPreferencesContext.jsx';
import { loadWeather, weatherCoordinates } from './weather.js';

const WeatherContext = createContext({ weather: null, loading: false, error: null, refresh: () => {} });

export function WeatherProvider({ children }) {
  const { preferences } = useRegionalPreferences();
  const [state, setState] = useState({ weather: null, loading: false, error: null });
  const [revision, setRevision] = useState(0);
  const [online, setOnline] = useState(() => typeof navigator === 'undefined' || navigator.onLine);
  const coordinates = weatherCoordinates(preferences);
  const latitude = coordinates?.latitude;
  const longitude = coordinates?.longitude;
  const enabled = Boolean(preferences.weatherEnabled && coordinates);
  const timeZone = preferences.timeZone;

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    const timer = setInterval(() => setRevision(value => value + 1), 60 * 60 * 1000);
    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!enabled) { setState({ weather: null, loading: false, error: null }); return undefined; }
    const controller = new AbortController();
    // Never retain another location's forecast while a replacement is loading.
    setState(previous => ({ weather: previous.weather?.location?.latitude === latitude && previous.weather?.location?.longitude === longitude ? previous.weather : null, loading: true, error: null }));
    loadWeather({ weatherEnabled: true, latitude, longitude, timeZone }, { signal: controller.signal }).then(weather => {
      if (!controller.signal.aborted) setState({ weather, loading: false, error: weather?.offline ? 'offline' : null });
    }).catch(error => {
      if (!controller.signal.aborted) setState({ weather: null, loading: false, error: error.code || 'unavailable' });
    });
    return () => controller.abort();
  }, [enabled, latitude, longitude, timeZone, revision, online]);

  const refresh = useCallback(() => setRevision(value => value + 1), []);
  useEffect(() => {
    const expiry = Date.parse(state.weather?.expiresAt);
    if (!Number.isFinite(expiry) || state.weather?.isStale) return undefined;
    const timer = setTimeout(() => setState(previous => previous.weather ? { ...previous, weather: { ...previous.weather, isStale: true, adviceAllowed: false } } : previous), Math.max(0, expiry - Date.now()));
    return () => clearTimeout(timer);
  }, [state.weather?.expiresAt, state.weather?.isStale]);
  return <WeatherContext.Provider value={{ ...state, refresh }}>{children}</WeatherContext.Provider>;
}

export function useWeather() { return useContext(WeatherContext); }
