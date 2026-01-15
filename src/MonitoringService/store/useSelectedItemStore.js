import { create } from 'zustand';

export const useSelectedItemStore = create((set) => ({
  selectedItem: null,

  setSelectedItem: (selectedItem) => set({ selectedItem }),
}));
