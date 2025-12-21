import { useEffect, useState } from "react"
import {
  Power,
  Settings,
  Cpu,
  HardDrive,
  MemoryStick,
} from "lucide-react"

import { useTwineStore } from "../../store/useTwineStore"
import logo from "/logo.png"

export default function HeaderBar() {
  const twine = useTwineStore((s) => s.twine)

  /* ----------------------------
     Live clock
  ---------------------------- */
  const [time, setTime] = useState(() =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
)

useEffect(() => {
  const i = setInterval(() => {
    setTime(
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    )
  }, 1000)

  return () => clearInterval(i)
}, [])

  /* ----------------------------
     Quit app
  ---------------------------- */
  const handleQuit = async () => {
    const ok = confirm("Are you sure you want to quit Twine?")
    if (!ok) return

    window.api?.quitApp?.()
  }

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

        <div className="leading-tight">
          <h1 className="text-sm font-semibold text-slate-800">
            {twine?.name ?? "No project loaded"}
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Active Twine project
          </div>
        </div>
      </div>

      {/* ======================================================
         CENTER: Clock + Stats
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
          <span className="text-slate-800 font-medium">—%</span>
        </div>

        {/* RAM */}
        <div className="flex items-center gap-1">
          <MemoryStick className="h-4 w-4 text-slate-500" />
          <span>RAM</span>
          <span className="text-slate-800 font-medium">—%</span>
        </div>

        {/* Disk */}
        <div className="flex items-center gap-1">
          <HardDrive className="h-4 w-4 text-slate-500" />
          <span>Disk</span>
          <span className="text-slate-800 font-medium">—%</span>
        </div>
      </div>

      {/* ======================================================
         RIGHT: Controls
      ====================================================== */}
      <div className="flex items-center gap-2">
        {/* Settings */}
        <button
          className="
            rounded-md p-2
            text-slate-600
            hover:bg-slate-200/60
            hover:text-slate-800
            transition
          "
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-300 mx-1" />

        {/* Power / Quit */}
        <button
          onClick={handleQuit}
          className="
            rounded-md p-2
            text-red-600
            hover:bg-red-100
            transition
          "
          title="Quit Twine"
        >
          <Power className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}