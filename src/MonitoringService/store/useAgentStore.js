import { create } from 'zustand';

export const useAgentStore = create((set) => ({
  users: [],
  selectedAgent: null,

  setAgents: (users) => set({ users }),
  setSelectedAgent: (selectedAgent) => set({ selectedAgent }),
}));
