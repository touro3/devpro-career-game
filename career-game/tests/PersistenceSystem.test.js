import { describe, test, expect, beforeEach } from 'vitest';
import { PersistenceSystem } from '../src/systems/PersistenceSystem.js';

function makeMockStorage() {
  const store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
  };
}

describe('PersistenceSystem', () => {
  let storage;
  let sys;

  beforeEach(() => {
    storage = makeMockStorage();
    sys = new PersistenceSystem(storage);
  });

  // ── Save & Load ────────────────────────────────────────────
  test('save returns true on success', () => {
    expect(sys.save({ xp: 0, unlocked: [] })).toBe(true);
  });

  test('load returns null when nothing is saved', () => {
    expect(sys.load()).toBeNull();
  });

  test('saves and loads state correctly', () => {
    const state = { xp: 300, unlocked: ['a', 'b'] };
    sys.save(state);
    expect(sys.load()).toEqual(state);
  });

  test('overwrites previous save', () => {
    sys.save({ xp: 100, unlocked: ['a'] });
    sys.save({ xp: 500, unlocked: ['a', 'b', 'c'] });
    expect(sys.load()).toEqual({ xp: 500, unlocked: ['a', 'b', 'c'] });
  });

  test('saves and loads complex state', () => {
    const state = { xp: 1050, unlocked: ['foundation', 'university', 'applied_ai'] };
    sys.save(state);
    const loaded = sys.load();
    expect(loaded.xp).toBe(1050);
    expect(loaded.unlocked).toHaveLength(3);
    expect(loaded.unlocked).toContain('university');
  });

  // ── Clear ──────────────────────────────────────────────────
  test('clear removes saved state', () => {
    sys.save({ xp: 100, unlocked: ['a'] });
    sys.clear();
    expect(sys.load()).toBeNull();
  });

  test('load still returns null after clear', () => {
    sys.clear();
    expect(sys.load()).toBeNull();
  });

  // ── Resilience ─────────────────────────────────────────────
  test('load returns null when storage contains invalid JSON', () => {
    storage.setItem('devpro_career_save', 'not-valid-json{{{');
    expect(sys.load()).toBeNull();
  });

  test('save returns false when storage throws', () => {
    const brokenStorage = {
      getItem: () => null,
      setItem: () => { throw new Error('QuotaExceeded'); },
      removeItem: () => {},
    };
    const faultySys = new PersistenceSystem(brokenStorage);
    expect(faultySys.save({ xp: 0 })).toBe(false);
  });
});
