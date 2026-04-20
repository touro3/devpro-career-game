const STORAGE_KEY = 'devpro_career_save';

export class PersistenceSystem {
  constructor(storage = globalThis.localStorage) {
    this._storage = storage;
  }

  save(state) {
    try {
      this._storage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  load() {
    try {
      const raw = this._storage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  clear() {
    this._storage.removeItem(STORAGE_KEY);
  }
}
