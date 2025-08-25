import { APP_VERSION, SETTINGS_KEY } from './constants';
import type { AppSettings, StoreConfig } from './types';

const PRESET_STORES: StoreConfig[] = [
  {
    id: 'store-yakin',
    name: '夜勤',
    url: 'https://docs.google.com/spreadsheets/d/1gCGyxiXXxOOhgHG2tk3BlzMpXuaWQULacySlIhhoWRY/edit'
  },
  {
    id: 'store-higashionuma',
    name: '相模原東大沼店',
    url: 'https://docs.google.com/spreadsheets/d/1fEMEasqSGU30DuvCx6O6D0nJ5j6m6WrMkGTAaSQuqBY/edit'
  },
  {
    id: 'store-kobuchi',
    name: '古淵駅前店',
    url: 'https://docs.google.com/spreadsheets/d/1hSD3sdIQftusWcNegZnGbCtJmByZhzpAvLJegDoJckQ/edit'
  },
  {
    id: 'store-hashimoto5',
    name: '相模原橋本五丁目店',
    url: 'https://docs.google.com/spreadsheets/d/1YYvWZaF9Li_RHDLevvOm2ND8ASJ3864uHRkDAiWBEDc/edit'
  },
  {
    id: 'store-takamori7',
    name: '伊勢原高森七丁目店',
    url: 'https://docs.google.com/spreadsheets/d/1PfEQRnvHcKS5hJ6gkpJQc0VFjDoJUBhHl7JTTyJheZc/edit'
  }
];

export function defaultSettings(): AppSettings {
  return {
    version: APP_VERSION,
    baseWage: 1162,
    overtimeMultiplier: 1.25,
    adjustMinutes: 20,
    stores: PRESET_STORES
  };
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppSettings;
      if (parsed.version === APP_VERSION) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load settings', e);
  }
  const defaults = defaultSettings();
  saveSettings(defaults);
  return defaults;
}

export function saveSettings(next: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
}
