import { useEffect, useState } from "react"

export function LiveSystemStrip() {
  const [stats, setStats] = useState({
    cpu: 0,
    ram: 0,
    io: 0,
  })

  useEffect(() => {
    window.systemStats.start()

    window.systemStats.onUpdate((data) => {
      setStats({
        cpu: Math.round(data.cpu.percent),
        ram: Math.round((data.ram.used / data.ram.total) * 100),
        io: Math.round(data.disk?.percent ?? 0),
      })
    })

    return () => window.systemStats.stop()
  }, [])

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-white px-4 py-2 shadow-sm">
      <StatBar label="CPU" value={stats.cpu} color="indigo" />
      <StatBar label="RAM" value={stats.ram} color="emerald" />
      <StatBar label="IO" value={stats.io} color="amber" />
    </div>
  )
}


function StatBar({ label, value, color }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <span className="w-8 font-medium">{label}</span>

      <div className="relative h-2 w-20 rounded bg-slate-200 overflow-hidden">
        <div
          className={`absolute left-0 top-0 h-full bg-${color}-500 transition-all duration-500`}
          style={{ width: `${value}%` }}
        />
      </div>

      <span className="w-8 text-right tabular-nums">
        {value}%
      </span>

      {/* subtle pulse dot */}
      <span className={`ml-1 h-1.5 w-1.5 rounded-full bg-${color}-500 animate-pulse`} />
    </div>
  )
}