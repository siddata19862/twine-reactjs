import {
  FolderOpen,
  PlusCircle,
} from "lucide-react"

import logo from "/logo.png"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useNavigate } from "react-router"

import TwineLoader from "../TwineLoader/TwineLoader"
import { FastqDropZone } from "../DropZone/DropZone"
import TreeNode from "../TreeNode/TreeNode"

export default function StartUbuntu() {
  const navigate = useNavigate()

  const FASTQ_PREVIEW = {
  name: "Raw_Data",
  type: "folder",
  children: [
    {
      name: "Sample_Set_A",
      type: "folder",
      children: [
        {
          type: "pair",
          sample: "S1",
          files: [
            { name: "S1_R1.fastq.gz", read: "R1" },
            { name: "S1_R2.fastq.gz", read: "R2" },
          ],
        },
        {
          type: "pair",
          sample: "S2",
          files: [
            { name: "S2_R1.fastq.gz", read: "R1" },
            { name: "S2_R2.fastq.gz", read: "R2" },
          ],
        },
      ],
    },
    {
      name: "Unsorted",
      type: "folder",
      children: [
        {
          type: "single",
          name: "unknown_sample.fastq",
        },
      ],
    },
  ],
}

  const [selectedFolder, setSelectedFolder] = useState(null)
  const [loadingProject, setLoadingProject] = useState(false)

  /* -----------------------------
     Create Empty Project
  ----------------------------- */
  const handleCreateProject = async () => {
    const folderPath = await window.dialogApi.selectFolder()
    if (!folderPath) return

    setSelectedFolder(folderPath)

    await window.projectApi.create({
      name: "MyProject",
      path: folderPath,
    })

    navigate("/project")
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800">

      {/* Loader */}
      {loadingProject && (
        <TwineLoader
          title="Opening Project"
          duration={2600}
          steps={[
            "Scanning project workspace…",
            "Loading Twine configuration…",
            "Checking pipeline stages…",
            "Validating checkpoints…",
            "Preparing execution environment…",
          ]}
          onComplete={() => navigate("/project")}
        />
      )}

      {/* ---------------- Header ---------------- */}
      <header className="
        flex items-center gap-4
        border-b border-[#d6dbe0]
        bg-[#fafafa]
        px-6 py-4
        shadow-sm
      ">
        <img src={logo} alt="Twine Logo" className="h-15 w-32" />

        <div>
          <h1 className="text-sm font-semibold">
            Twine Studio
          </h1>
          <p className="text-xs text-slate-600">
            Reproducible bioinformatics pipelines
          </p>
        </div>
      </header>

      {/* ---------------- Main Split View ---------------- */}
      <main className="mx-auto max-w-6xl px-6 py-6">

        <div className="
          grid grid-cols-[3fr_2fr]
          border border-[#d6dbe0]
          bg-white
          shadow-sm
        ">

          {/* ================= LEFT PANE ================= */}
          <section className="
            bg-white
            border-r border-[#e2e6ea]
            p-6
            space-y-6
          ">

            {/* Title Row */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold">
                  New Project
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  Create a new analysis workspace
                </p>
              </div>

              <Button
                onClick={handleCreateProject}
                className="
                  h-8
                  rounded
                  border border-[#c9cfd6]
                  bg-[#f1f3f5]
                  px-3 text-xs
                  text-slate-800
                  hover:bg-[#e7eaee]
                  active:bg-[#dde1e6]
                "
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Empty Project
              </Button>
              <Button onClick={()=>navigate("/newproject")}>
                New
              </Button>

              <Button onClick={()=>window.electronAPI.generateScripts()}>
                Generate Scripts
              </Button>
            </div>

            {/* Drop Zone */}
            <FastqDropZone
              onDrop={async (paths) => {
                try {
                  await window.api.collectAndCreate(paths)
                  navigate("/project")
                } catch (err) {
                  const ok = window.confirm(
                    "A Twine project already exists in this folder.\n\nOverwrite it?"
                  )
                  if (!ok) return

                  await window.api.collectAndCreate(paths, true)
                  navigate("/project")
                }
              }}
              className="
                border border-dashed border-[#9ec5ad]
                bg-[#f3faf6]
                p-10
                text-center
                hover:bg-[#eaf6ef]
              "
            >
              <FolderOpen className="mx-auto h-10 w-10 text-[#4f8f6b]" />

              <p className="mt-4 text-sm font-medium">
                Drop FASTQ folder here
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Project will be created automatically
              </p>
            </FastqDropZone>

            {/* FASTQ Preview */}
<div className="rounded border border-[#d6dbe0] bg-white p-4">
  <h4 className="mb-2 text-xs font-semibold text-slate-700">
    Detected FASTQ Files
  </h4>

  <div className="max-h-[260px] overflow-auto font-mono">
    <TreeNode node={FASTQ_PREVIEW} />
  </div>
</div>

            {/* Selected Folder */}
            {selectedFolder && (
              <div className="text-xs text-slate-600">
                Selected folder:
                <span className="ml-1 font-medium text-slate-800">
                  {selectedFolder.split("/").pop()}
                </span>
              </div>
            )}
          </section>

          {/* ================= RIGHT PANE ================= */}
          <aside className="
            bg-[#f8f9fb]
            p-6
            space-y-6
          ">

            {/* Open Project */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase text-slate-700">
                Open Project
              </h3>

              <Button
                variant="outline"
                className="w-full h-8 text-xs bg-white"
                onClick={async () => {
                  const project = await window.projectApi.open()
                  if (!project) return
                  setLoadingProject(true)
                }}
              >
                Browse…
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-[#dde2e7]" />

            {/* Recent Projects */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase text-slate-700">
                Recent Projects
              </h3>

              <ul className="space-y-1 text-xs">
                {[
                  "Gut_16S_Run_01",
                  "Soil_Microbiome",
                  "Cancer_Pilot_A",
                  "Mock_Community",
                ].map((name) => (
                  <li
                    key={name}
                    className="
                      cursor-pointer
                      rounded
                      px-2 py-1
                      hover:bg-[#edf1f5]
                    "
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

        </div>

        {/* Footer */}
        <p className="mt-6 text-[10px] text-slate-500">
          © 2025 Twine • Desktop bioinformatics workspace
        </p>
      </main>
    </div>
  )
}