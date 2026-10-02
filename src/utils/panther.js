// "Panther Mode" — unlocked by the Easter egg. Stored locally in the visitor's browser only.
const EGG = 'rohi-egg'
const MODE = 'rohi-panther'
const read = (k) => { try { return localStorage.getItem(k) === '1' } catch { return false } }
const write = (k, v) => { try { localStorage.setItem(k, v ? '1' : '0') } catch { /* ignore */ } }

export const isUnlocked = () => read(EGG)
export const unlock = () => write(EGG, true)
export const isPanther = () => read(MODE)
export function setPanther(on) {
  write(MODE, on)
  document.documentElement.classList.toggle('panther', on)
}
export function applySavedPanther() {
  if (isUnlocked() && isPanther()) document.documentElement.classList.add('panther')
}
