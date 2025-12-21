import { useEffect, useState } from "react"
import PipelineStatus from "./PipelineStatus"
//import PipelineStatus from "./PipelineStatus"


export default function PipelinePanel() {
  const [pipelineStatus, setPipelineStatus] = useState(null)

  useEffect(() => {
    const off = window.electron.on("pipeline:status", payload => {
      console.log("pipelineStatus", payload)
      setPipelineStatus(payload.status)   // 👈 payload IS the status
    })

    return off
  }, [])

  return (
    <div className="p-4">
      {pipelineStatus ? (
        <PipelineStatus status={pipelineStatus} />
      ) : (
        <div className="text-xs text-slate-500">
          Waiting for pipeline status…
        </div>
      )}
    </div>
  )
}