import create from 'zustand';

export const useHomeUIStore = create(set => ({
  selectedDate: new Date(), // JS Date object
  panelPosition: 0, // 0=min, 0.5=week, 1=month
  setSelectedDate: date => set({ selectedDate: date }),
  setPanelPosition: pos => set({ panelPosition: pos }),
}));