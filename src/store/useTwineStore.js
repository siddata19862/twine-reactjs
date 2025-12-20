import { create } from "zustand"

export const useTwineStore = create((set) => ({
  twine: null,
  setTwine: (twine) => set({ twine }),
}))