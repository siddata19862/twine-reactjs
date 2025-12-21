import { create } from "zustand"

export const useProjectRegistryStore = create((set) => ({
  projects: [],
  loading: false,

  refresh: async () => {
    set({ loading: true })

    const list = await window.electron.invoke("registry:get")

    // Deduplicate by projectDir (keep latest)
    const map = new Map()

    list?.projects.forEach((p) => {
      const existing = map.get(p.projectDir)
      if (
        !existing ||
        new Date(p.lastOpenedAt) > new Date(existing.lastOpenedAt)
      ) {
        map.set(p.projectDir, p)
      }
    })

    const projects = Array.from(map.values()).sort(
      (a, b) =>
        new Date(b.lastOpenedAt) - new Date(a.lastOpenedAt)
    )

    set({ projects, loading: false })
  },
}))