import React from 'react';
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import RegionalSettingsForm from './RegionalSettingsForm';

export default function RegionalSetupGate({ children }) {
  const { preferences } = useRegionalPreferences();
  return preferences.onboarded ? children : <RegionalSettingsForm onboarding />;
}
