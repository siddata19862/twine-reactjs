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

export default function StartUbuntu() {
  const navigate = useNavigate()

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
    <div className="min-h-screen bg-[#e6e6e6] text-slate-800">

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
        border-b border-[#cfcfcf]
        bg-[#f2f2f2]
        px-6 py-4 mt-8
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
          border border-[#cfcfcf]
        ">

          {/* ================= LEFT PANE ================= */}
          <section className="
            bg-[#f7f7f7]
            border-r border-[#cfcfcf]
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
                  border border-[#bfbfbf]
                  bg-[#eaeaea]
                  px-3 text-xs
                  text-slate-800
                  hover:bg-[#dedede]
                  active:bg-[#d4d4d4]
                "
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Empty Project
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
                border border-dashed border-[#9fb7a7]
                bg-[#eef4ef]
                p-10
                text-center
                hover:bg-[#e4eee6]
              "
            >
              <FolderOpen className="mx-auto h-10 w-10 text-[#4f7f62]" />

              <p className="mt-4 text-sm font-medium">
                Drop FASTQ folder here
              </p>

              <p className="mt-1 text-xs text-slate-600">
                Project will be created automatically
              </p>
            </FastqDropZone>

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
            bg-[#efefef]
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
                className="w-full h-8 text-xs"
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
            <div className="border-t border-[#cfcfcf]" />

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
                      px-2 py-1
                      hover:bg-[#e0e0e0]
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