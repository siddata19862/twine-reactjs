import { useState } from "react"
import { FolderOpen, Hammer } from "lucide-react"
import { useNavigate } from "react-router"

import { Card, CardContent } from "@/components/ui/card"
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

export default function NewProject({ onCreate }) {
  const [projectName, setProjectName] = useState("")
  const [projectDir, setProjectDir] = useState(null)

  // NEW: dropdown states
  const [technology, setTechnology] = useState("illumina")
  const [analysisType, setAnalysisType] = useState("wes")

  const navigate = useNavigate()

  const chooseDirectory = async () => {
    const folderPath = await window.dialogApi.selectFolder()
    if (!folderPath) return
    setProjectDir(folderPath)
  }

  const handleGetCurrent = async () => {
    const current = await window.projectApi.getCurrent()
    console.log("Current project:", current)
  }

  const handleCreate = async () => {
    if (!projectName || !projectDir || !technology || !analysisType) return

    const project = {
      name: projectName.trim(),
      path: projectDir,
      technology,
      analysisType,
    }

    const result = await window.projectApi.create(project)

    console.log("Project created:", result.filePath)
    navigate("/project")
  }

  return (
    <div className="relative min-h-screen bg-[#f5f6f8] overflow-hidden">
      {/* Test button */}
      

      {/* Background accent */}
      <div className="pointer-events-none absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-8 pt-20">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-10">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow">
                <Hammer size={18} />
              </div>
              <h1 className="text-2xl font-semibold text-slate-800">
                New Project
              </h1>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <Label>Project name</Label>
                <Input
                  placeholder="e.g. Gut_16S_Run_01"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="h-11"
                />
              </div>

              {/* Project Directory */}
              <div className="space-y-2">
                <Label>Project directory</Label>

                <div className="flex gap-3">
                  <Input
                    readOnly
                    value={projectDir || ""}
                    placeholder="Choose an empty folder"
                    className="h-11 flex-1 bg-slate-50 cursor-pointer"
                    onClick={chooseDirectory}
                  />

                  <Button
                    variant="outline"
                    className="h-11 px-4"
                    onClick={chooseDirectory}
                  >
                    <FolderOpen size={16} className="mr-2" />
                    Browse
                  </Button>
                </div>

                <p className="text-xs text-slate-500">
                  This directory should be empty. All pipeline outputs will be
                  created here. You can add FASTQ files later.
                  <br />
                  <b>
                    Note: Please select an existing directory only. Newly created
                    folders may require permission changes.
                  </b>
                </p>
              </div>

              {/* Technology Type */}
              <div className="space-y-2">
                <Label>
                  Technology Type <span className="text-red-500">*</span>
                </Label>

                <Select value={technology} onValueChange={setTechnology}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="illumina">
                      PacBio
                    </SelectItem>
                    <SelectItem value="pacbio">
                      Illumina (Default)
                    </SelectItem>

                    <SelectItem value="nanopore" disabled>
                      Nanopore
                    </SelectItem>
                    <SelectItem value="mgi" disabled>
                      MGI
                    </SelectItem>
                    <SelectItem value="ils" disabled>
                      Element Biosciences (ILS)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Analysis Type */}
              <div className="space-y-2">
                <Label>
                  Analysis Type <span className="text-red-500">*</span>
                </Label>

                <Select value={analysisType} onValueChange={setAnalysisType}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="mrna">
                      RNA Sequencing
                    </SelectItem>
                    <SelectItem value="rna">
                      mRNA Sequencing
                    </SelectItem>
                    <SelectItem value="wes">
                      Whole Exome Sequencing (WES)
                    </SelectItem>

                    <SelectItem value="wgs-5x" disabled>
                      NVIDIA Parabricks Germline DeepVariant WGS (≤5X)
                    </SelectItem>
                    <SelectItem value="wgs-30x" disabled>
                      NVIDIA Parabricks Germline DeepVariant WGS (≤30X)
                    </SelectItem>
                    <SelectItem value="wgs-50x" disabled>
                      NVIDIA Parabricks Germline DeepVariant WGS (≤50X)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Info box */}
              <div className="rounded-lg border bg-slate-50 p-4 text-sm text-slate-600">
                <p className="font-medium text-slate-700 mb-1">
                  What happens next?
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Twine will initialize a project structure</li>
                  <li>You can add FASTQ files at any time</li>
                  <li>Runs, logs, and QC outputs stay isolated</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="ghost">
                  Cancel
                </Button>

                <Button
                  className="px-6"
                  disabled={
                    !projectName ||
                    !projectDir ||
                    !technology ||
                    !analysisType
                  }
                  onClick={handleCreate}
                >
                  Create project
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  )
}