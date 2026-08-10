/**
 * Light/dark mode: the store, and the hook components read it with.
 *
 * The mode is a single `dark` class on <html>. Everything else follows from the
 * token layer (src/index.css + tailwind.config.js), so no component needs to
 * know which theme is active — except canvas code, which can't read a class and
 * uses plotPalette(mode) from ./theme instead.
 *
 * index.html applies the stored mode before first paint, so a dark reload never
 * flashes white. Keep STORAGE_KEY and CLASS_NAME in sync with that script.
 */
import { useSyncExternalStore } from 'react';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'shooting-sim-theme';
const CLASS_NAME = 'dark';

const listeners = new Set<() => void>();

function systemPreference(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Stored choice if there is one, otherwise whatever the OS is set to. */
function readMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* Private mode / storage disabled — fall through to the OS preference. */
  }
  return systemPreference();
}

function apply(mode: ThemeMode) {
  document.documentElement.classList.toggle(CLASS_NAME, mode === 'dark');
}

export function setThemeMode(mode: ThemeMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* Not persisting is survivable; applying it is not. */
  }
  apply(mode);
  for (const listener of listeners) listener();
}

export function toggleThemeMode() {
  setThemeMode(getThemeMode() === 'dark' ? 'light' : 'dark');
}

/** Reads the DOM, not the store, so it always agrees with what is on screen. */
export function getThemeMode(): ThemeMode {
  return document.documentElement.classList.contains(CLASS_NAME) ? 'dark' : 'light';
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * The current mode, re-rendering the caller when it changes. Canvas components
 * must list the result in their draw dependencies so a flip repaints.
 */
export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribe, getThemeMode, () => 'light');
}

/**
 * Applies the stored mode and starts following the OS setting for users who
 * have never picked one explicitly. Call once, from main.tsx.
 */
export function initThemeMode(): void {
  apply(readMode());
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', () => {
    let hasExplicitChoice = false;
    try {
      hasExplicitChoice = localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      /* Can't read storage — treat as no explicit choice and follow the OS. */
    }
    if (hasExplicitChoice) return;
    apply(systemPreference());
    for (const listener of listeners) listener();
  });
}
