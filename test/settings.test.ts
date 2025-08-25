import { describe, it, expect, beforeEach } from 'vitest';
import { loadSettings, saveSettings, defaultSettings } from '../src/settings';
import { SETTINGS_KEY } from '../src/constants';

const createMockStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => store.delete(k),
    clear: () => store.clear(),
  } as Storage;
};

beforeEach(() => {
  (globalThis as any).localStorage = createMockStorage();
});

describe('settings persistence', () => {
  it('loads defaults when storage empty', () => {
    const s = loadSettings();
    const def = defaultSettings();
    expect(s).toEqual(def);
  });

  it('saves and loads settings', () => {
    const s = defaultSettings();
    s.baseWage = 2000;
    saveSettings(s);
    const raw = localStorage.getItem(SETTINGS_KEY);
    expect(raw).not.toBeNull();
    const loaded = loadSettings();
    expect(loaded.baseWage).toBe(2000);
  });
});
