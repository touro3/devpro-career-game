export class XPSystem {
  constructor(initialXP = 0) {
    this._xp = initialXP;
    this._totalPossibleXP = 0;
  }

  setTotalPossibleXP(total) {
    this._totalPossibleXP = total;
  }

  addXP(amount) {
    if (amount < 0) throw new Error('XP amount must be non-negative');
    this._xp += amount;
    return this._xp;
  }

  get xp() {
    return this._xp;
  }

  get totalPossibleXP() {
    return this._totalPossibleXP;
  }

  get percentage() {
    if (this._totalPossibleXP === 0) return 0;
    return Math.min(100, Math.round((this._xp / this._totalPossibleXP) * 100));
  }

  reset() {
    this._xp = 0;
  }
}
