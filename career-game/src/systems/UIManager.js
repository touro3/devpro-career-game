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

    this._dialogBox = document.getElementById('dialog-box');
    this._dialogSpeaker = document.getElementById('dialog-speaker');
    this._dialogText = document.getElementById('dialog-text');
    this._dialogCounter = document.getElementById('dialog-counter');
    this._dialogHint = document.getElementById('dialog-hint');

    this._endingScreen = document.getElementById('ending-screen');
    this._endingClose = document.getElementById('ending-close');

    this._xpFill = document.getElementById('xp-fill');
    this._xpValue = document.getElementById('xp-value');

    this._interactPrompt = document.getElementById('interact-prompt');
    this._lockedToast = document.getElementById('locked-toast');
    this._toastTimer = null;

    this._onModalClose = null;
    this._onProgressClose = null;
    this._dialogOnClose = null;
    this._endingOnClose = null;
    this._dialogLines = [];
    this._dialogIndex = 0;
    this._dialogNameColor = '#ffffff';
    this._dialogTypingComplete = false;
    this._typewriterTimer = null;

    this._modalClose.addEventListener('click', () => this.hideModal());
    this._progressClose.addEventListener('click', () => this.hideProgress());
    this._endingClose.addEventListener('click', () => this.hideEnding());
    this._modal.addEventListener('click', e => { if (e.target === this._modal) this.hideModal(); });
    this._progressPanel.addEventListener('click', e => { if (e.target === this._progressPanel) this.hideProgress(); });
    this._endingScreen.addEventListener('click', e => { if (e.target === this._endingScreen) this.hideEnding(); });
  }

  // ── Checkpoint modal ───────────────────────────────────────

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

  // ── Progress panel ─────────────────────────────────────────

  showProgress(checkpoints, unlockedIds, onClose) {
    this._onProgressClose = onClose ?? null;
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

  // ── NPC dialog ─────────────────────────────────────────────

  showDialog(npcData, onClose) {
    this._dialogLines = npcData.dialog;
    this._dialogIndex = 0;
    this._dialogNameColor = npcData.nameColor;
    this._dialogOnClose = onClose ?? null;
    this._dialogBox.classList.remove('hidden');
    this._renderDialogLine(0);
  }

  advanceDialog() {
    if (!this._dialogTypingComplete) {
      if (this._typewriterTimer) { clearInterval(this._typewriterTimer); this._typewriterTimer = null; }
      this._dialogText.textContent = this._dialogLines[this._dialogIndex].text;
      this._dialogTypingComplete = true;
      return;
    }
    this._dialogIndex++;
    if (this._dialogIndex >= this._dialogLines.length) {
      this.hideDialog();
    } else {
      this._renderDialogLine(this._dialogIndex);
    }
  }

  hideDialog() {
    this._dialogBox.classList.add('hidden');
    if (this._typewriterTimer) { clearInterval(this._typewriterTimer); this._typewriterTimer = null; }
    if (this._dialogOnClose) { this._dialogOnClose(); this._dialogOnClose = null; }
  }

  isDialogOpen() {
    return !this._dialogBox.classList.contains('hidden');
  }

  _renderDialogLine(index) {
    const line = this._dialogLines[index];
    const isPlayer = line.speaker === 'PLAYER';

    this._dialogSpeaker.textContent = line.speaker;
    this._dialogSpeaker.style.color = isPlayer ? '#60a5fa' : this._dialogNameColor;
    this._dialogCounter.textContent = `${index + 1} / ${this._dialogLines.length}`;
    this._dialogHint.innerHTML = index < this._dialogLines.length - 1
      ? 'Press <kbd>E</kbd> to continue'
      : 'Press <kbd>E</kbd> to close';

    this._dialogText.textContent = '';
    this._dialogTypingComplete = false;

    let i = 0;
    const text = line.text;
    this._typewriterTimer = setInterval(() => {
      this._dialogText.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(this._typewriterTimer);
        this._typewriterTimer = null;
        this._dialogTypingComplete = true;
      }
    }, 22);
  }

  // ── HUD ────────────────────────────────────────────────────

  updateXP(xp, percentage, total) {
    this._xpFill.style.width = `${percentage}%`;
    this._xpValue.textContent = `${xp} / ${total}`;
  }

  showInteractPrompt(visible, isNPC = false) {
    this._interactPrompt.classList.toggle('hidden', !visible);
    if (visible) {
      this._interactPrompt.innerHTML = isNPC
        ? 'Press <kbd>E</kbd> to talk'
        : 'Press <kbd>E</kbd> to enter';
    }
  }

  showLockedToast() {
    clearTimeout(this._toastTimer);
    this._lockedToast.classList.remove('hidden');
    this._toastTimer = setTimeout(() => this._lockedToast.classList.add('hidden'), 2000);
  }

  // ── Ending screen ──────────────────────────────────────────

  showEnding(onClose) {
    this._endingOnClose = onClose ?? null;
    this._endingScreen.classList.remove('hidden');
  }

  hideEnding() {
    this._endingScreen.classList.add('hidden');
    if (this._endingOnClose) { this._endingOnClose(); this._endingOnClose = null; }
  }

  isEndingOpen() {
    return !this._endingScreen.classList.contains('hidden');
  }

  _hexColor(phaserHex) {
    return `#${phaserHex.toString(16).padStart(6, '0')}`;
  }
}
