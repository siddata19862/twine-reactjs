import { useEffect, useState } from "react"
import {
  Folder,
  Calendar,
  FileText,
  Loader2,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
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
import { useNavigate } from "react-router"

export default function ProjectPage() {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStep, setActiveStep] = useState(0)

  const navigate = useNavigate()

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

  useEffect(() => {
  window.pipeline.onLog((msg) => {
    //console.log("PIPELINE:", msg)
    setLasLog(msg);
  })

  window.pipeline.onEnd((msg) => {
    console.log("PIPELINE END:", msg)
  })
}, [])

const runPipeline = async () => {
  await window.pipeline.start()
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
      <div className="pointer-events-none absolute top-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-transparent blur-3xl" />

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

                  <Button variant="outline" onClick={addFastq}>
                    Add FASTQ files
                  </Button>

                  {project.fastq?.files?.length > 0 && (() => {
  const grouped = groupFastqBySample(project.fastq.files)

  return (
    <div className="mt-4 space-y-6">
      {Object.entries(grouped).map(([sample, reads]) => (
  <div
    key={sample}
    className="rounded-lg border bg-slate-50 p-4 space-y-2"
  >
    {/* sample header + remove */}
    <div className="flex items-center justify-between">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {sample}
      </div>

      <button
        onClick={() => removeSample(sample)}
        className="text-xs font-medium text-red-600 hover:text-red-700"
      >
        Remove
      </button>
    </div>

    {/* R1 */}
    {reads.R1 && <FastqFileRow file={reads.R1} />}

    {/* R2 */}
    {reads.R2 && <FastqFileRow file={reads.R2} />}

    {/* warning if incomplete */}
    {(!reads.R1 || !reads.R2) && (
      <p className="text-xs text-amber-600">
        Incomplete pair detected
      </p>
    )}
  </div>
))}

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
          { label: "Bowtie2", value: "bowtie2" },
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
          { label: "FreeBayes", value: "freebayes" },
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
      {Object.entries(groupFastqBySample(project.fastq?.files || []))
        .map(([sample, reads]) => {
          const displayName =
            project.sampleMeta?.[sample]?.displayName ?? ""

          return (
            <div
              key={sample}
              className="rounded-lg border bg-slate-50 p-4"
            >
              {/* top row */}
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3 items-center">
                {/* base sample id */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Sample ID
                  </p>
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {sample}
                  </p>
                </div>

                {/* rename input */}
                <div className="md:col-span-2">
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
              </div>

              {/* subtle file list */}
              <div className="mt-3 space-y-1 pl-1">
                {reads.R1 && (
                  <p className="text-xs text-slate-400 truncate">
                    R1 · {reads.R1.name}
                  </p>
                )}
                {reads.R2 && (
                  <p className="text-xs text-slate-400 truncate">
                    R2 · {reads.R2.name}
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

                  <div className="rounded-md border bg-slate-50 p-4 text-sm text-slate-600 space-y-1">
                    <p>• FASTQ files: {project.fastq?.files?.length ?? 0}</p>
                    <p>• Pipeline: DADA2</p>
                    <p>• Output: Runs/</p>
                  </div>

                  <Button className="mt-2" onClick={runPipeline}>
                    Start analysis
                  </Button>

                  <Button className="mt-2" onClick={()=>{navigate("/results")}}>
                    Start analysis
                  </Button>

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

<div className="rounded-md border bg-slate-50 p-3 max-h-[280px] overflow-auto">
  <ProjectFileTree project={project} />
</div>


            </CardContent>
          </Card>
        </div>
      </div>
      <div style={{height:100}}></div>
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
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
        <FileText size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-800">
          {file.name}
        </p>
        <p className="text-xs text-slate-400">
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