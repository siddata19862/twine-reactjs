import { useEffect, useState } from "react"
import { useRollingHistory } from "./useRollingHistory"
import LineGraph from "./LineGraph"
import { useSystemStore } from "../../store/useSystemStore"

/* =====================================================
   UI PRIMITIVES
===================================================== */

function Bar({ value, color }) {
  const safe = Number(value) || 0

  return (
    <div className="h-2 flex-1 min-w-[80px] rounded bg-slate-200 overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${Math.min(safe, 100)}%` }}
      />
    </div>
  )
}

function UsageDial({ value, size = 80 }) {
  const safe = Number(value) || 0

  const stroke = size <= 60 ? 2 : 3
  const r = size / 2 - stroke
  const c = 2 * Math.PI * r
  const offset = c - (safe / 100) * c

  const color =
    safe < 60
      ? "#10b981"
      : safe < 80
      ? "#f59e0b"
      : "#ef4444"

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#e5e7eb"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="transition-all duration-500"
      />
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={size <= 60 ? "10" : "12"}
        className="fill-slate-700 font-semibold tabular-nums"
      >
        {safe}%
      </text>
    </svg>
  )
}

function MemoryBlocks({ percent }) {
  const safe = Number(percent) || 0
  const blocks = 24
  const filled = Math.round((safe / 100) * blocks)

  return (
    <div className="flex gap-0.5 flex-1 min-w-[120px]">
      {Array.from({ length: blocks }).map((_, i) => (
        <div
          key={i}
          className={`h-3 flex-1 rounded-sm ${
            i < filled ? "bg-emerald-500" : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  )
}

/* =====================================================
   HELPERS
===================================================== */

function formatUptime(seconds = 0) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

/* =====================================================
   MAIN SYSTEM MONITOR
===================================================== */

export default function SystemMonitorNew({ mode = "vertical" }) {
  const statsFromIPC = useSystemStore(s => s.stats)
  const infoFromIPC = useSystemStore(s => s.info)

  const history = useRollingHistory()
  const [stats, setStats] = useState(null)

  const isHorizontal = mode === "horizontal"

  const layout = {
    root: isHorizontal
      ? "flex gap-4 items-start w-full min-w-0"
      : "space-y-4 w-full min-w-0 max-w-[320px]",

    block: "w-full min-w-0",

    cpuInner: "flex gap-3 items-start",

    graphIndent: isHorizontal ? "" : "pl-[60px]",

    ramMini: "flex items-center gap-3",
  }

  useEffect(() => {
    if (!statsFromIPC) return

    const cpuTotal = Number(statsFromIPC.cpu?.avg ?? 0)
    const cpuCores = (statsFromIPC.cpu?.cores ?? []).map(c => Number(c))

    const ramUsed = Number(statsFromIPC.ram?.used ?? 0)
    const ramTotal = Number(statsFromIPC.ram?.total ?? 1)
    const ramPercent =
      Number(
        statsFromIPC.ram?.percent ??
          Math.round((ramUsed / ramTotal) * 100)
      )

    setStats({
      cpu: { total: cpuTotal, cores: cpuCores },
      ram: { used: ramUsed, total: ramTotal, percent: ramPercent },
      disk: statsFromIPC.disk ?? { read: "0.0", write: "0.0" },
      load: statsFromIPC.load ?? ["0.00", "0.00", "0.00"],
    })

    history.push(cpuTotal, ramPercent)
  }, [statsFromIPC])

  if (!stats) return null
  const info = infoFromIPC ?? {}

  return (
    <div className={`${layout.root} text-xs text-slate-700`}>

      {/* ================= CPU ================= */}
      <div className={layout.block}>

        {/* SYSTEM INFO */}
        <div className="text-[10px] text-slate-500 grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
          <div>
            OS: <span className="text-slate-700">{info.os?.platform}</span>
          </div>
          <div>
            Arch: <span className="text-slate-700">{info.os?.arch}</span>
          </div>
          <div className="col-span-2 truncate">
            CPU: <span className="text-slate-700">{info.cpu?.model}</span>
          </div>
          <div>
            Cores: <span className="text-slate-700">{info.cpu?.cores}</span>
          </div>
          <div>
            Uptime:{" "}
            <span className="text-slate-700">
              {formatUptime(info.os?.uptime)}
            </span>
          </div>
        </div>

        <div className={layout.cpuInner}>
          <UsageDial value={stats.cpu.total} size={isHorizontal ? 80 : 70} />

          <div className="flex-1 space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-8 font-medium">CPU</span>
              <Bar value={stats.cpu.total} color="bg-indigo-500" />
              <span className="w-8 text-right tabular-nums">
                {stats.cpu.total}%
              </span>
            </div>

            {stats.cpu.cores.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-8 text-[10px] text-slate-400">C{i}</span>
                <Bar value={c} color="bg-slate-400" />
                <span className="w-8 text-right text-[10px]">{c}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={layout.graphIndent}>
          <LineGraph data={history.cpu} color="#6366f1" />
        </div>

        <div className={layout.ramMini}>
          <UsageDial value={stats.ram.percent} size={48} />
          <div className="text-[10px] text-slate-500">
            <div className="font-medium">RAM</div>
            <div>
              {stats.ram.used} / {stats.ram.total} MB
            </div>
          </div>
        </div>
      </div>

      {/* ================= RAM ================= */}
      <div className={layout.block}>
        <div className="flex items-center gap-2">
          <span className="w-8 font-medium">RAM</span>
          <MemoryBlocks percent={stats.ram.percent} />
          <span className="tabular-nums text-[10px]">
            {stats.ram.percent}%
          </span>
        </div>

        <LineGraph data={history.ram} color="#10b981" />
      </div>
    </div>
  )
}