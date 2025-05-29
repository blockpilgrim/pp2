import { create } from 'zustand';

export type ItemFilter = 'all' | 'active' | 'completed';

interface ItemFilterState {
  filter: ItemFilter;
  setFilter: (newFilter: ItemFilter) => void;
}

export const useItemFilterStore = create<ItemFilterState>((set) => ({
  filter: 'all', // Default filter
  setFilter: (newFilter) => set({ filter: newFilter }),
}));
