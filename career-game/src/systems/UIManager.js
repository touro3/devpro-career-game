export class UIManager {
  constructor() {
    this._modal = document.getElementById('checkpoint-modal');
    this._modalPhase = document.getElementById('modal-phase');
    this._modalTitle = document.getElementById('modal-title');
    this._modalDesc = document.getElementById('modal-desc');
    this._modalSkills = document.getElementById('modal-skills');
    this._modalXP = document.getElementById('modal-xp');
    this._modalClose = document.getElementById('modal-close');

    this._progressPanel = document.getElementById('progress-panel');
    this._progressList = document.getElementById('progress-list');
    this._progressClose = document.getElementById('progress-close');

    this._xpFill = document.getElementById('xp-fill');
    this._xpValue = document.getElementById('xp-value');

    this._interactPrompt = document.getElementById('interact-prompt');
    this._lockedToast = document.getElementById('locked-toast');
    this._toastTimer = null;

    this._onModalClose = null;
    this._onProgressClose = null;

    this._modalClose.addEventListener('click', () => this.hideModal());
    this._progressClose.addEventListener('click', () => this.hideProgress());
    this._modal.addEventListener('click', e => { if (e.target === this._modal) this.hideModal(); });
    this._progressPanel.addEventListener('click', e => { if (e.target === this._progressPanel) this.hideProgress(); });
  }

  showModal(checkpoint, isFirstVisit, onClose) {
    this._onModalClose = onClose ?? null;
    this._modalPhase.textContent = `Phase ${checkpoint.index + 1} of 8`;
    this._modalTitle.textContent = checkpoint.title;
    this._modalTitle.style.color = this._hexColor(checkpoint.color);
    this._modalDesc.textContent = checkpoint.description;

    this._modalSkills.innerHTML = checkpoint.skills
      .map(s => `<span class="skill-tag">${s}</span>`)
      .join('');

    this._modalXP.textContent = isFirstVisit
      ? `+${checkpoint.xpReward} XP earned`
      : `${checkpoint.xpReward} XP · revisited`;

    this._modal.classList.remove('hidden');
  }

  hideModal() {
    this._modal.classList.add('hidden');
    if (this._onModalClose) { this._onModalClose(); this._onModalClose = null; }
  }

  isModalOpen() {
    return !this._modal.classList.contains('hidden');
  }

  showProgress(checkpoints, unlockedIds) {
    const unlockedSet = new Set(unlockedIds);
    this._progressList.innerHTML = checkpoints
      .map(cp => {
        const unlocked = unlockedSet.has(cp.id);
        const dot = `<div class="progress-dot" style="background:${unlocked ? this._hexColor(cp.color) : '#333'}"></div>`;
        return `
          <div class="progress-item ${unlocked ? 'unlocked' : 'locked'}">
            ${dot}
            <div class="progress-info">
              <div class="p-title">${cp.title}</div>
              <div class="p-subtitle">${cp.subtitle}</div>
            </div>
          </div>`;
      })
      .join('');
    this._progressPanel.classList.remove('hidden');
  }

  hideProgress() {
    this._progressPanel.classList.add('hidden');
    if (this._onProgressClose) { this._onProgressClose(); this._onProgressClose = null; }
  }

  isProgressOpen() {
    return !this._progressPanel.classList.contains('hidden');
  }

  updateXP(xp, percentage, total) {
    this._xpFill.style.width = `${percentage}%`;
    this._xpValue.textContent = `${xp} / ${total}`;
  }

  showInteractPrompt(visible) {
    this._interactPrompt.classList.toggle('hidden', !visible);
  }

  showLockedToast() {
    clearTimeout(this._toastTimer);
    this._lockedToast.classList.remove('hidden');
    this._toastTimer = setTimeout(() => this._lockedToast.classList.add('hidden'), 2000);
  }

  _hexColor(phaserHex) {
    return `#${phaserHex.toString(16).padStart(6, '0')}`;
  }
}
