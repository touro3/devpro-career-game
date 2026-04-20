import { describe, test, expect } from 'vitest';
import { XPSystem } from '../src/systems/XPSystem.js';

describe('XPSystem', () => {
  test('starts at zero by default', () => {
    const xp = new XPSystem();
    expect(xp.xp).toBe(0);
  });

  test('accepts an initial XP value', () => {
    const xp = new XPSystem(250);
    expect(xp.xp).toBe(250);
  });

  test('addXP increases the total', () => {
    const xp = new XPSystem(0);
    xp.addXP(100);
    expect(xp.xp).toBe(100);
    xp.addXP(50);
    expect(xp.xp).toBe(150);
  });

  test('addXP returns the new total', () => {
    const xp = new XPSystem(0);
    expect(xp.addXP(200)).toBe(200);
  });

  test('throws on negative XP amounts', () => {
    const xp = new XPSystem(0);
    expect(() => xp.addXP(-10)).toThrow();
  });

  test('addXP(0) is a no-op', () => {
    const xp = new XPSystem(100);
    xp.addXP(0);
    expect(xp.xp).toBe(100);
  });

  test('percentage is 0 when totalPossibleXP is not set', () => {
    const xp = new XPSystem(500);
    expect(xp.percentage).toBe(0);
  });

  test('percentage calculates correctly', () => {
    const xp = new XPSystem(250);
    xp.setTotalPossibleXP(1000);
    expect(xp.percentage).toBe(25);
  });

  test('percentage rounds to nearest integer', () => {
    const xp = new XPSystem(1);
    xp.setTotalPossibleXP(3);
    expect(xp.percentage).toBe(33);
  });

  test('percentage caps at 100', () => {
    const xp = new XPSystem(2000);
    xp.setTotalPossibleXP(1000);
    expect(xp.percentage).toBe(100);
  });

  test('reset sets XP to 0', () => {
    const xp = new XPSystem(500);
    xp.reset();
    expect(xp.xp).toBe(0);
  });

  test('totalPossibleXP is accessible', () => {
    const xp = new XPSystem();
    xp.setTotalPossibleXP(2050);
    expect(xp.totalPossibleXP).toBe(2050);
  });
});
