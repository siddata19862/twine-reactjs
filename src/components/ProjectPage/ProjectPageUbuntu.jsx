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
import HeaderBar from "../HeaderBar/HeaderBar"
import { useTwineStore } from "../../store/useTwineStore"
import HeaderBarProject from "../HeaderBar/HeaderBarProject"
import PipelinePanel from "../pipelineStatus/PipelinePanel"

export default function ProjectPageUbuntu() {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const [sampleNames, setSampleNames] = useState({})

  const handleExportCSV = async () => {
  const rows = Object.entries(sampleNames).map(
    ([sampleId, displayName]) => ({
      sample_id: sampleId,
      display_name: displayName || ""
    })
  )

  await window.electron.invoke("samples:exportCSV", rows)
}

  

  const twine = useTwineStore((s) => s.twine)
      //console.log("twineee - Project Page",twine);

  useEffect(()=>{
    //console.log("mytwine",twine);
    if(!twine) return;
    console.log("dockerlog","twine-"+twine?.projectId);
    console.log("twine",twine);
    //window.electron.invoke("docker:logs","twine-"+twine?.projectId);
  },[twine]);

  const navigate = useNavigate()

  /* ---------------- FASTQ grouping ---------------- */
  function groupFastqBySample(files = []) {
    //console.log("grouping",files);
    const groups = {}

    files.forEach((file) => {
      const match = file.name.match(/^(.+)_R([12])_\d+.*\.fastq(\.gz)?$/i)
      //console.log("match",match);
      if (!match) return

      const sample = match[1]
      const read = match[2] === "1" ? "R1" : "R2"

      if (!groups[sample]) groups[sample] = { R1: null, R2: null }
      groups[sample][read] = file
    })
    //console.log("returniing",groups);

    return groups
  }

  const groupedFastq = useMemo(
    
    () => groupFastqBySample(twine?.fastq?.files || []),
    [twine?.fastq?.files]
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
  /*useEffect(() => {
    const load = async () => {
      const current = await window.projectApi.getCurrent()
      setProject(current)
      setLoading(false)
    }
    load()
  }, [])*/

  useEffect(() => {
    if (!twine) return
    console.log("syncing");
    window.electron.invoke("fs:startSync", twine.path)
  }, [twine])

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

  /* useEffect(()=>{
    window.pipeline.onLog((m)=>{
      console.log("m",m);
    });
  }); */
  
  
  /*const runPipeline = async () => {
    const res = await window.pipeline.start()
    if (res?.ok === false) {
      alert("Docker daemon is not running.")
    }
  }*/
 const runPipeline = async () => {
        const res = await window.pipeline.run()
        console.log(res);
        if (res.ok == false) {
        alert("Docker Daemon is not running! Please start Docker first...");
        }
    }

  const steps = ["Files", "Configure", "Settings", "Run","Output"]

  /* ---------------- guards ---------------- */
  if (loading || !twine) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-500">
        Loading project…
      </div>
    )
  }

  /*if (!project) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-slate-500">
        No active project
      </div>
    )
  }*/

  /* ===================================================== */
  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800">
      {/* ---------------- HEADER ---------------- */}
      <HeaderBarProject />

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
                  Add External FASTQ files
                </Button>

                

                <FastqDropZone
                  onDrop={async (paths) => {
                    const files = await window.fastqApi.collect(paths)
                    const updated = await window.projectApi.addFastq(files)
                    setProject(updated)
                  }}>
                    <p className="text-slate-600">
        Drag individual FASTQ files here (Not Folders) that are not in the current directory
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Files are referenced, not copied
      </p>
                  </FastqDropZone>


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



            {activeStep === 2 && (
  <div className="space-y-6">
    <h3 className="text-sm font-medium text-slate-700">
      Sample settings
    </h3>

    <p className="text-sm text-slate-500">
      Assign friendly names to samples. These names will appear in
      statistics, charts, and reports.
    </p>

    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr className="border-b">
            <th className="px-4 py-3 text-left font-semibold">
              Sample ID
            </th>
            <th className="px-4 py-3 text-left font-semibold">
              Display name (Group)
            </th>
            
          </tr>
        </thead>

        <tbody className="divide-y">
          {Object.entries(
            groupFastqBySample(twine.fastq?.files || [])
          ).map(([sample, reads]) => (
            <tr
              key={sample}
              className="hover:bg-slate-50 transition"
            >
              {/* Sample ID */}
              <td className="px-4 py-3 align-top">
                <p className="font-mono text-xs text-slate-800 break-all">
                  {sample}
                </p>
              </td>

              {/* Display name */}
              <td className="px-4 py-3 align-top">
                <input
  type="text"
  placeholder="e.g. Stool – Subject A"
  value={sampleNames[sample] ?? ""}
  onChange={(e) =>
    setSampleNames(prev => ({
      ...prev,
      [sample]: e.target.value
    }))
  }
  className="w-full rounded-md border px-3 py-1.5 text-sm
             focus:outline-none focus:ring-2 focus:ring-indigo-200"
/>
              </td>

              
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-end">
  <button
    onClick={handleExportCSV}
    className="rounded-md bg-indigo-600 px-4 py-2 text-sm
               font-medium text-white hover:bg-indigo-700"
  >
    Generate & Save CSV
  </button>
</div>
    </div>

    <p className="text-xs text-slate-400">
      Sample IDs are derived from filenames and cannot be changed.
    </p>
  </div>
)}

            {/* -------- RUN -------- */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <Button onClick={()=>navigate("/newproject")}>Back</Button>
                <Button onClick={runPipeline}>Start analysis</Button>
                <Button onClick={()=>{window.electron.invoke("docker:logs","twine-"+twine?.projectId);}}>Logs</Button>
                <LiveLogStream
                  subscribe={(cb) => {
                    window.pipeline.onLog(cb)
                    return () => window.pipeline.onEnd(cb)
                  }}
                />
                <PipelinePanel />
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
              <ProjectFileTree project={twine} />
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