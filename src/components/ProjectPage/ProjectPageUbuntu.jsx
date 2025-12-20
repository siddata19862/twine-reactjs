import { useEffect, useMemo, useState } from "react"
import {
  Folder,
  Calendar,
  FileText,
  Loader2,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Info,
} from "lucide-react"

import logo from "/logo.png"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import SystemMonitor from "../SystemMonitor/SystemMonitor"

import ProjectFileTree from "../ProjectFileTree/ProjectFileTree"
import PipelineTimeline from "../PipelineTimeline/PipelineTimeline"
import LiveLogStream from "../LiveLogStream/LiveLogStream"
import { FastqDropZone } from "../DropZone/DropZone"
import { useNavigate } from "react-router"
import SystemMonitorNew from "../SystemMonitor/SystemMonitorNew"

export default function ProjectPageUbuntu() {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)

  const navigate = useNavigate()

  /* ---------------- FASTQ grouping ---------------- */
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

  const groupedFastq = useMemo(
    () => groupFastqBySample(project?.fastq?.files || []),
    [project?.fastq?.files]
  )

  const [expandedSamples, setExpandedSamples] = useState({})

  useEffect(() => {
    if (!groupedFastq) return
    setExpandedSamples((prev) => {
      const next = { ...prev }
      Object.keys(groupedFastq).forEach((s) => {
        if (!(s in next)) next[s] = true
      })
      return next
    })
  }, [groupedFastq])

  const toggleSample = (s) =>
    setExpandedSamples((p) => ({ ...p, [s]: !p[s] }))

  const allExpanded =
    Object.values(expandedSamples).length &&
    Object.values(expandedSamples).every(Boolean)

  const expandAll = () =>
    setExpandedSamples(Object.fromEntries(Object.keys(groupedFastq).map(k => [k, true])))

  const collapseAll = () =>
    setExpandedSamples(Object.fromEntries(Object.keys(groupedFastq).map(k => [k, false])))

  /* ---------------- pipeline ---------------- */
  const pipelineSteps = [
    { id: "fastqc", label: "FASTQ QC" },
    { id: "filter", label: "Filtering" },
    { id: "dada2", label: "DADA2" },
    { id: "report", label: "Reports" },
  ]

  const [pipelineConfig, setPipelineConfig] = useState({
    qc: "fastqc",
    trimming: "fastp",
    alignment: "bwa-mem",
    variant: "haplotypecaller",
  })

  const updatePipeline = (k, v) =>
    setPipelineConfig((p) => ({ ...p, [k]: v }))

  /* ---------------- effects ---------------- */
  useEffect(() => {
    const load = async () => {
      const current = await window.projectApi.getCurrent()
      setProject(current)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (!project) return
    window.electron.invoke("fs:startSync", project.path)
  }, [project])

  /* ---------------- actions ---------------- */
  const addFastq = async () => {
    const paths = await window.fastqApi.select()
    if (!paths) return
    const files = await window.fastqApi.collect(paths)
    const updated = await window.projectApi.addFastq(files)
    setProject(updated)
  }

  const removeSample = async (sample) => {
    const ok = window.confirm(
      `Remove sample "${sample}"?\n\nThis will remove both R1 and R2 files.`
    )
    if (!ok) return
    const updated = await window.projectApi.removeFastqSample(sample)
    setProject(updated)
  }

  const runPipeline = async () => {
    const res = await window.pipeline.start()
    if (res?.ok === false) {
      alert("Docker daemon is not running.")
    }
  }

  const steps = ["Files", "Configure", "Settings", "Run"]

  /* ---------------- guards ---------------- */
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

  /* ===================================================== */
  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800">
      {/* ---------------- HEADER ---------------- */}
      <header className="
        flex items-center gap-4
        border-b border-[#d6dbe0]
        bg-[#fafafa]
        px-6 py-4
        shadow-sm
      ">
        <img src={logo} alt="Twine" className="h-10 w-28" />

        <div>
          <h1 className="text-sm font-semibold">
            {project.name}
          </h1>
          <p className="text-xs text-slate-600">
            Active Twine project
          </p>
        </div>
      </header>

      {/* ---------------- MAIN ---------------- */}
      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="
          grid grid-cols-[3fr_2fr]
          border border-[#d6dbe0]
          bg-white
          shadow-sm
        ">

          {/* ================= LEFT ================= */}
          <section className="p-6 space-y-6 border-r border-[#e2e6ea]">
            {/* step tabs */}
            <div className="flex gap-1 rounded bg-slate-100 p-1">
              {steps.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setActiveStep(i)}
                  className={`
                    flex-1 rounded px-3 py-1.5 text-xs font-medium
                    ${i === activeStep
                      ? "bg-white shadow text-slate-800"
                      : "text-slate-500 hover:text-slate-700"}
                  `}
                >
                  {s}
                </button>
              ))}
            </div>

            <Separator />

            {/* -------- FILES -------- */}
            {activeStep === 0 && (
              <div className="space-y-4">
                <Button
                  onClick={addFastq}
                  variant="outline"
                  className="h-8 text-xs"
                >
                  Add FASTQ files
                </Button>

                <FastqDropZone
                  onDrop={async (paths) => {
                    const files = await window.fastqApi.collect(paths)
                    const updated = await window.projectApi.addFastq(files)
                    setProject(updated)
                  }}
                />

                {Object.entries(groupedFastq).map(([sample, reads]) => {
                  const open = expandedSamples[sample]
                  return (
                    <div key={sample} className="border rounded bg-slate-50">
                      <div
                        onClick={() => toggleSample(sample)}
                        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-slate-100"
                      >
                        <span className="text-xs font-semibold">
                          {sample}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeSample(sample)
                            }}
                            className="text-xs text-red-600"
                          >
                            Remove
                          </button>

                          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </div>
                      </div>

                      {open && (
                        <div className="px-4 pb-3 space-y-2">
                          {reads.R1 && <FastqFileRow file={reads.R1} />}
                          {reads.R2 && <FastqFileRow file={reads.R2} />}
                          {(!reads.R1 || !reads.R2) && (
                            <p className="flex items-center gap-1 text-xs text-red-600">
                              <AlertTriangle size={14} /> Incomplete pair
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* -------- CONFIG -------- */}
            {activeStep === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <PipelineCard
                  step={1}
                  title="QC"
                  value={pipelineConfig.qc}
                  options={[{ label: "FastQC", value: "fastqc" }]}
                  onChange={(v) => updatePipeline("qc", v)}
                />
                <PipelineCard
                  step={2}
                  title="Trimming"
                  value={pipelineConfig.trimming}
                  options={[{ label: "fastp", value: "fastp" }]}
                  onChange={(v) => updatePipeline("trimming", v)}
                />
              </div>
            )}

            {/* -------- RUN -------- */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <Button onClick={runPipeline}>Start analysis</Button>
                <LiveLogStream
                  subscribe={(cb) => {
                    window.pipeline.onLog(cb)
                    return () => window.pipeline.onEnd(cb)
                  }}
                />
                <PipelineTimeline steps={pipelineSteps} />
              </div>
            )}
          </section>

          {/* ================= RIGHT ================= */}
          <aside className="p-6 space-y-6 bg-[#f8f9fb]">
            <h3 className="text-xs font-semibold uppercase text-slate-600">
              System
            </h3>

            <SystemMonitorNew />

            <Separator />

            <h3 className="text-xs font-semibold uppercase text-slate-600">
              Project Files
            </h3>

            <div className="border rounded bg-white p-3">
              <ProjectFileTree project={project} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

/* ================= HELPERS ================= */

function FastqFileRow({ file }) {
  const sizeMB = (file.size / 1024 / 1024).toFixed(1)
  return (
    <div className="flex items-center gap-3 rounded border bg-white px-3 py-2">
      <FileText size={16} className="text-slate-500" />
      <div className="text-xs">
        <div className="font-medium">{file.name}</div>
        <div className="text-slate-500">{sizeMB} MB</div>
      </div>
    </div>
  )
}

function PipelineCard({ step, title, value, options, onChange }) {
  return (
    <div className="rounded border bg-white p-4 space-y-2">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="h-5 w-5 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          {step}
        </span>
        {title}
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}