import { useEffect, useState } from "react"
import { Folder, Calendar, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import SystemMonitor from "../SystemMonitor/SystemMonitor"

/* ========================================================= */

export default function ProjectPageUnix() {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)

  const steps = ["Files", "Configure Pipeline", "Settings", "Run"]

  /* ---------- actions ---------- */

  const addFastq = async () => {
    const paths = await window.fastqApi.select()
    if (!paths) return
    const files = await window.fastqApi.collect(paths)
    const updated = await window.projectApi.addFastq(files)
    setProject(updated)
  }

  const removeSample = async (sample) => {
    const ok = window.confirm(
      `Remove sample "${sample}"?\n\nBoth R1 and R2 will be removed.`
    )
    if (!ok) return
    const updated = await window.projectApi.removeFastqSample(sample)
    setProject(updated)
  }

  /* ---------- utils ---------- */

  function groupFastqBySample(files = []) {
    const groups = {}
    files.forEach((file) => {
      const match = file.name.match(/^(.+)_R([12])_\d+\.fastq(\.gz)?$/i)
      if (!match) return

      const sample = match[1]
      const read = match[2] === "1" ? "R1" : "R2"

      if (!groups[sample]) groups[sample] = { R1: null, R2: null }
      groups[sample][read] = file
    })
    return groups
  }

  /* ---------- load ---------- */

  useEffect(() => {
    const load = async () => {
      const current = await window.projectApi.getCurrent()
      setProject(current)
      setLoading(false)
    }
    load()
  }, [])

  /* ---------- states ---------- */

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-500">
        Loading project…
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-500">
        No active project
      </div>
    )
  }

  /* ========================================================= */

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">

      {/* ===== WINDOW HEADER ===== */}
      <div className="flex items-center justify-between border-b bg-slate-200 px-6 py-3">
        <div>
          <h1 className="text-sm font-semibold">{project.name}</h1>
          <p className="text-xs text-slate-500">Twine project workspace</p>
        </div>

        <div className="flex gap-3 text-xs text-slate-600">
          <MiniInfo icon={<Folder size={12} />} value={project.path} />
          <MiniInfo
            icon={<Calendar size={12} />}
            value={new Date(project.createdAt).toLocaleDateString()}
          />
          <MiniInfo icon={<FileText size={12} />} value="project.twine" />
        </div>
      </div>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="grid grid-cols-[220px_1fr_300px] min-h-[calc(100vh-56px)]">

        {/* ===== SIDEBAR ===== */}
        <aside className="border-r bg-slate-200 p-3">
          <nav className="space-y-1">
            {steps.map((step, idx) => (
              <button
                key={step}
                onClick={() => setActiveStep(idx)}
                className={`
                  w-full rounded px-3 py-2 text-left text-sm
                  ${idx === activeStep
                    ? "bg-slate-300 font-medium"
                    : "text-slate-600 hover:bg-slate-300/60"}
                `}
              >
                {step}
              </button>
            ))}
          </nav>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="p-6 space-y-6">

          {/* -------- FILES -------- */}
          {activeStep === 0 && (
            <>
              <Section title="Input FASTQ files" />

              <p className="text-sm text-slate-600">
                Register paired-end FASTQ files for this project.
              </p>

              <Button size="sm" variant="outline" onClick={addFastq}>
                Add FASTQ files
              </Button>

              {project.fastq?.files?.length > 0 && (
                <div className="border bg-white">
                  {Object.entries(
                    groupFastqBySample(project.fastq.files)
                  ).map(([sample, reads]) => (
                    <div key={sample} className="border-b last:border-b-0 p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-600">
                          {sample}
                        </span>
                        <button
                          onClick={() => removeSample(sample)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-2 space-y-1">
                        {reads.R1 && <FastqRow file={reads.R1} />}
                        {reads.R2 && <FastqRow file={reads.R2} />}
                        {(!reads.R1 || !reads.R2) && (
                          <p className="text-xs text-amber-600">
                            Incomplete pair
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* -------- CONFIGURE -------- */}
          {activeStep === 1 && (
            <>
              <Section title="Pipeline configuration" />
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• DADA2 denoising enabled</li>
                <li>• Primer trimming: automatic</li>
                <li>• Quality filtering: Q ≥ 30</li>
                <li>• Paired-end merging enabled</li>
              </ul>
            </>
          )}

          {/* -------- SETTINGS -------- */}
          {activeStep === 2 && (
            <>
              <Section title="Sample display names" />

              <div className="space-y-3">
                {Object.entries(
                  groupFastqBySample(project.fastq?.files || [])
                ).map(([sample]) => (
                  <div
                    key={sample}
                    className="border bg-white p-3"
                  >
                    <p className="text-xs font-semibold text-slate-600">
                      {sample}
                    </p>
                    <input
                      className="mt-2 w-full rounded border px-2 py-1 text-sm"
                      placeholder="Optional display name"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* -------- RUN -------- */}
          {activeStep === 3 && (
            <>
              <Section title="Run analysis" />
              <p className="text-sm text-slate-600">
                FASTQ files: {project.fastq?.files?.length ?? 0}
              </p>
              <Button size="sm">Start analysis</Button>
            </>
          )}
        </main>

        {/* ===== INSPECTOR ===== */}
        <aside className="border-l bg-slate-50 p-4 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            System Monitor
          </h3>
          <SystemMonitor />
          <Separator />
          <p className="text-xs text-slate-500">
            Complete steps from top to bottom.
          </p>
        </aside>
      </div>
    </div>
  )
}

/* ========================================================= */
/* helpers */

function Section({ title }) {
  return (
    <div className="border-b pb-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
        {title}
      </h2>
    </div>
  )
}

function FastqRow({ file }) {
  const sizeMB = (file.size / 1024 / 1024).toFixed(1)
  return (
    <div className="flex items-center gap-3 text-sm">
      <FileText size={14} className="text-slate-400" />
      <span className="flex-1 truncate">{file.name}</span>
      <span className="text-xs text-slate-400">{sizeMB} MB</span>
    </div>
  )
}

function MiniInfo({ icon, value }) {
  return (
    <div className="flex items-center gap-1 text-xs text-slate-600 max-w-[220px] truncate">
      {icon}
      <span className="truncate">{value}</span>
    </div>
  )
}