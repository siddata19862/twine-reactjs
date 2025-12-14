import { useEffect, useState } from "react"
import { useRollingHistory } from "./useRollingHistory"
import LineGraph from "./LineGraph"

function Bar({ value, color }) {
  return (
    <div className="h-2 w-28 rounded bg-slate-200 overflow-hidden">
      <div
        className={`h-full ${color} transition-all`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

export default function SystemMonitor() {
  const [stats, setStats] = useState(null)
  const history = useRollingHistory()

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
    <div className="space-y-2 text-xs text-slate-700">
      {/* CPU */}
      <div className="flex items-center gap-2">
        <span className="w-10 font-medium">CPU</span>

        <Bar
          value={stats.cpu}
          color="bg-gradient-to-r from-blue-500 to-purple-500"
        />

        

        <span className="w-12 text-right tabular-nums">
          {stats.cpu}%
        </span>
      </div>

      <LineGraph
          data={history.cpu}
          color="#6366f1"
        />

      {/* RAM */}
      <div className="flex items-center gap-2">
        <span className="w-10 font-medium">RAM</span>

        <Bar
          value={ramPercent}
          color="bg-gradient-to-r from-emerald-500 to-teal-500"
        />

        

        <span className="w-28 text-right tabular-nums">
          {stats.ram.used} / {stats.ram.total} MB ({ramPercent}%)
        </span>
      </div>
      <LineGraph
          data={history.ram}
          color="#10b981"
        />
    </div>
  )
}