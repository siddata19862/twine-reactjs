import { useEffect, useState } from "react"
import {
  Folder,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import SystemMonitor from "../SystemMonitor/SystemMonitor"
import ProjectFileTree from "../ProjectFileTree/ProjectFileTree"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import PipelineTimeline from "../PipelineTimeline/PipelineTimeline"
import LiveLogStream from "../LiveLogStream/LiveLogStream"

/* -------------------------------------------------- */

export default function ProjectPageUnix2() {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [lastLog, setLastLog] = useState("")

  const steps = ["Files", "Configure Pipeline", "Settings", "Run"]

  const pipelineSteps = [
    {
      id: "fastqc",
      label: "FASTQ quality check",
      substeps: [
        "Scanning reads",
        "Generating reports",
        "Aggregating QC results",
      ],
      activeSubstep: 1,
    },
    {
      id: "filtering",
      label: "Filtering & trimming",
      substeps: [
        "Adapter removal",
        "Quality trimming",
        "Length filtering",
      ],
      activeSubstep: 0,
    },
    {
      id: "dada2",
      label: "DADA2 inference",
      substeps: [
        "Error model learning",
        "Denoising",
        "ASV table construction",
      ],
      activeSubstep: 0,
    },
    {
      id: "report",
      label: "Final reports",
      substeps: ["Summaries", "Visualizations"],
      activeSubstep: 0,
    },
  ]

  const [pipelineConfig, setPipelineConfig] = useState({
    qc: "fastqc",
    trimming: "fastp",
    alignment: "bwa-mem",
    variant: "haplotypecaller",
  })

  const updatePipeline = (key, value) => {
    setPipelineConfig((p) => ({ ...p, [key]: value }))
  }

  useEffect(() => {
    window.pipeline.onLog(setLastLog)
  }, [])

  useEffect(() => {
    const load = async () => {
      const current = await window.projectApi.getCurrent()
      setProject(current)
      setLoading(false)
    }
    load()
  }, [])

  const addFastq = async () => {
    const paths = await window.fastqApi.select()
    if (!paths) return
    const files = await window.fastqApi.collect(paths)
    const updated = await window.projectApi.addFastq(files)
    setProject(updated)
  }

  const removeSample = async (sampleName) => {
    const ok = window.confirm(
      `Remove sample "${sampleName}"?\nThis removes both R1 and R2 files.`
    )
    if (!ok) return
    const updated = await window.projectApi.removeFastqSample(sampleName)
    setProject(updated)
  }

  const runPipeline = async () => {
    await window.pipeline.start()
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-sm">
        Loading project…
      </div>
    )
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center text-sm">
        No active project
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#ECECEC] text-[#1E1E1E] text-sm">

      {/* ---------- TOP BAR ---------- */}
      <div className="border-b bg-[#F5F5F5] px-4 py-2 flex justify-between">
        <div>
          <div className="font-semibold">{project.name}</div>
          <div className="text-xs font-mono text-slate-600">
            {project.path}
          </div>
        </div>
        <div className="text-xs text-slate-500">project.twine</div>
      </div>

      {/* ---------- LAYOUT ---------- */}
      <div className="grid grid-cols-[220px_1fr_340px] min-h-[calc(100vh-40px)]">

        {/* ---------- SIDEBAR ---------- */}
        <div className="border-r bg-[#F7F7F7]">
          {steps.map((step, idx) => (
            <div
              key={step}
              onClick={() => setActiveStep(idx)}
              className={`
                px-3 py-2 cursor-pointer
                border-l-4
                ${idx === activeStep
                  ? "border-black bg-[#E0E0E0] font-medium"
                  : "border-transparent hover:bg-[#EAEAEA]"}
              `}
            >
              {idx + 1}. {step}
            </div>
          ))}
        </div>

        {/* ---------- MAIN ---------- */}
        <div className="p-4 space-y-4">

          {/* FILES */}
          {activeStep === 0 && (
            <>
              <h3 className="font-semibold border-b pb-1">
                Input FASTQ Files
              </h3>

              <Button
                onClick={addFastq}
                className="h-8 px-3 rounded-sm border bg-[#DADADA]"
              >
                Add FASTQ files
              </Button>

              {project.fastq?.files?.length > 0 && (
                <div className="border bg-[#FAFAFA]">
                  {groupFastqBySample(project.fastq.files) &&
                    Object.entries(groupFastqBySample(project.fastq.files))
                      .map(([sample, reads]) => (
                        <div key={sample} className="border-b p-3">
                          <div className="flex justify-between">
                            <span className="font-mono">{sample}</span>
                            <button
                              onClick={() => removeSample(sample)}
                              className="text-xs text-red-600"
                            >
                              remove
                            </button>
                          </div>

                          {reads.R1 && <FastqFileRow file={reads.R1} />}
                          {reads.R2 && <FastqFileRow file={reads.R2} />}
                        </div>
                      ))}
                </div>
              )}
            </>
          )}

          {/* CONFIG */}
          {activeStep === 1 && (
            <>
              <h3 className="font-semibold border-b pb-1">
                Configure Pipeline
              </h3>

              <PipelineSelect
                label="Raw Read QC"
                value={pipelineConfig.qc}
                options={[
                  { label: "FastQC", value: "fastqc" },
                  { label: "MultiQC", value: "multiqc" },
                ]}
                onChange={(v) => updatePipeline("qc", v)}
              />

              <PipelineSelect
                label="Trimming"
                value={pipelineConfig.trimming}
                options={[
                  { label: "fastp", value: "fastp" },
                  { label: "Trimmomatic", value: "trimmomatic" },
                ]}
                onChange={(v) => updatePipeline("trimming", v)}
              />
            </>
          )}

          {/* RUN */}
          {activeStep === 3 && (
            <>
              <Button
                onClick={runPipeline}
                className="h-8 px-3 rounded-sm border bg-[#DADADA]"
              >
                Start analysis
              </Button>

              <div className="h-56 border bg-[#1E1E1E] text-[#E6E6E6] font-mono text-xs overflow-auto">
                <LiveLogStream
                  subscribe={(cb) => {
                    window.pipeline.onLog(cb)
                    return () => window.pipeline.onEnd(cb)
                  }}
                />
              </div>

              <PipelineTimeline steps={pipelineSteps} />
            </>
          )}
        </div>

        {/* ---------- RIGHT ---------- */}
        <div className="border-l bg-[#F7F7F7] p-3 space-y-4">
          <SystemMonitor />

          <Separator />

          <div className="border bg-[#FAFAFA] max-h-[300px] overflow-auto">
            <ProjectFileTree project={project} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------- */

function FastqFileRow({ file }) {
  const sizeMB = (file.size / 1024 / 1024).toFixed(1)

  return (
    <div className="flex gap-2 text-xs font-mono pl-4">
      <FileText size={12} />
      <span className="truncate">{file.name}</span>
      <span className="text-slate-500">{sizeMB} MB</span>
    </div>
  )
}

function PipelineSelect({ label, value, options, onChange }) {
  return (
    <div className="flex items-center justify-between border-b py-2">
      <span>{label}</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function groupFastqBySample(files = []) {
  const groups = {}
  files.forEach((file) => {
    const match = file.name.match(/^(.+)_R([12])_/)
    if (!match) return
    const sample = match[1]
    const read = match[2] === "1" ? "R1" : "R2"
    groups[sample] ??= { R1: null, R2: null }
    groups[sample][read] = file
  })
  return groups
}