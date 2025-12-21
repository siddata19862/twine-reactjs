import { useEffect, useState } from "react"
import {
  Power,
  Settings,
  Cpu,
  HardDrive,
  MemoryStick,
  FolderOpen,
  Home
} from "lucide-react"

import { useTwineStore } from "../../store/useTwineStore"
import { useSystemStore } from "../../store/useSystemStore"
import { useNavigate } from "react-router"
import logo from "/logo.png"

export default function HeaderBar() {
  const twine = useTwineStore(s => s.twine)
  const stats = useSystemStore(s => s.stats)

  const navigate = useNavigate()

  /* ----------------------------
     Live clock
  ---------------------------- */
  const [time, setTime] = useState("")

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      )

    tick()
    const i = setInterval(tick, 1000)
    return () => clearInterval(i)
  }, [])

  /* ----------------------------
     Quit app
  ---------------------------- */
  const handleQuit = () => {
    if (confirm("Are you sure you want to quit Twine?")) {
      window.api?.quitApp?.()
    }
  }

  /* ----------------------------
     Derived system values
  ---------------------------- */
  const cpu = stats?.cpu?.avg ?? null

  const ramPercent =
    stats?.ram?.percent ??
    (stats?.ram
      ? Math.round((stats.ram.used / stats.ram.total) * 100)
      : null)

  const diskRead = stats?.disk?.read ?? null
  const diskWrite = stats?.disk?.write ?? null

  return (
    <header
      className="
        flex items-center justify-between
        border-b border-[#d6dbe0]
        bg-gradient-to-b from-[#fcfcfd] to-[#f4f6f8]
        px-6 py-3
        shadow-sm
        select-none
      "
    >
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
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Active Twine project
            </div>

            <span className="text-slate-300">•</span>

            <button
              onClick={() =>
                twine?.projectDir &&
                window.electron?.invoke(
                  "project:openFolder",
                  twine.projectDir
                )
              }
              className="flex items-center gap-1 hover:text-slate-700"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span className="underline-offset-2 hover:underline">
                Open folder
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
         CENTER: Clock + Live Stats
      ====================================================== */}
      <div className="flex items-center gap-6 text-xs text-slate-600">
        {/* Clock */}
        <div className="font-mono tracking-wide text-slate-700">
          {time}
        </div>

        {/* CPU */}
        <div className="flex items-center gap-1">
          <Cpu className="h-4 w-4 text-slate-500" />
          <span>CPU</span>
          <span className="font-medium text-slate-800 tabular-nums">
            {cpu !== null ? `${cpu}%` : "—"}
          </span>
        </div>

        {/* RAM */}
        <div className="flex items-center gap-1">
          <MemoryStick className="h-4 w-4 text-slate-500" />
          <span>RAM</span>
          <span className="font-medium text-slate-800 tabular-nums">
            {ramPercent !== null ? `${ramPercent}%` : "—"}
          </span>
        </div>

        {/* Disk */}
        <div className="flex items-center gap-1">
          <HardDrive className="h-4 w-4 text-slate-500" />
          <span>Disk</span>
          <span className="font-medium text-slate-800 tabular-nums">
            {diskRead !== null
              ? `${diskRead}↑ ${diskWrite}↓`
              : "—"}
          </span>
        </div>
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
          onClick={handleQuit}
          className="rounded-md p-2 text-red-600 hover:bg-red-100"
          title="Quit Twine"
        >
          <Power className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}