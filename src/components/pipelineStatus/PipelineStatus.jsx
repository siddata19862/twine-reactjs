import { Check, Loader2 } from "lucide-react"

export default function PipelineStatus({ status }) {
  const steps = status?.steps ?? {}
  const entries = Object.entries(steps)

  return (
    <div className="space-y-4">
      {entries.map(([key, step], index) => {
        const isDone = step.done === true
        const isRunning = step.running === true

        return (
          <div key={key} className="flex items-start gap-4">
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              {/* Circle */}
              <div
                className={[
                  "flex h-5 w-5 items-center justify-center rounded-full border",
                  isDone
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
              </div>

              {/* Connector */}
              {index < entries.length - 1 && (
                <div className="mt-1 h-6 w-px bg-slate-300" />
              )}
            </div>

            {/* Label */}
            <div className="pt-[1px]">
              <div className="text-sm font-medium text-slate-800">
                {formatStepName(key)}
              </div>

              <div className="text-xs text-slate-500">
                {isDone ? "Completed" : isRunning ? "Running" : "Pending"}
              </div>
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
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
}