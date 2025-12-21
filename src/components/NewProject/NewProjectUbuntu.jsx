import { useState } from "react"
import { FolderOpen, Hammer } from "lucide-react"
import { useNavigate } from "react-router"

import logo from "/logo.png"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FastqDropZone } from "../DropZone/DropZone"
import FilesPreviewer from "../FilesPreviewer/FilesPreviewer"
import { useTwineStore } from "../../store/useTwineStore"
import HeaderBar from "../HeaderBar/HeaderBar"

export default function NewProjectUbuntu() {

  const twine = useTwineStore((s) => s.twine)
      console.log("twineee2",twine);

  const navigate = useNavigate()

  const [projectName, setProjectName] = useState("")
  const [projectDir, setProjectDir] = useState(null)
  const [technology, setTechnology] = useState("illumina")
  const [analysisType, setAnalysisType] = useState("mrna")

  const chooseDirectory = async () => {
    const folderPath = await window.dialogApi.selectFolder()
    if (!folderPath) return
    setProjectDir(folderPath)
  }

  const handleCreate = async () => {
    if (!twine?.name || !twine?.projectDir) return

    /* await window.projectApi.create({
      name: projectName.trim(),
      path: projectDir,
      technology,
      analysisType,
    }) */

    navigate("/project")
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800">
      {/* ---------------- Header ---------------- */}
      <HeaderBar />

      {/* ---------------- Main Layout ---------------- */}
      <main className="mx-auto max-w-6xl px-6 py-6">
        <div
          className="
            grid grid-cols-[3fr_2fr]
            border border-[#d6dbe0]
            bg-white
            shadow-sm
          "
        >
          {/* ================= LEFT PANE ================= */}
          <section
            className="
              border-r border-[#e2e6ea]
              bg-white
              p-6
              space-y-6
            "
          >
            {/* Title */}
            <div className="flex items-start gap-3">
              <div
                className="
                  flex h-8 w-8 items-center justify-center
                  rounded bg-[#e7eaee]
                  text-slate-700
                "
              >
                <Hammer size={14} />
              </div>

              <div>
                <h2 className="text-sm font-semibold">New Project</h2>
                <p className="mt-1 text-xs text-slate-600">
                  Create a new analysis workspace
                </p>
              </div>
            </div>

            {/* Project Name */}
            <div className="space-y-1">
              <Label className="text-xs">Project name</Label>
              <Input
                value={twine?.name ?? ""}
                onChange={()=>{}}
                placeholder="e.g. Gut_16S_Run_01"
                className="h-8 text-xs"
              />
            </div>

            {/* Output Directory */}
            <div className="space-y-1">
              <Label className="text-xs">Project Folder</Label>

              <div className="flex gap-2">
                <Input
                  readOnly
                  value={twine?.projectDir || ""}
                  placeholder="Select an existing directory"
                  className="h-8 text-xs bg-slate-50 cursor-pointer"
                  onClick={chooseDirectory}
                />

                <Button
                  variant="outline"
                  onClick={chooseDirectory}
                  className="h-8 px-3 text-xs"
                >
                  <FolderOpen className="mr-1 h-3 w-3" />
                  Browse
                </Button>
              </div>

              <p className="text-[11px] text-slate-500">
  All analysis outputs and generated result files will be written to the same directory as your input FASTQ files. You may choose a different output directory if preferred.
</p>
            </div>

            {/* Technology */}
            <div className="space-y-1">
              <Label className="text-xs">Technology</Label>

              <Select value={technology} onValueChange={setTechnology}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  
                  <SelectItem value="pacbio" disabled>PacBio</SelectItem>
                  <SelectItem value="nanopore" disabled>
                    Nanopore
                  </SelectItem>
                  <SelectItem value="illumina">Illumina (Default)</SelectItem>
                  <SelectItem value="mgi" disabled>
                    MGI
                  </SelectItem>
                  
                </SelectContent>
              </Select>
            </div>

            {/* Analysis Type */}
            <div className="space-y-1">
              <Label className="text-xs">Analysis type</Label>

              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="rna" disabled>RNA-Seq</SelectItem>
                  <SelectItem value="mrna">16S rRNA Amplicon-sequencing</SelectItem>
                  <SelectItem value="wes" disabled>Whole Exome (WES)</SelectItem>
                  <SelectItem value="wgs-30x" disabled>
                    WGS (Parabricks)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="ghost"
                className="h-8 text-xs"
                onClick={() => navigate("/start")}
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreate}
                disabled={!twine?.name || !twine?.projectDir}
                className="
                  h-8 px-4 text-xs
                  border border-[#c9cfd6]
                  bg-[#f1f3f5]
                  text-slate-800
                  hover:bg-[#e7eaee]
                  active:bg-[#dde1e6]
                "
              >
                Create Project
              </Button>
            </div>
          </section>

          {/* ================= RIGHT PANE ================= */}
          <aside className="bg-[#f8f9fb] p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase text-slate-700">
              What happens next
            </h3>

            <ul className="space-y-2 text-xs text-slate-600">
              <li>• Project structure is initialized</li>
              <li>• FASTQ files can be added anytime</li>
              <li>• Each run stays isolated</li>
              <li>• Logs and QC are preserved</li>
            </ul>

            <div className="border-t border-[#dde2e7] pt-4 text-[11px] text-slate-500">
              Tip: Drop a FASTQ folder on the start screen to auto-create projects.
            </div>



            {/* Drop Zone */}
                                    <FilesPreviewer />

          </aside>
        </div>

        <p className="mt-6 text-[10px] text-slate-500">
          © 2025 Twine • Desktop bioinformatics workspace
        </p>
      </main>
    </div>
  )
}