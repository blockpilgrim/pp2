import { create } from 'zustand';

/**
 * @typedef {object} AppState
 * @property {number} counter - A counter value.
 * @property {string} theme - The current theme ('light' or 'dark').
 * @property {() => void} increment - Action to increment the counter.
 * @property {() => void} decrement - Action to decrement the counter.
 * @property {() => void} toggleTheme - Action to toggle the theme.
 */

/**
 * Zustand store for global application state.
 * @returns {AppState} The store's state and actions.
 */
const useAppStore = create((set) => ({
  counter: 0,
  theme: 'light',
  increment: () => set((state) => ({ counter: state.counter + 1 })),
  decrement: () => set((state) => ({ counter: state.counter - 1 })),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));

export default useAppStore;
