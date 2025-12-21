import { Check, Loader2, XCircle } from "lucide-react"

function formatIndianDateTimeWithAgoUTC(value) {
  if (!value) return ""

  // Expected UTC format: "YYYY-MM-DD HH:mm:ss"
  const [datePart, timePart] = value.split(" ")
  if (!datePart || !timePart) return value

  const [y, m, d] = datePart.split("-").map(Number)
  const [hh, mm, ss] = timePart.split(":").map(Number)

  if (
    [y, m, d, hh, mm].some(v => Number.isNaN(v))
  ) {
    return value
  }

  // 🔹 Create UTC date
  const utcDate = new Date(Date.UTC(y, m - 1, d, hh, mm, ss || 0))

  // 🔹 Convert to local (IST on your machine)
  const local = new Date(utcDate.getTime())

  // ---- Format Indian date ----
  const day = String(local.getDate()).padStart(2, "0")
  const month = String(local.getMonth() + 1).padStart(2, "0")
  const year = local.getFullYear()

  let hours = local.getHours()
  const minutes = String(local.getMinutes()).padStart(2, "0")
  const seconds = String(local.getSeconds()).padStart(2, "0")

  const ampm = hours >= 12 ? "pm" : "am"
  hours = hours % 12 || 12

  const formatted =
    `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`

  // ---- AGO calculation ----
  const diffSec = Math.floor((Date.now() - local.getTime()) / 1000)

  let ago = ""
  if (diffSec >= 0) {
    if (diffSec < 10) ago = "just now"
    else if (diffSec < 60) ago = `${diffSec}s ago`
    else if (diffSec < 3600) ago = `${Math.floor(diffSec / 60)} min ago`
    else if (diffSec < 86400) ago = `${Math.floor(diffSec / 3600)} hr ago`
    else ago = `${Math.floor(diffSec / 86400)} day ago`
  }

  return ago ? `${formatted} (${ago})` : formatted
}

export default function PipelineStatus({ status, reverse = false }) {
  const steps = status?.steps ?? {}

  const entries = Object.entries(steps)
  const ordered = reverse ? [...entries].reverse() : entries

  return (
    <div className="space-y-4">
      {ordered.map(([key, step], index) => {
        const isFailed = step.failed === true
        const isRunning = step.running === true
        const isDone = step.done === true

        const stateLabel = isFailed
          ? "Failed"
          : isRunning
          ? "Running"
          : isDone
          ? "Completed"
          : "Pending"

        const timestamp =
          step.finished || step.time || null

        return (
          <div key={key} className="flex items-start gap-4">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={[
                  "flex h-5 w-5 items-center justify-center rounded-full border",
                  isFailed
                    ? "bg-red-500 border-red-500"
                    : isDone
                    ? "bg-emerald-500 border-emerald-500"
                    : isRunning
                    ? "border-blue-500"
                    : "border-slate-300 bg-white",
                ].join(" ")}
              >
                {isDone && <Check className="h-3 w-3 text-white" />}
                {isRunning && (
                  <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />
                )}
                {isFailed && (
                  <XCircle className="h-3 w-3 text-white" />
                )}
              </div>

              {/* Connector */}
              {index < ordered.length - 1 && (
                <div className="mt-1 h-6 w-px bg-slate-300" />
              )}
            </div>

            {/* Label */}
            <div className="pt-[1px] space-y-1">
              <div className="text-sm font-medium text-slate-800">
                {formatStepName(key)}
              </div>

              <div
                className={[
                  "text-xs",
                  isFailed
                    ? "text-red-600"
                    : isRunning
                    ? "text-blue-600"
                    : isDone
                    ? "text-emerald-600"
                    : "text-slate-500",
                ].join(" ")}
              >
                {stateLabel}
                {timestamp && ` • ${formatIndianDateTimeWithAgoUTC(timestamp)}`}
              </div>

              {/* Error (only if failed) */}
              {isFailed && step.error && (
                <pre className="mt-1 max-w-xl whitespace-pre-wrap rounded bg-red-50 p-2 text-[11px] text-red-700">
                  {step.error.trim()}
                </pre>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ----------------------------
   Helpers
---------------------------- */

function formatStepName(key) {
  return key
    .replace(/^r_/, "")      // optional: strip engine prefix
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
}