export class CareerMentoringSystem {
  constructor(storage = null) {
    this._storage = storage ?? (typeof localStorage !== 'undefined' ? localStorage : null);
    const saved = this._loadState();
    this._marketAuthority = saved.marketAuthority ?? 0;
    this._networking = saved.networking ?? 0;
    this._completedSessions = new Set(saved.completedSessions ?? []);
    this._buffActive = saved.buffActive ?? false;
    this._buffActionsRemaining = saved.buffActionsRemaining ?? 0;
  }

  get marketAuthority() { return this._marketAuthority; }
  get networking() { return this._networking; }
  get isBuffActive() { return this._buffActive; }
  get buffActionsRemaining() { return this._buffActionsRemaining; }

  registerSession(session) {
    if (this._completedSessions.has(session.id)) return false;
    this._completedSessions.add(session.id);
    this._marketAuthority += session.marketAuthorityPoints;
    this._networking += session.networkingPoints;
    if (session.buff === 'market_ready') this._activateMarketReadyBuff();
    this._saveState();
    return true;
  }

  consumeBuffAction() {
    if (!this._buffActive) return false;
    this._buffActionsRemaining--;
    if (this._buffActionsRemaining <= 0) {
      this._buffActive = false;
      this._buffActionsRemaining = 0;
    }
    this._saveState();
    return true;
  }

  getMarketReadySuccessBoost() {
    return this._buffActive ? 1.5 : 1.0;
  }

  isSessionCompleted(sessionId) {
    return this._completedSessions.has(sessionId);
  }

  getCompletedSessions() {
    return [...this._completedSessions];
  }

  _activateMarketReadyBuff() {
    this._buffActive = true;
    this._buffActionsRemaining = 10;
  }

  _saveState() {
    if (!this._storage) return;
    try {
      this._storage.setItem('career_mentoring', JSON.stringify({
        marketAuthority: this._marketAuthority,
        networking: this._networking,
        completedSessions: [...this._completedSessions],
        buffActive: this._buffActive,
        buffActionsRemaining: this._buffActionsRemaining,
      }));
    } catch {}
  }

  _loadState() {
    if (!this._storage) return {};
    try {
      return JSON.parse(this._storage.getItem('career_mentoring') ?? '{}');
    } catch { return {}; }
  }

  clear() {
    this._marketAuthority = 0;
    this._networking = 0;
    this._completedSessions = new Set();
    this._buffActive = false;
    this._buffActionsRemaining = 0;
    if (this._storage) {
      try { this._storage.removeItem('career_mentoring'); } catch {}
    }
  }
}
