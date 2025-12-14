import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, ChevronRight, CheckCircle2, File, Folder } from "lucide-react"
import LiveLogStream from "../../LiveLogStream/LiveLogStream"
import { LiveSystemStrip } from "../../LiveSystemStrip/LiveSystemStrip"
import SystemMonitorCompact from "../../SystemMonitor/SystemMonitorCompact"

//import LiveLogStream from "../LiveLogStream/LiveLogStream"


export default function ResultsPage() {
  const [tab, setTab] = useState("status")
  //const [steps, setSteps] = useState([])
  const [activeStep, setActiveStep] = useState(null)
  const [activeSubstep, setActiveSubstep] = useState(null)
  const [expandedStep, setExpandedStep] = useState(null)

  //const [fileTree, setFileTree] = useState(null)
  const [previewFile, setPreviewFile] = useState(null)
  const [previewContent, setPreviewContent] = useState(null)

  const fileTree = [
  {
    "type": "folder",
    "name": "Runs",
    "path": "Runs",
    "children": [
      {
        "type": "folder",
        "name": "2025-12-14_18-10-00",
        "path": "Runs/2025-12-14_18-10-00",
        "children": [
          {
            "type": "folder",
            "name": "FastQC",
            "path": "Runs/2025-12-14_18-10-00/FastQC",
            "children": [
              {
                "type": "file",
                "name": "sample1_fastqc.html",
                "path": "Runs/2025-12-14_18-10-00/FastQC/sample1_fastqc.html",
                "ext": "html",
                "size": 245678
              },
              {
                "type": "file",
                "name": "sample1_fastqc.zip",
                "path": "Runs/2025-12-14_18-10-00/FastQC/sample1_fastqc.zip",
                "ext": "zip",
                "size": 1048576
              }
            ]
          },

          {
            "type": "folder",
            "name": "Filtered",
            "path": "Runs/2025-12-14_18-10-00/Filtered",
            "children": [
              {
                "type": "file",
                "name": "sample1_R1.filtered.fastq.gz",
                "path": "Runs/2025-12-14_18-10-00/Filtered/sample1_R1.filtered.fastq.gz",
                "ext": "gz",
                "size": 18765432
              },
              {
                "type": "file",
                "name": "sample1_R2.filtered.fastq.gz",
                "path": "Runs/2025-12-14_18-10-00/Filtered/sample1_R2.filtered.fastq.gz",
                "ext": "gz",
                "size": 18342112
              }
            ]
          },

          {
            "type": "folder",
            "name": "DADA2",
            "path": "Runs/2025-12-14_18-10-00/DADA2",
            "children": [
              {
                "type": "file",
                "name": "feature-table.tsv",
                "path": "Runs/2025-12-14_18-10-00/DADA2/feature-table.tsv",
                "ext": "tsv",
                "size": 45678
              },
              {
                "type": "file",
                "name": "taxonomy.tsv",
                "path": "Runs/2025-12-14_18-10-00/DADA2/taxonomy.tsv",
                "ext": "tsv",
                "size": 38721
              }
            ]
          },

          {
            "type": "folder",
            "name": "Reports",
            "path": "Runs/2025-12-14_18-10-00/Reports",
            "children": [
              {
                "type": "file",
                "name": "summary.html",
                "path": "Runs/2025-12-14_18-10-00/Reports/summary.html",
                "ext": "html",
                "size": 152340
              },
              {
                "type": "file",
                "name": "qc_overview.png",
                "path": "Runs/2025-12-14_18-10-00/Reports/qc_overview.png",
                "ext": "png",
                "size": 83421
              }
            ]
          }
        ]
      }
    ]
  }
];
  const steps = [
  {
    "id": "fastqc",
    "label": "FASTQ quality check",
    "completed": true,
    "substeps": [
      {
        "name": "Scanning reads",
        "doneAt": "2025-12-14T18:10:21.320Z"
      },
      {
        "name": "Generating reports",
        "doneAt": "2025-12-14T18:10:29.112Z"
      },
      {
        "name": "Aggregating QC results",
        "doneAt": "2025-12-14T18:10:35.782Z"
      }
    ]
  },

  {
    "id": "filtering",
    "label": "Filtering & trimming",
    "completed": false,
    "substeps": [
      {
        "name": "Adapter removal",
        "doneAt": "2025-12-14T18:11:02.110Z"
      },
      {
        "name": "Quality trimming",
        "doneAt": null
      },
      {
        "name": "Length filtering",
        "doneAt": null
      }
    ]
  },

  {
    "id": "dada2",
    "label": "DADA2 inference",
    "completed": false,
    "substeps": [
      {
        "name": "Error model learning",
        "doneAt": null
      },
      {
        "name": "Denoising",
        "doneAt": null
      },
      {
        "name": "ASV table construction",
        "doneAt": null
      }
    ]
  },

  {
    "id": "report",
    "label": "Final reports",
    "completed": false,
    "substeps": [
      {
        "name": "Summaries",
        "doneAt": null
      },
      {
        "name": "Visualizations",
        "doneAt": null
      }
    ]
  }
]

  // --------------------
  // PIPELINE PROGRESS EVENTS
  // --------------------
  useEffect(() => {
    /*window.pipeline.onProgress((data) => {
      // data example:
      // { stepId: 'fastqc', substepIndex: 1, steps: [...] }
      setSteps(data.steps)
      setActiveStep(data.stepId)
      setActiveSubstep(data.substepIndex)
    })*/

    /*window.pipeline.onOutputTree((tree) => {
      setFileTree(tree)
    })*/
  }, [])

  // --------------------
  // LOAD FILE FOR PREVIEW
  // --------------------
  const openFile = async (filePath) => {
    const result = await window.pipeline.readOutputFile(filePath)
    setPreviewFile(filePath)
    setPreviewContent(result)
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* HEADER */}
        <h1 className="text-3xl font-semibold text-slate-800 mb-6">
          Analysis Results

          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-slate-800">
              Analysis Results
            </h1>

            <SystemMonitorCompact />
          </div>
        </h1>

        {/* TABS */}
        <div className="mb-6 flex gap-2 rounded-lg bg-slate-100 p-1 w-max">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              tab === "status"
                ? "bg-white text-slate-800 shadow"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setTab("status")}
          >
            Project Status
          </button>

          <button
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              tab === "output"
                ? "bg-white text-slate-800 shadow"
                : "text-slate-500 hover:text-slate-700"
            }`}
            onClick={() => setTab("output")}
          >
            Results / Output
          </button>
        </div>

        <Separator className="mb-6" />

        {/* =================== STATUS TAB =================== */}
        {tab === "status" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEFT — LOG STREAM */}
            <Card className="shadow-md border-0">
              <CardContent className="p-4">
                <h2 className="text-sm font-medium text-slate-700 mb-3">
                  Live Log
                </h2>

                <div className="h-[420px] overflow-auto rounded-md border bg-slate-50 p-2">
                  <LiveLogStream
                    subscribe={(cb) => {
                      window.pipeline.onLog(cb)
                      return () => window.pipeline.onEnd(cb)
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* RIGHT — STEPS */}
            <Card className="shadow-md border-0">
              <CardContent className="p-4">
                <h2 className="text-sm font-medium text-slate-700 mb-3">
                  Step Progress
                </h2>

                <div className="space-y-4">
                  {steps.map((step, index) => {
                    const isActive = step.id === activeStep
                    const isDone = step.completed === true

                    return (
                      <div key={step.id} className="border rounded-lg bg-white">
                        
                        {/* STEP HEADER */}
                        <button
                          className="flex w-full items-center justify-between p-3"
                          onClick={() =>
                            setExpandedStep(expandedStep === step.id ? null : step.id)
                          }
                        >
                          <div className="flex items-center gap-3">
                            {/* ICON / NUMBER */}
                            {isDone ? (
                              <CheckCircle2 className="text-emerald-600" />
                            ) : (
                              <div
                                className={`
                                  h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold
                                  ${isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"}
                                `}
                              >
                                {index + 1}
                              </div>
                            )}

                            <span
                              className={`text-sm font-medium ${
                                isActive ? "text-indigo-700" : "text-slate-700"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>

                          {expandedStep === step.id ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                        </button>

                        {/* SUBSTEPS LIST */}
                        {expandedStep === step.id && (
                          <div className="px-4 pb-3 space-y-2">
                            {step.substeps.map((sub, i) => {
                              const isSubActive = isActive && i === activeSubstep
                              const isSubDone = sub.doneAt

                              return (
                                <div key={i} className="flex items-center justify-between">
                                  <span
                                    className={`text-xs ${
                                      isSubActive
                                        ? "text-indigo-600 font-medium"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {sub.name}
                                  </span>

                                  {isSubDone && (
                                    <span className="text-xs text-emerald-600">
                                      {new Date(sub.doneAt).toLocaleTimeString()}
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* =================== OUTPUT TAB =================== */}
        {tab === "output" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* LEFT — FILE TREE */}
            <Card className="shadow-md border-0 md:col-span-1">
              <CardContent className="p-4">
                <h2 className="text-sm font-medium text-slate-700 mb-3">
                  Output Files
                </h2>

                <div className="max-h-[520px] overflow-auto border rounded-md bg-slate-50 p-2">
                  <FileTree tree={fileTree} openFile={openFile} />
                </div>
              </CardContent>
            </Card>

            {/* RIGHT — PREVIEW */}
            <Card className="shadow-md border-0 md:col-span-2">
              <CardContent className="p-4 space-y-3">
                <h2 className="text-sm font-medium text-slate-700">
                  Preview
                </h2>

                {!previewFile && (
                  <p className="text-sm text-slate-500">
                    Select a file to preview its content
                  </p>
                )}

                {previewFile && (
                  <>
                    <div className="text-xs text-slate-400">{previewFile}</div>

                    <div className="rounded border bg-white p-4 max-h-[500px] overflow-auto">
                      {previewContent?.type === "image" && (
                        <img src={previewContent.data} className="max-w-full" />
                      )}

                      {previewContent?.type === "html" && (
                        <iframe
                          srcDoc={previewContent.data}
                          className="w-full h-[480px] border rounded"
                        />
                      )}

                      {previewContent?.type === "text" && (
                        <pre className="text-xs whitespace-pre-wrap">
                          {previewContent.data}
                        </pre>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------
 FILE TREE COMPONENT
-------------------------- */
function FileTree({ tree = [], openFile }) {
  return (
    <div className="text-sm space-y-1">
      {tree.map((item) => (
        <TreeNode key={item.path} node={item} openFile={openFile} />
      ))}
    </div>
  )
}

function TreeNode({ node, openFile }) {
  const [open, setOpen] = useState(true)
  const isFolder = node.type === "folder"

  return (
    <div>
      <div
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-slate-200 cursor-pointer"
        onClick={() => {
          if (isFolder) setOpen(!open)
          else openFile(node.path)
        }}
      >
        {isFolder ? (
          open ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        ) : (
          <File size={14} />
        )}

        <span className="truncate">{node.name}</span>
      </div>

      {/* children */}
      {isFolder && open && node.children && (
        <div className="pl-4">
          {node.children.map((c) => (
            <TreeNode key={c.path} node={c} openFile={openFile} />
          ))}
        </div>
      )}
    </div>
  )
}