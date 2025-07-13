import { create } from 'zustand';

export const useHomeUIStore = create(set => ({
  selectedDate: new Date(),     // Date 객체
  panelSnap: 0.5,               // 0 = 최소, 0.5 = 주, 1 = 월
  setDate: d => set({ selectedDate: d }),
  setSnap: v => set({ panelSnap: v }),
}));
