import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"

const STATUS = {
  pending: "pending",
  running: "running",
  done: "done",
}

export default function PipelineTimeline({ steps, activeStep }) {
  return (
    <div className="mt-6 rounded-lg border bg-white p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-700">
        Pipeline progress
      </h4>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep
          const isDone = idx < activeStep

          return (
            <div key={step.id} className="flex gap-3">
              {/* LEFT ICON */}
              <div className="pt-1">
                {isDone && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}

                {isActive && (
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                )}

                {!isDone && !isActive && (
                  <Circle className="h-4 w-4 text-slate-300" />
                )}
              </div>

              {/* CONTENT */}
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-indigo-600"
                      : isDone
                      ? "text-slate-700"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </p>

                {/* MINI STEPS */}
                <AnimatePresence>
                  {(isActive || isDone) && step.substeps && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-2 space-y-1"
                    >
                      {step.substeps.map((s, i) => {
                        const subDone =
                          isDone || i < step.activeSubstep
                        const subActive =
                          isActive && i === step.activeSubstep

                        return (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-xs"
                          >
                            {subDone && (
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            )}
                            {subActive && (
                              <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                            )}
                            {!subDone && !subActive && (
                              <Circle className="h-3 w-3 text-slate-300" />
                            )}
                            <span
                              className={
                                subActive
                                  ? "text-indigo-500"
                                  : subDone
                                  ? "text-slate-600"
                                  : "text-slate-400"
                              }
                            >
                              {s}
                            </span>
                          </div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}