import { describe, test, expect, beforeEach } from 'vitest';
import { CheckpointSystem } from '../src/systems/CheckpointSystem.js';

const MOCK_CHECKPOINTS = [
  { id: 'a', index: 0, xpReward: 100 },
  { id: 'b', index: 1, xpReward: 150 },
  { id: 'c', index: 2, xpReward: 200 },
];

describe('CheckpointSystem', () => {
  let sys;

  beforeEach(() => {
    sys = new CheckpointSystem(MOCK_CHECKPOINTS);
  });

  // ── Initial state ──────────────────────────────────────────
  test('no checkpoints are unlocked initially', () => {
    expect(sys.isUnlocked('a')).toBe(false);
    expect(sys.isUnlocked('b')).toBe(false);
  });

  test('first checkpoint is always unlockable', () => {
    expect(sys.canUnlock('a')).toBe(true);
  });

  test('second checkpoint is not unlockable until first is unlocked', () => {
    expect(sys.canUnlock('b')).toBe(false);
  });

  test('third checkpoint is not unlockable from scratch', () => {
    expect(sys.canUnlock('c')).toBe(false);
  });

  // ── Sequential unlock ──────────────────────────────────────
  test('unlock returns true on valid unlock', () => {
    expect(sys.unlock('a')).toBe(true);
  });

  test('unlock returns false when prerequisites not met', () => {
    expect(sys.unlock('b')).toBe(false);
  });

  test('unlock returns false for already-unlocked checkpoint', () => {
    sys.unlock('a');
    expect(sys.unlock('a')).toBe(false);
  });

  test('isUnlocked reflects unlock', () => {
    sys.unlock('a');
    expect(sys.isUnlocked('a')).toBe(true);
  });

  test('unlocking first enables second', () => {
    sys.unlock('a');
    expect(sys.canUnlock('b')).toBe(true);
  });

  test('sequential unlock chain works', () => {
    sys.unlock('a');
    sys.unlock('b');
    expect(sys.canUnlock('c')).toBe(true);
    expect(sys.unlock('c')).toBe(true);
  });

  // ── getNextUnlockable ──────────────────────────────────────
  test('getNextUnlockable returns first checkpoint when none unlocked', () => {
    expect(sys.getNextUnlockable().id).toBe('a');
  });

  test('getNextUnlockable advances after unlock', () => {
    sys.unlock('a');
    expect(sys.getNextUnlockable().id).toBe('b');
  });

  test('getNextUnlockable returns null when all unlocked', () => {
    sys.unlock('a');
    sys.unlock('b');
    sys.unlock('c');
    expect(sys.getNextUnlockable()).toBeNull();
  });

  // ── getUnlockedIds ─────────────────────────────────────────
  test('getUnlockedIds returns empty array initially', () => {
    expect(sys.getUnlockedIds()).toEqual([]);
  });

  test('getUnlockedIds reflects current state', () => {
    sys.unlock('a');
    sys.unlock('b');
    const ids = sys.getUnlockedIds();
    expect(ids).toContain('a');
    expect(ids).toContain('b');
    expect(ids).not.toContain('c');
  });

  // ── Initialization with pre-unlocked IDs ─────────────────
  test('initializes with pre-unlocked IDs', () => {
    const restored = new CheckpointSystem(MOCK_CHECKPOINTS, ['a', 'b']);
    expect(restored.isUnlocked('a')).toBe(true);
    expect(restored.isUnlocked('b')).toBe(true);
    expect(restored.isUnlocked('c')).toBe(false);
  });

  test('canUnlock reflects restored state correctly', () => {
    const restored = new CheckpointSystem(MOCK_CHECKPOINTS, ['a', 'b']);
    expect(restored.canUnlock('c')).toBe(true);
    expect(restored.canUnlock('b')).toBe(false);
  });

  // ── Reset ──────────────────────────────────────────────────
  test('reset clears all unlocked checkpoints', () => {
    sys.unlock('a');
    sys.unlock('b');
    sys.reset();
    expect(sys.isUnlocked('a')).toBe(false);
    expect(sys.isUnlocked('b')).toBe(false);
    expect(sys.canUnlock('a')).toBe(true);
  });

  // ── Edge cases ─────────────────────────────────────────────
  test('canUnlock returns false for unknown id', () => {
    expect(sys.canUnlock('unknown')).toBe(false);
  });

  test('unlock returns false for unknown id', () => {
    expect(sys.unlock('unknown')).toBe(false);
  });
});
