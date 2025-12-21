import { useEffect, useState } from "react"
import PipelineStatus from "./PipelineStatus"

export default function PipelinePanel() {
  const [pipelineStatus, setPipelineStatus] = useState(null)

  useEffect(() => {
    let mounted = true

    // 1️⃣ Initial snapshot (direct file read)
    window.electron
      .invoke("pipeline:getStatus")
      .then(status => {
        if (mounted && status) {
          setPipelineStatus(status)
        }
      })
      .catch(err => {
        console.error("Failed to get pipeline status", err)
      })

    // 2️⃣ Live updates (file watcher → emit)
    const off = window.electron.on("pipeline:status", payload => {
      // payload = { projectId, status }
      setPipelineStatus(payload.status)
    })

    // 3️⃣ Cleanup
    return () => {
      mounted = false
      off()
    }
  }, [])

  return (
    <div className="p-4">
      {pipelineStatus ? (
        <PipelineStatus status={pipelineStatus} reverse />
      ) : (
        <div className="text-xs text-slate-500">
          Waiting for pipeline status…
        </div>
      )}
    </div>
  )
}