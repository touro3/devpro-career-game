export class CheckpointSystem {
  constructor(checkpoints, unlockedIds = []) {
    this._checkpoints = checkpoints;
    this._unlocked = new Set(unlockedIds);
  }

  isUnlocked(id) {
    return this._unlocked.has(id);
  }

  canUnlock(id) {
    const cp = this._checkpoints.find(c => c.id === id);
    if (!cp) return false;
    if (this._unlocked.has(id)) return false;
    if (cp.index === 0) return true;
    const prev = this._checkpoints.find(c => c.index === cp.index - 1);
    return prev ? this._unlocked.has(prev.id) : false;
  }

  unlock(id) {
    if (!this.canUnlock(id)) return false;
    this._unlocked.add(id);
    return true;
  }

  getUnlockedIds() {
    return [...this._unlocked];
  }

  getNextUnlockable() {
    return this._checkpoints.find(cp => this.canUnlock(cp.id)) ?? null;
  }

  reset() {
    this._unlocked.clear();
  }
}
