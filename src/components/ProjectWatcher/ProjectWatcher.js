import { useEffect } from "react"
import { useTwineStore } from "../../store/useTwineStore"
//import { useTwineStore } from "@/store/useTwineStore"

export default function ProjectWatcher() {
  const setTwine = useTwineStore((s) => s.setTwine)

  useEffect(() => {
    // initial load
    window.projectApi.getCurrentObject().then(setTwine)

    const handler = (twine) => {
      console.log("🧬 twine changed - projectwatcher", twine)
      setTwine(twine)
    }

    window.projectApi.onTwineChanged(handler)

    return () => {
      window.projectApi.offTwineChanged(handler)
    }
  }, [setTwine])

  return null // 👈 watcher only, no UI
}