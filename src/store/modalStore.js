import { create } from 'zustand';

export const useModalStore = create((set) => ({
  visible: false,
  modalDateKey: null,
  showDateModal: (key) => set({ visible: true, modalDateKey: key }),
  hideModal: () => set({ visible: false, modalDateKey: null }),
}));