import { create } from 'zustand';

export const useBottomBarStore = create(set => ({
  visible: true,     
  setVisibe: v => set({ isNavVisible: v }),
}));
