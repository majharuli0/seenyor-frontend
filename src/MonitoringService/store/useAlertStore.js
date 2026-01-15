import { create } from 'zustand';

export const useAlertStore = create((set) => ({
  totalAlertCount: 0,
  selectedAlert: null,

  setTotalAlert: (count) => {
    set({ totalAlertCount: count });
  },
  setSelectedAlert: (alert) => {
    set({ selectedAlert: alert });
  },
}));
