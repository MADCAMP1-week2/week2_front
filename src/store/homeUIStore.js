import { create } from 'zustand';

export const useHomeUIStore = create(set => ({
  selectedDate: new Date(),     // Date 객체
  todayDate: new Date(),
  panelSnap: 0.5,               // 0 = 최소, 0.5 = 주, 1 = 월
  panelMonthOffset: 0, // 0 = 현재 달, -1 = 이전달, 1 = 다음달
  setDate: d => set({ selectedDate: d }),
  setToday: d=> set({ todayDate: d}),
  setSnap: v => set({ panelSnap: v }),
  setMonthOffset: v => set({ panelMonthOffset: v }),
}));
