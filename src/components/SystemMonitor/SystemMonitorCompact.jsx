import { useEffect, useState } from "react"
import { useRollingHistory } from "./useRollingHistory"
import LineGraph from "./LineGraph"

function ThinBar({ value, gradient }) {
  return (
    <div className="h-[6px] w-24 rounded bg-slate-200 overflow-hidden">
      <div
        className={`h-full ${gradient} transition-all duration-500`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

export default function SystemMonitorCompact() {
  const [stats, setStats] = useState(null)
  const history = useRollingHistory(40) // short window = tighter motion

  useEffect(() => {
    window.systemStats.start()

    window.systemStats.onUpdate((data) => {
      setStats(data)

      const ramPercent = Math.round(
        (data.ram.used / data.ram.total) * 100
      )

      history.push(data.cpu, ramPercent)
    })

    return () => window.systemStats.stop()
  }, [])

  if (!stats) return null

  const ramPercent = Math.round(
    (stats.ram.used / stats.ram.total) * 100
  )

  return (
    <div className="
      flex items-center gap-5
      rounded-lg border bg-white
      px-4 py-2 shadow-sm
    ">
      {/* CPU */}
      <StatBlock
        label="CPU"
        value={`${stats.cpu}%`}
        bar={
          <ThinBar
            value={stats.cpu}
            gradient="bg-gradient-to-r from-indigo-500 to-purple-500"
          />
        }
        graph={
          <MiniGraph data={history.cpu} color="#6366f1" />
        }
      />

      {/* RAM */}
      <StatBlock
        label="RAM"
        value={`${ramPercent}%`}
        bar={
          <ThinBar
            value={ramPercent}
            gradient="bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        }
        graph={
          <MiniGraph data={history.ram} color="#10b981" />
        }
      />

      {/* subtle live pulse */}
      <span className="ml-1 h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
    </div>
  )
}

/* ---------- helpers ---------- */

function StatBlock({ label, value, bar, graph }) {
  return (
    <div className="flex flex-col gap-1 text-xs text-slate-700">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>

      {bar}

      {graph}
    </div>
  )
}

function MiniGraph({ data, color }) {
  return (
    <div className="h-6 w-24 opacity-80">
      <LineGraph
        data={data}
        color={color}
        height={24}
        strokeWidth={1.5}
      />
    </div>
  )
}