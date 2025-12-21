import { useEffect, useMemo, useState } from "react"
import {
  Folder,
  Calendar,
  FileText,
  Loader2, ChevronRight, ChevronDown, AlertTriangle,
  Info
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import SystemMonitor from "../SystemMonitor/SystemMonitor"
import ProjectFileTree from "../ProjectFileTree/ProjectFileTree"

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
import PipelineTimeline from "../PipelineTimeline/PipelineTimeline"
import LiveLogStream from "../LiveLogStream/LiveLogStream"
import { useNavigate } from "react-router"
import { FastqDropZone } from "../DropZone/DropZone"

export default function ProjectPage() {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)

  const navigate = useNavigate()

  const groupedFastq = useMemo(() => {
    return groupFastqBySample(project?.fastq?.files || [])
  }, [project?.fastq?.files])
  const [expandedSamples, setExpandedSamples] = useState({})

  const sampleCount = Object.keys(groupedFastq).length
  const fastqCount = project?.fastq?.files?.length ?? 0

  useEffect(() => {
    if (!project) return

    window.electron.invoke("fs:startSync", project.path)
  }, [project])

  useEffect(() => {
    if (!groupedFastq) return

    setExpandedSamples((prev) => {
      const next = { ...prev }

      Object.keys(groupedFastq).forEach((sample) => {
        if (!(sample in next)) {
          next[sample] = true // expanded by default
        }
      })

      return next
    })
  }, [groupedFastq])

  const allExpanded =
    Object.values(expandedSamples).length > 0 &&
    Object.values(expandedSamples).every(Boolean)

  const expandAll = () => {
    setExpandedSamples(
      Object.fromEntries(Object.keys(groupedFastq).map(k => [k, true]))
    )
  }

  const collapseAll = () => {
    setExpandedSamples(
      Object.fromEntries(Object.keys(groupedFastq).map(k => [k, false]))
    )
  }

  const toggleSample = (sample) => {
    setExpandedSamples((p) => ({
      ...p,
      [sample]: !p[sample],
    }))
  }

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


  const [lastLog, setLasLog] = useState("");

  /* useEffect(() => {
    window.pipeline.onLog((msg) => {
      //console.log("PIPELINE:", msg)
      setLasLog(msg);
    })

    window.pipeline.onEnd((msg) => {
      console.log("PIPELINE END:", msg)
    })
  }, []) */

  const runPipeline = async () => {
    const res = await window.pipeline.start()
    console.log(res);
    if (res.ok == false) {
      alert("Docker Daemon is not running! Please start Docker first...");
    }
  }


  const removeSample = async (sampleName) => {
    const ok = window.confirm(
      `Remove sample "${sampleName}"?\n\nThis will remove both R1 and R2 files from the project.`
    )



    if (!ok) return

    const updated = await window.projectApi.removeFastqSample(sampleName)
    setProject(updated)
  }

  const steps = ["Files", "Configure Pipeline", "Settings", "Run"]

  const addFastq = async () => {
    const paths = await window.fastqApi.select()
    if (!paths) return

    const files = await window.fastqApi.collect(paths)
    const updated = await window.projectApi.addFastq(files)

    setProject(updated)
  }

  function groupFastqBySample(files = []) {
    const groups = {}

    files.forEach((file) => {
      // Matches:
      // <sample>_R1_001.fastq.gz
      // <sample>_R2_001.fastq.gz
      const match = file.name.match(/^(.+)_R([12])_\d+\.fastq(\.gz)?$/i)
      if (!match) return

      const sample = match[1]
      const read = match[2] === "1" ? "R1" : "R2"

      if (!groups[sample]) {
        groups[sample] = { R1: null, R2: null }
      }

      groups[sample][read] = file
    })

    return groups
  }

  useEffect(() => {
    const load = async () => {
      const current = await window.projectApi.getCurrent()
      //alert(JSON.stringify(current));
      setProject(current)
      setLoading(false)
    }
    load()
  }, [])


  const canGoPrev = activeStep > 0
  const canGoNext = activeStep < steps.length - 1

  const goPrev = () => {
    if (canGoPrev) setActiveStep((s) => s - 1)
  }

  const goNext = () => {
    if (canGoNext) setActiveStep((s) => s + 1)
  }

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

  return (
    <div className="relative min-h-screen bg-[#f5f6f8] overflow-hidden">
      {/* background accent */}
      <div className="pointer-events-none absolute top-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-emerald-500/20 via-green-500/20 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-10 pt-14">
        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          {/* LEFT — TITLE */}
          <div>
            <h1 className="text-3xl font-semibold text-slate-800">
              {project.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Active Twine project workspace
            </p>
          </div>

          {/* RIGHT — COMPACT INFO ROW */}
          <div className="flex flex-wrap gap-2">
            <MiniInfo
              icon={<Folder size={14} />}
              label="Dir"
              value={project.path}
            />
            <MiniInfo
              icon={<Calendar size={14} />}
              label="Created"
              value={new Date(project.createdAt).toLocaleString()}
            />
            <MiniInfo
              icon={<FileText size={14} />}
              label="File"
              value="project.twine"
            />
          </div>
        </div>

        {/* MAIN PANE */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* LEFT — STEPS */}
          <Card className="md:col-span-2 border-0 shadow-md">
            <CardContent className="ap-6">
              {/* step tabs */}
              <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1">
                {steps.map((step, idx) => (
                  <button
                    key={step}
                    onClick={() => setActiveStep(idx)}
                    className={`
                      flex-1 rounded-md px-4 py-2 text-sm font-medium transition
                      ${idx === activeStep
                        ? "bg-white text-slate-800 shadow"
                        : "text-slate-500 hover:text-slate-700"}
                    `}
                  >
                    {step}
                  </button>
                ))}
              </div>

              <Separator className="mb-6" />

              {/* STEP 1 — FILES */}
              {activeStep === 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-700">
                    Input FASTQ files
                  </h3>

                  <p className="text-sm text-slate-500">
                    Add paired-end FASTQ files for analysis. Files will be
                    registered to this project.
                  </p>


                  <div className="space-y-4">
                    <button
                      onClick={addFastq}
                      className="
      text-xs font-medium
      px-4 py-2
      rounded-md
      bg-slate-50
      border border-slate-300
      hover:border-indigo-500
      hover:text-indigo-700
      transition
    "
                    >
                      Choose FASTQ files from your System
                    </button>
                    <div className="text-xs text-slate-500 mt-2">Your recently used folders are remembered per project for quicker access. <InfoPopoverLastOpenedFolders /></div>

                    {/* OR divider */}
                    <div className="relative flex items-center">
                      <div className="flex-grow border-t border-slate-200" />
                      <span className="mt-5 mx-3 text-[10px] uppercase tracking-wide text-slate-400 bg-white px-2">
                        or
                      </span>
                      <div className="flex-grow border-t border-slate-200" />
                    </div>

                    <FastqDropZone
                      onDrop={async (paths) => {
                        const files = await window.fastqApi.collect(paths)
                        const updated = await window.projectApi.addFastq(files)
                        setProject(updated)
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    FASTQ files are referenced, not copied.
                    <InfoPopover />
                  </p>

                  {project.fastq?.files?.length > 0 && (() => {



                    return (
                      <div className="mt-4 space-y-6">


                        {Object.keys(groupedFastq).length > 0 && (
                          <div className="mt-4 space-y-4">
                            {/* header */}
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-slate-700">
                                Samples{" "}
                                <span className="ml-1 text-sm font-normal">
                                  ({sampleCount} samples · {fastqCount} FASTQs)
                                </span>
                              </h4>

                              <button
                                onClick={allExpanded ? collapseAll : expandAll}
                                className="text-xs font-medium hover:text-indigo-700"
                              >
                                {allExpanded ? "Collapse all" : "Expand all"}
                              </button>
                            </div>

                            {/* samples */}
                            {Object.entries(groupedFastq).map(([sample, reads]) => {
                              const expanded = expandedSamples[sample]

                              return (
                                <div
                                  key={sample}
                                  className="rounded-lg border bg-slate-50"
                                >
                                  {/* header */}
                                  <div
                                    onClick={() => toggleSample(sample)}
                                    className="
    flex w-full items-center justify-between
    px-4 py-3 cursor-pointer
    hover:bg-slate-100
  "
                                  >
                                    {/* LEFT */}
                                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                      {sample}
                                    </span>

                                    {/* RIGHT */}
                                    <div className="flex items-center gap-3">
                                      {/* REMOVE — real button */}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          removeSample(sample)
                                        }}
                                        className="text-xs font-medium text-red-600 hover:text-red-700 bg-transparent"
                                      >
                                        Remove
                                      </button>

                                      {/* CARET — visual only */}
                                      <span className="flex h-8 w-8 items-center justify-center text-slate-500">
                                        {expanded ? (
                                          <ChevronDown size={18} strokeWidth={2} />
                                        ) : (
                                          <ChevronRight size={18} strokeWidth={2} />
                                        )}
                                      </span>
                                    </div>
                                  </div>

                                  {/* body */}
                                  {expanded && (
                                    <div className="px-4 pb-4 space-y-2">
                                      {reads.R1 && <FastqFileRow file={reads.R1} />}
                                      {reads.R2 && <FastqFileRow file={reads.R2} />}

                                      {(!reads.R1 || !reads.R2) && (
                                        <p className="flex items-center gap-1 text-xs text-destructive">
                                          <AlertTriangle className="h-3.5 w-3.5" />
                                          Incomplete pair detected
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        <p className="text-xs text-slate-400">
                          {project.fastq.files.length} files added ·{" "}
                          {new Date(project.fastq.addedAt).toLocaleString()}
                        </p>
                      </div>
                    )
                  })()}
                </div>
              )}

              {/* STEP 2 — CONFIGURE */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-medium text-slate-700">
                    Configure pipeline
                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {/* STEP 1 */}
                    <PipelineCard
                      step={1}
                      title="Raw Read QC"
                      value={pipelineConfig.qc}
                      options={[
                        { label: "FastQC (Default)", value: "fastqc" },
                        { label: "MultiQC", value: "multiqc" },
                      ]}
                      onChange={(v) => updatePipeline("qc", v)}
                    />

                    {/* STEP 2 */}
                    <PipelineCard
                      step={2}
                      title="Pre-Processing (Trimming)"
                      value={pipelineConfig.trimming}
                      options={[
                        { label: "fastp (Default)", value: "fastp" },
                        { label: "Trimmomatic", value: "trimmomatic" },
                      ]}
                      onChange={(v) => updatePipeline("trimming", v)}
                    />

                    {/* STEP 3 */}
                    <PipelineCard
                      step={3}
                      title="Read Alignment"
                      value={pipelineConfig.alignment}
                      options={[
                        { label: "BWA-mem (Default)", value: "bwa-mem" },
                        { label: "BWA-mem2", value: "bwa-mem2" },
                      ]}
                      onChange={(v) => updatePipeline("alignment", v)}
                    />

                    {/* STEP 4 */}
                    <PipelineCard
                      step={4}
                      title="Variant Calling"
                      value={pipelineConfig.variant}
                      options={[
                        { label: "HaplotypeCaller (Default)", value: "haplotypecaller" },
                        { label: "Strelka", value: "strelka" },
                        { label: "FreeBayes", value: "freebayes" },
                        { label: "DeepVariant", value: "deepvariant" },
                        { label: "mplielup", value: "mpileup" },
                      ]}
                      onChange={(v) => updatePipeline("variant", v)}
                    />
                  </div>

                  <p className="text-xs text-slate-400">
                    Default tools are recommended for most users. Advanced parameters
                    will be configurable later.
                  </p>
                </div>
              )}

              {/* STEP 3 — SETTINGS */}
              {activeStep === 2 && (
  <div className="space-y-6">
    <h3 className="text-sm font-medium text-slate-700">
      Sample settings
    </h3>

    <p className="text-sm text-slate-500">
      Assign friendly names to samples. These names will appear in
      statistics, charts, and reports.
    </p>

    <div className="space-y-4">
      {Object.entries(
        groupFastqBySample(project.fastq?.files || [])
      ).map(([sample, reads]) => {
        const displayName =
          project.sampleMeta?.[sample]?.displayName ?? ""

        return (
          <div
            key={sample}
            className="rounded-lg border p-4"
          >
            {/* Sample ID (full width, never truncated) */}
            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sample ID
              </p>
              <p className="text-sm font-medium text-slate-800 break-all">
                {sample}
              </p>
            </div>

            {/* Display name input */}
            <div>
              <p className="text-xs text-slate-500 mb-1">
                Display name (optional)
              </p>
              <input
                type="text"
                placeholder="e.g. Stool – Subject A"
                className="w-full rounded-md border px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            {/* Subtle file list */}
            <div className="mt-3 space-y-1 pl-1">
              {reads.R1 && (
                <p className="text-xs text-slate-400 truncate">
                  R1 · {reads.R1.name}
                  <br />
                  {reads.R2 && (
                  
                    <span>R2 · {reads.R2.name}</span>
                  
                )}
                </p>
              )}
              
            </div>
          </div>
        )
      })}
    </div>

    <p className="text-xs text-slate-400">
      Sample IDs are derived from filenames and cannot be changed.
    </p>
  </div>
)}

              {/* STEP 4 — RUN */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-slate-700">
                    Ready to run
                  </h3>

                  
                  <Button className="mt-2" onClick={runPipeline}>
                    Start analysis
                  </Button> &nbsp;

                  <Button className="mt-2" onClick={() => { navigate("/results") }}>
                    Outputs
                  </Button>
                
                  <br /><br />
                  <LiveLogStream
                    subscribe={(cb) => {
                      window.pipeline.onLog(cb)
                      return () => window.pipeline.onEnd(cb)
                    }}
                  />

                  <div><Loader2 className="h-4 w-4 animate-spin text-slate-500" /></div>
                  <PipelineTimeline steps={pipelineSteps} setActiveStep={1} activeSubstep={2} />
                </div>
              )}


              <Separator className="my-6" />

              <div className="flex items-center justify-between">
                {/* Previous */}
                <Button
                  variant="outline"
                  onClick={goPrev}
                  disabled={!canGoPrev}
                >
                  Previous
                </Button>

                {/* Step indicator */}
                <span className="text-xs text-slate-400">
                  Step {activeStep + 1} of {steps.length}
                </span>

                {/* Next */}
                <Button
                  onClick={goNext}
                  disabled={!canGoNext}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RIGHT — CONTEXT PANEL */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-medium text-slate-800">
                System Performance
              </h2>

              <SystemMonitor />

              <p className="text-sm text-slate-600 mt-5">
                Complete each step from left to right. Twine remembers
                your progress automatically.
              </p>



              <Separator className="my-6" />

              <h3 className="mb-2 text-sm font-medium text-slate-700">
                Project Files
              </h3>

              <div className="rounded-md border bg-slate-50 p-3">
                <ProjectFileTree project={project} />
              </div>


            </CardContent>
          </Card>
        </div>
      </div>
      <div style={{ height: 100 }}></div>
    </div>
  )
}

/* ---------- helpers ---------- */

function InfoCard({ icon, label, value }) {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-5">
        <div className="mb-2 flex items-center gap-2 text-slate-500">
          {icon}
          <span className="text-xs uppercase tracking-wide">
            {label}
          </span>
        </div>
        <p className="truncate text-sm font-medium text-slate-800">
          {value}
        </p>


      </CardContent>
    </Card>
  )
}

function FastqFileRow({ file }) {
  const sizeMB = (file.size / 1024 / 1024).toFixed(1)

  return (
    <div className="flex items-center gap-3 rounded-md border bg-white px-4 py-2 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-md ">
        <FileText size={38} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">
          {file.name}
          <br />
          {sizeMB} MB
        </p>

      </div>
    </div>
  )
}

function MiniInfo({ icon, label, value }) {
  return (
    <div className="
      flex items-center gap-2
      rounded-md border bg-white
      px-3 py-1.5
      text-xs text-slate-600
      shadow-sm
      max-w-[260px]
    ">
      <span className="text-slate-400">{icon}</span>

      <span className="uppercase tracking-wide text-slate-400">
        {label}:
      </span>

      <span className="truncate font-medium text-slate-700">
        {value}
      </span>
    </div>
  )
}

function PipelineCard({ step, title, value, options, onChange }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm p-4 space-y-3">
      {/* header */}
      <div className="flex items-center gap-2">
        <span
          className="
            flex h-6 w-6 items-center justify-center
            rounded-full bg-emerald-100
            text-xs font-semibold text-emerald-700
          "
        >
          {step}
        </span>

        <h4 className="text-sm font-medium text-slate-800">
          {title}
        </h4>
      </div>

      {/* shadcn select */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Select tool" />
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

function InfoPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center ml-1 text-slate-400 hover:text-slate-600"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 text-xs text-slate-600 leading-relaxed">
        FASTQ files remain in their original location and are read directly
        during analysis.
        <br />
        <br />
        You may also select a folder that already contains FASTQ files when
        creating a project. Twine will initialize the project using the existing
        files and automatically detect supported FASTQ pairs.
      </PopoverContent>
    </Popover>
  )
}


function InfoPopoverLastOpenedFolders() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center ml-1 text-slate-400 hover:text-slate-600"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-80 text-xs text-slate-600 leading-relaxed">
        Twine keeps track of the folders you last used for this project.
        <br />
        <br />
        File selection dialogs will default to your most recently opened location,
        making repeated imports faster and easier. This feature is currently not supported for drag drop.
      </PopoverContent>
    </Popover>
  )
}