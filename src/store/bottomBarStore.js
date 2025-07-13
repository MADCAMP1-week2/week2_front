import { create } from 'zustand';

export const useBottomBarStore = create(set => ({
  visible: true,     
  setVisible: v => set({ visible: v }),
}));
