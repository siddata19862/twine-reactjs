import { useEffect, useState } from "react"
import { useRollingHistory } from "./useRollingHistory"
import LineGraph from "./LineGraph"
import { useSystemStore } from "../../store/useSystemStore"

/* =====================================================
   UI PRIMITIVES
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

function UsageDial({ value, size = 100 }) {
  const stroke = size <= 60 ? 2 : 3
  const r = size / 2 - stroke
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c

  const color =
    value < 60
      ? "#10b981"
      : value < 80
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
        fontSize={size <= 60 ? "10" : "14"}
        className="fill-slate-700 font-semibold tabular-nums"
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
  const infoFromIPC  = useSystemStore(s => s.info)

  const history = useRollingHistory()
  const [stats, setStats] = useState(null)

  /* ---------- LAYOUT MODES ---------- */

  const isHorizontal = mode === "horizontal"

  const layout = {
    root: isHorizontal
      ? "flex gap-6 items-start"
      : "space-y-5",

    cpuBlock: isHorizontal
      ? "flex flex-col gap-3 w-[360px]"
      : "space-y-2",

    cpuInner: isHorizontal
      ? "flex items-start gap-4"
      : "flex gap-4 items-start",

    cpuDial: isHorizontal
      ? "shrink-0"
      : "",

    cpuCores: isHorizontal
      ? "flex-1"
      : "",

    graphIndent: isHorizontal
      ? "pl-0"
      : "pl-[76px]",

    ramMini: isHorizontal
      ? "flex items-center gap-3"
      : "pl-[76px] flex items-center gap-3 pt-2",

    ramBlock: isHorizontal
      ? "flex flex-col gap-3 w-[360px]"
      : "space-y-2",
  }

  /* ---------- LIVE STATS ---------- */

  useEffect(() => {
    if (!statsFromIPC) return

    const cpuTotal = statsFromIPC.cpu?.avg ?? 0
    const cpuCores = statsFromIPC.cpu?.cores ?? []

    const ramUsed = statsFromIPC.ram?.used ?? 0
    const ramTotal = statsFromIPC.ram?.total ?? 1
    const ramPercent =
      statsFromIPC.ram?.percent ??
      Math.round((ramUsed / ramTotal) * 100)

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
      <div className={layout.cpuBlock}>

        {/* SYSTEM INFO */}
        {info && (
          <div className="border-t pt-2 text-[10px] text-slate-500 grid grid-cols-2 gap-x-6 gap-y-1">
            <div>OS: <span className="text-slate-700">{info.os.platform}</span></div>
            <div>Arch: <span className="text-slate-700">{info.os.arch}</span></div>

            <div className="col-span-2 truncate">
              CPU:{" "}
              <span className="text-slate-700">
                {info.cpu.model} ({info.cpu.speedMHz}MHz)
              </span>
            </div>

            <div>Cores: <span className="text-slate-700">{info.cpu.cores}</span></div>
            <div>
              Uptime:{" "}
              <span className="text-slate-700">
                {formatUptime(info.os.uptime)}
              </span>
            </div>

            <div className="col-span-2">
              Memory:{" "}
              <span className="text-slate-700">
                {info.memory.totalMB} MB
              </span>
            </div>
          </div>
        )}

        {/* CPU DIAL + CORES (SIDE-BY-SIDE IN HORIZONTAL MODE) */}
        <div className={layout.cpuInner}>

          {/* DIAL */}
          <div className={layout.cpuDial}>
            <UsageDial value={stats.cpu.total} size={100} />
          </div>

          {/* CORES */}
          <div className={`space-y-1 ${layout.cpuCores}`}>
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

        <div className={layout.graphIndent}>
          <LineGraph data={history.cpu} color="#6366f1" />
        </div>

        <div className={layout.ramMini}>
          <UsageDial value={stats.ram.percent} size={52} />
          <div className="text-[10px] text-slate-500">
            <div className="font-medium text-slate-600">RAM</div>
            <div className="tabular-nums">
              {stats.ram.used} / {stats.ram.total} MB
            </div>
          </div>
        </div>
      </div>

      {/* ================= RAM ================= */}
      <div className={layout.ramBlock}>
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
      <div className="flex justify-between text-[10px] text-slate-500">
        <span>Disk ↑ {stats.disk.read} MB/s</span>
        <span>↓ {stats.disk.write} MB/s</span>
        <span>Load {stats.load.join(" / ")}</span>
      </div>
    </div>
  )
}