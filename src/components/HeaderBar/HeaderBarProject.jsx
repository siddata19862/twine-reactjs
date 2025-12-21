import { useEffect, useState } from "react"
import {
  Power,
  Settings,
  FolderOpen,
  Home,
  Activity,
  Timer
} from "lucide-react"

import { useTwineStore } from "../../store/useTwineStore"
import { useNavigate } from "react-router"
import logo from "/logo.png"

export default function HeaderBarProject() {
  const twine = useTwineStore(s => s.twine)
  //console.log(twine);
  const navigate = useNavigate()

  /* ----------------------------
     Elapsed time
  ---------------------------- */
  const [elapsed, setElapsed] = useState("00:00:00")

  useEffect(() => {
    if (!twine?.createdAt) return

    const start = new Date(twine.createdAt).getTime()

    const tick = () => {
      const diff = Math.floor((Date.now() - start) / 1000)
      const h = String(Math.floor(diff / 3600)).padStart(2, "0")
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0")
      const s = String(diff % 60).padStart(2, "0")
      setElapsed(`${h}:${m}:${s}`)
    }

    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [twine?.startedAt])

  /* ----------------------------
     Status styling
  ---------------------------- */
  const statusColor = {
    idle: "bg-slate-400",
    running: "bg-emerald-500",
    completed: "bg-blue-500",
    error: "bg-red-500",
  }[twine?.status ?? "idle"]

  return (
    <header className="
      flex items-center justify-between
      border-b border-[#d6dbe0]
      bg-gradient-to-b from-[#fcfcfd] to-[#f4f6f8]
      px-6 py-3
      shadow-sm
      select-none
    ">
      {/* ======================================================
         LEFT: Logo + Project
      ====================================================== */}
      <div className="flex items-center gap-4 min-w-[280px]">
        <img src={logo} alt="Twine" className="h-9 w-auto" />

        <button
          onClick={() => navigate("/")}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-200/60"
          title="Home"
        >
          <Home className="h-4 w-4" />
        </button>

        <div className="leading-tight">
          <h1 className="text-sm font-semibold text-slate-800">
            {twine?.name ?? "No project loaded"}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Project workspace
            <span className="text-slate-300">•</span>

            <button
              onClick={() =>
                twine?.projectDir &&
                window.electron?.invoke("project:openFolder", twine.projectDir)
              }
              className="flex items-center gap-1 hover:text-slate-700"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              Open folder
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
         CENTER: Project Pulse
      ====================================================== */}
      <div className="flex items-center gap-5 text-xs text-slate-700">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
          <span className="font-medium uppercase tracking-wide">
            {twine?.status ?? "idle"}
          </span>
        </div>

        {/* Stage */}
        <div className="flex items-center gap-1">
          <Activity className="h-4 w-4 text-slate-500" />
          <span className="font-medium">
            {twine?.stage ?? "No active step"}
          </span>
        </div>

        {/* Progress */}
        <div className="w-32 h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${twine?.progress ?? 0}%` }}
          />
        </div>

        <span className="tabular-nums font-medium">
          {twine?.progress ?? 0}%
        </span>

        {/* Time */}
        {twine?.createdAt && (
  <div className="flex flex-col text-slate-600">
    <span className="text-[10px] uppercase">
      Elapsed Time
    </span>

    <div className="flex items-center gap-1">
      <Timer className="h-4 w-4" />
      <span className="font-mono tabular-nums text-xs">
        {elapsed}
      </span>
    </div>
  </div>
)}
      </div>

      {/* ======================================================
         RIGHT: Controls
      ====================================================== */}
      <div className="flex items-center gap-2">
        <button
          className="rounded-md p-2 text-slate-600 hover:bg-slate-200/60"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        <div className="h-6 w-px bg-slate-300 mx-1" />

        <button
          onClick={() =>
            confirm("Quit Twine?") && window.api?.quitApp?.()
          }
          className="rounded-md p-2 text-red-600 hover:bg-red-100"
          title="Quit Twine"
        >
          <Power className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}