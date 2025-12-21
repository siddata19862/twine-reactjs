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
        const cores = Array.from({ length: 8 }).map(
          () => Math.floor(20 + Math.random() * 70)
        )

        const avg = Math.round(
          cores.reduce((a, b) => a + b, 0) / cores.length
        )

        cb?.({
          cpu: {
            cores,
            avg, // 🔒 SINGLE SOURCE OF TRUTH
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
    /* -------------------------------------------
       Register listener FIRST
    ------------------------------------------- */
    window.systemStats.onUpdate((data) => {
      /* ---------------- CPU ---------------- */

      const cpuCores = data.cpu?.cores ?? []

      const cpuTotal = Math.round(
        Number(data.cpu?.avg) ||
          (cpuCores.length
            ? cpuCores.reduce((a, b) => a + b, 0) / cpuCores.length
            : 0)
      )

      /* ---------------- RAM ---------------- */

      const ramUsed = data.ram?.used ?? 0
      const ramTotal = data.ram?.total ?? 1
      const ramPercent = Math.round((ramUsed / ramTotal) * 100)

      setStats({
        cpu: {
          total: cpuTotal,
          cores: cpuCores,
        },
        ram: {
          used: ramUsed,
          total: ramTotal,
          percent: ramPercent,
        },
        disk: data.disk ?? { read: "0.0", write: "0.0" },
        load: data.load ?? ["0.00", "0.00", "0.00"],
      })

      history.push(cpuTotal, ramPercent)
    })

    /* -------------------------------------------
       THEN start polling
    ------------------------------------------- */
    window.systemStats.start()

    return () => window.systemStats.stop()
  }, [])

  if (!stats) return null

  return (
    <div className="space-y-5 text-xs text-slate-700">

      {/* ================= CPU ================= */}
      <div className="space-y-2">
        <div className="flex gap-4 items-start">
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
                  <span className="w-8 text-right text-[10px] tabular-nums">
                    {c}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CPU TIMELINE */}
        <div className="pl-[76px]">
          <LineGraph data={history.cpu} color="#6366f1" />
        </div>
      </div>

      {/* ================= RAM ================= */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-10 font-medium">RAM</span>
          <MemoryBlocks percent={stats.ram.percent} />
          <span className="ml-auto tabular-nums">
            {stats.ram.used} / {stats.ram.total} MB
            <span className="ml-2 text-slate-500">
              ({stats.ram.percent}%)
            </span>
          </span>
        </div>

        <LineGraph data={history.ram} color="#10b981" />
      </div>

      {/* ================= EXTRAS ================= */}
      <div className="flex justify-between text-[10px] text-slate-500 pt-1">
        <span>Disk ↑ {stats.disk.read} MB/s</span>
        <span>↓ {stats.disk.write} MB/s</span>
        <span>Load {stats.load.join(" / ")}</span>
      </div>
    </div>
  )
}