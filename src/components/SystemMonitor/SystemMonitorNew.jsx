import { useEffect, useState } from "react"
import { useRollingHistory } from "./useRollingHistory"
import LineGraph from "./LineGraph"

/* =====================================================
   Dummy systemStats (REMOVE later, replace with IPC)
===================================================== */
if (!window.systemStats) {
  let interval
  let cb

  window.systemStats = {
    start() {
      interval = setInterval(() => {
        const cpuTotal = Math.floor(30 + Math.random() * 60)

        cb?.({
          cpu: {
            total: cpuTotal,
            cores: Array.from({ length: 8 }).map(
              () => Math.floor(20 + Math.random() * 70)
            ),
          },
          ram: {
            used: 4200 + Math.floor(Math.random() * 800),
            total: 8192,
          },
          disk: {
            read: (Math.random() * 40).toFixed(1),
            write: (Math.random() * 25).toFixed(1),
          },
          load: [
            (Math.random() * 4).toFixed(2),
            (Math.random() * 3).toFixed(2),
            (Math.random() * 2).toFixed(2),
          ],
        })
      }, 1000)
    },

    onUpdate(fn) {
      cb = fn
    },

    stop() {
      clearInterval(interval)
    },
  }
}

/* =====================================================
   UI primitives
===================================================== */

function Bar({ value, color }) {
  return (
    <div className="h-2 w-28 rounded bg-slate-200 overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}

function CpuDial({ value }) {
  const r = 22
  const stroke = 4
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c

  const color =
    value < 60
      ? "#10b981"
      : value < 80
      ? "#f59e0b"
      : "#ef4444"

  return (
    <svg width="64" height="64">
      <circle
        cx="32"
        cy="32"
        r={r}
        stroke="#e5e7eb"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx="32"
        cy="32"
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
      <text
        x="32"
        y="36"
        textAnchor="middle"
        fontSize="12"
        className="fill-slate-700 font-medium"
      >
        {value}%
      </text>
    </svg>
  )
}

function MemoryBlocks({ percent }) {
  const blocks = 32
  const filled = Math.round((percent / 100) * blocks)

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: blocks }).map((_, i) => (
        <div
          key={i}
          className={`h-3 w-1 rounded-sm ${
            i < filled ? "bg-emerald-500" : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  )
}

/* =====================================================
   MAIN SYSTEM MONITOR
===================================================== */

export default function SystemMonitorNew() {
  const [stats, setStats] = useState(null)
  const history = useRollingHistory()

  useEffect(() => {
    window.systemStats.start()

    window.systemStats.onUpdate((data) => {
  // 1️⃣ Resolve total CPU %
  const cpuTotal =
    typeof data.cpu === "number"
      ? data.cpu
      : data.cpu?.total ?? 0

  // 2️⃣ Resolve per-core
  let cpuCores = []

  if (Array.isArray(data.cpu?.cores)) {
    // Real per-core data (future)
    cpuCores = data.cpu.cores
  } else {
    // FAKE cores for now (based on logical CPU count)
    const logicalCores = navigator.hardwareConcurrency || 8

    cpuCores = Array.from({ length: logicalCores }).map(() => {
      // Slight jitter around total so it looks real
      const variance = Math.random() * 12 - 6
      return Math.max(
        0,
        Math.min(100, Math.round(cpuTotal + variance))
      )
    })
  }

  // 3️⃣ RAM
  const ramUsed = data.ram?.used ?? 0
  const ramTotal = data.ram?.total ?? 1

  setStats({
    cpu: {
      total: cpuTotal,
      cores: cpuCores,
    },
    ram: {
      used: ramUsed,
      total: ramTotal,
    },
    disk: data.disk ?? { read: "0.0", write: "0.0" },
    load: data.load ?? ["0.00", "0.00", "0.00"],
  })

  history.push(
    cpuTotal,
    Math.round((ramUsed / ramTotal) * 100)
  )
})

    return () => window.systemStats.stop()
  }, [])

  if (!stats) return null

  const ramPercent = Math.round(
    (stats.ram.used / stats.ram.total) * 100
  )

  return (
    <div className="space-y-4 text-xs text-slate-700">

      {/* CPU */}
      <div className="flex gap-4 items-center">
        <CpuDial value={stats.cpu.total} />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-10 font-medium">CPU</span>
            <Bar
              value={stats.cpu.total}
              color="bg-gradient-to-r from-blue-500 to-purple-500"
            />
            <span className="w-10 text-right tabular-nums">
              {stats.cpu.total}%
            </span>
          </div>

          {/* Per-core */}
          <div className="space-y-0.5">
            {stats.cpu.cores.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-10 text-[10px] text-slate-400">
                  C{i}
                </span>
                <Bar value={c} color="bg-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <LineGraph data={history.cpu} color="#6366f1" />

      {/* RAM */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-10 font-medium">RAM</span>
          <MemoryBlocks percent={ramPercent} />
          <span className="ml-auto tabular-nums">
            {stats.ram.used} / {stats.ram.total} MB
          </span>
        </div>
      </div>

      <LineGraph data={history.ram} color="#10b981" />

      {/* Extras (dummy) */}
      <div className="flex justify-between text-[10px] text-slate-500 pt-1">
        <span>Disk ↑ {stats.disk.read} MB/s</span>
        <span>↓ {stats.disk.write} MB/s</span>
        <span>Load {stats.load.join(" / ")}</span>
      </div>
    </div>
  )
}