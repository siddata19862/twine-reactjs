import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const MAX_LOGS = 120

export default function LiveLogStream({ subscribe }) {
  const [logs, setLogs] = useState([])
  const containerRef = useRef(null)
  const pinnedRef = useRef(true)

  // subscribe ONCE
  console.log("llive");
  const lastTextRef = useRef(null)

useEffect(() => {
  if (!subscribe) return
  console.log("ueee");

  const unsubscribe = subscribe((msg) => {
    if(msg)
    console.log("mymessage",msg);
    msg = msg?.message;
    setLogs((prev) => {
      const type = inferType(msg)

      // 🧠 same as last message → coalesce
      if (prev.length > 0 && prev[0].text === msg) {
        return [
          {
            ...prev[0],
            repeat: (prev[0].repeat || 1) + 1,
            ts: Date.now(),
          },
          ...prev.slice(1),
        ]
      }

      // ➕ new message
      const next = [
        {
          id: crypto.randomUUID(),
          text: msg,
          type,
          repeat: 1,
          ts: Date.now(),
        },
        ...prev,
      ]

      return next.slice(0, MAX_LOGS)
    })
  })

  return unsubscribe
}, [subscribe])

  // auto-scroll when pinned
  useEffect(() => {
    if (pinnedRef.current && containerRef.current) {
      containerRef.current.scrollTop = 0
    }
  }, [logs])

  const onScroll = () => {
    if (!containerRef.current) return
    pinnedRef.current = containerRef.current.scrollTop < 8
  }

  return (
    <div className="rounded-lg border bg-white text-slate-700 font-mono text-xs shadow-sm">
      <Header pinned={pinnedRef.current} />

      <div
        ref={containerRef}
        onScroll={onScroll}
        className="h-64 overflow-y-auto flex flex-col-reverse px-3 py-2 gap-1"
      >
        <AnimatePresence initial={false}>
          {logs.map((log, index) => {
            const age = index
            const opacity = Math.max(0.12, 1 - age * 0.035)

            return (
              <motion.div
                key={log.id}
                
              >
                <LogLine log={log} />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Header({ pinned }) {
  return (
    <div className="px-3 py-2 border-b bg-slate-50 text-slate-600 flex items-center justify-between">
  <span className="font-medium">Live pipeline logs</span>
  {!pinned && <span className="text-amber-600">paused</span>}
</div>
  )
}

function LogLine({ log }) {
  let color = "text-slate-700"

  if (log.type === "error") color = "text-red-600"
  if (log.type === "warn") color = "text-amber-600"
  if (log.type === "success") color = "text-emerald-600"

  return (
    <span className={color}>
      ~TWINE: &gt;&gt; {log.text}
      {log.repeat > 1 && 1==2 && (
        <span className="ml-2 text-slate-400">
          × {log.repeat}
        </span>
      )}
    </span>
  )
}
function inferType(msg) {
  if(msg==undefined)
  {
    return "info";
  }
  const m = msg?.toLowerCase()
  if (m.includes("failed") || m.includes("error")) return "error"
  if (m.includes("warn")) return "warn"
  if (m.includes("done") || m.includes("success")) return "success"
  return "info"
}