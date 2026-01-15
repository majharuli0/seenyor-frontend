import { create } from 'zustand';

export const useCustomerStore = create((set) => ({
  customers: [],
  selectedCustomer: null,

  setCustomers: (customers) => set({ customers }),
  setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),
}));
