import {
  FolderOpen,
  PlusCircle,
  LayoutGrid,
} from "lucide-react"

import logo from "/logo.png"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router"
import TwineLoader from "../TwineLoader/TwineLoader"
import { FastqDropZone } from "../DropZone/DropZone"

export default function Start() {
  const [selectedFolder, setSelectedFolder] = useState(null)

  const navigate = useNavigate();

  const handleFolderDrop = async (e,folder) => {
  e.preventDefault()

  console.log("e",e);
  const item = e.dataTransfer.files?.[0]
  if (!item?.path) return

  const result = await window.api.scanFastqFolder(item.path)

  if (result.success) {
    setSelectedFolder(result.root)
    setFastqFiles(result.files)
    navigate("/newproject", {
      state: result,
    })
  }
}


  const [loadingProject, setLoadingProject] = useState(false)


  const handleCreateProject = async () => {
    const folderPath = await window.dialogApi.selectFolder()


    if (!folderPath) return


    setSelectedFolder(folderPath)
    const res = await window.projectApi.create({
      name: "MyProject",
      path: folder,
    });

    setCurrentTwine(res.twine);

    // console log full path
    console.log("Selected folder:", folderPath)
  }
  return (
    <div className="relative min-h-screen bg-[#f5f6f8] overflow-hidden">

      {loadingProject && (
        <TwineLoader
          title="Opening Project"
          duration={2800}
          steps={[
            "Scanning project workspace…",
            "Loading Twine configuration…",
            "Checking pipeline stages…",
            "Validating stage checkpoints…",
            "Resolving input/output paths…",
            "Preparing execution environment…",
          ]}
          onComplete={() => navigate("/project")}
        />
      )}

      {/* Background accent */}
      <div className="pointer-events-none absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-8 pt-20">
        {/* Logo */}
        <div className="mb-16 flex items-center gap-3">

          <img src={logo} alt="Logo" className="h-[150px]" />
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Desktop
          </h1>
        </div>

        {/* Main actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* New Project */}
{/* New Project */}
<Card className="group col-span-1 md:col-span-2 border-0 shadow-md transition hover:shadow-xl">
  <CardContent className="flex h-full flex-col gap-6 p-8">

    {/* Header row */}
    <div className="flex items-start justify-between gap-6">
      <div className="flex items-start gap-4">
        <PlusCircle size={38} className="mt-1 text-emerald-600" />

        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            New Project
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start a new analysis pipeline or workspace
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        className="h-10 shrink-0 px-6"
        onClick={() => navigate("/newproject")}
      >
        Create Project
      </Button>
    </div>

    {/* OR Divider */}
    <div className="relative flex items-center">
      <div className="flex-grow border-t border-muted" />
      <span className="mx-3 text-xs uppercase tracking-wide text-muted-foreground">
        OR
      </span>
      <div className="flex-grow border-t border-muted" />
    </div>

<FastqDropZone
  onDrop={async (paths) => {
    try {
      const { fastqFiles, project } =
        await window.api.collectAndCreate(paths)

      setProject(project)
    } catch (err) {
      
      if (err) {
        const ok = window.confirm(
          "A Twine project already exists in this folder.\n\nDo you want to overwrite it?"
        )

        if (!ok) return

        // Retry with overwrite = true
        const { fastqFiles, project } =
          await window.api.collectAndCreate(paths, true)

        //setProject(project)
        navigate("/project")
      } else {
        console.error(err)
        alert("Failed to create project")
      }
    }
  }}
/>
    {/* Drop zone (PROMINENT) */}
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        const folder = e.dataTransfer.files?.[0]
        if (folder) {
          
          handleFolderDrop(e,folder)
        }
      }}
      className="
        flex flex-col items-center justify-center gap-3
        rounded-2xl border-2 border-dashed border-emerald-400/70
        bg-emerald-50/60
        p-10 text-center
        transition
        hover:border-emerald-500 hover:bg-emerald-100/60
      "
    >
      <FolderOpen className="h-10 w-10 text-emerald-600" />

      <p className="text-base font-semibold text-slate-800">
        Drag your FASTQ folder here
      </p>

      <p className="max-w-sm text-sm text-slate-600">
        Drop a folder containing FASTQ files to instantly create
        a new project and begin analysis
      </p>
    </div>

    {/* Selected folder */}
    {selectedFolder && (
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <Upload className="h-4 w-4 text-emerald-600" />
        <span>
          Selected folder:
          <span className="ml-1 font-medium text-slate-900">
            {selectedFolder.split("/").pop()}
          </span>
        </span>
      </div>
    )}

  </CardContent>
</Card>

          {/* Open Project */}
          <Card className="border-0 shadow-md transition hover:shadow-xl">
            <CardContent className="p-8">
              <FolderOpen size={36} className="mb-4 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-800">
                Open Project
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Open an existing folder
              </p>

              <Button
                variant="outline"
                className="mt-6 w-full"
                onClick={async () => {
                  const project = await window.projectApi.open()
                  if (!project) return   // user cancelled → no navigation
                  setLoadingProject(true)
                  //navigate("/project")
                }}
              >
                Browse
              </Button>

            </CardContent>
          </Card>

          {/* My Projects */}
          <Card className="border-0 shadow-md transition hover:shadow-xl">
            <CardContent className="flex h-full gap-6 p-6">
              {/* Left content */}
              <div className="flex flex-1 flex-col">
                <LayoutGrid size={36} className="mb-4 text-emerald-600" />

                <h3 className="text-lg font-semibold text-slate-800">
                  My Projects
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  View recent and saved projects
                </p>

                <Button
                  variant="ghost"
                  className="mt-auto w-fit px-0 text-emerald-600 hover:bg-transparent"
                >
                  View dashboard →
                </Button>
              </div>

              {/* Right pane – recent list */}
              <div className="w-52 rounded-lg border bg-slate-50 p-3">
                <p className="mb-2 text-xs font-medium uppercase text-slate-400">
                  Recent
                </p>

                <ul className="space-y-1 text-sm">
                  {[
                    "Gut_16S_Run_01",
                    "Soil_Microbiome",
                    "Cancer_Pilot_A",
                    "Mock_Community",
                  ].map((name) => (
                    <li
                      key={name}
                      className="cursor-pointer rounded px-2 py-1 text-slate-700 hover:bg-white hover:shadow-sm"
                    >
                      {name}
                    </li>
                  ))}
                </ul>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3 w-full justify-start px-2 text-xs text-slate-500"
                >
                  Show all projects →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer hint */}
        <p className="mt-16 text-xs text-slate-400">
          © 2025 Twine • Designed for reproducible pipelines
        </p>
      </div>
    </div>
  )
}