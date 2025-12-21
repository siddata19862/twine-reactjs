import { create } from "zustand"

export const useSystemStore = create((set) => ({
  info: null,
  stats: null,

  setInfo: (info) => set({ info }),
  setStats: (stats) => set({ stats }),
}))