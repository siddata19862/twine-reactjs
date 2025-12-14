import {
  FolderOpen,
  PlusCircle,
  LayoutGrid,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router"

export default function Start() {
  const [selectedFolder, setSelectedFolder] = useState(null)

  const navigate = useNavigate();




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
      {/* Background accent */}
      <div className="pointer-events-none absolute bottom-[-120px] right-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-8 pt-20">
        {/* Logo */}
        <div className="mb-16 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
            <LayoutGrid size={20} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
            Twine Desktop
          </h1>
        </div>

        {/* Main actions */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* New Project */}
          <Card className="group col-span-1 md:col-span-2 border-0 shadow-md transition hover:shadow-xl">
            <CardContent className="flex h-full flex-col justify-between p-8">
              <div>
                <PlusCircle
                  size={42}
                  className="mb-4 text-blue-600"
                />
                <h2 className="text-2xl font-semibold text-slate-800">
                  New Project
                </h2>
                <p className="mt-2 text-sm">
                  Start a new analysis pipeline or workspace
                </p>
              </div>

              
      <Button
        variant="outline"
        className="mt-6 w-fit px-6 h-10"
        onClick={()=>navigate("/newproject")}
      >
        Create Project
      </Button>

      {/* Show selected folder */}
      {selectedFolder && (
        <p className="mt-4 text-sm text-slate-600">
          Selected folder:
          <span className="ml-1 font-medium text-slate-800">
            {selectedFolder.split("/").pop()}
          </span>
        </p>
      )}
            </CardContent>
          </Card>

          {/* Open Project */}
          <Card className="border-0 shadow-md transition hover:shadow-xl">
            <CardContent className="p-8">
              <FolderOpen size={36} className="mb-4 text-indigo-600" />
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
                  navigate("/project")
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
                <LayoutGrid size={36} className="mb-4 text-purple-600" />

                <h3 className="text-lg font-semibold text-slate-800">
                  My Projects
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  View recent and saved projects
                </p>

                <Button
                  variant="ghost"
                  className="mt-auto w-fit px-0 text-purple-600 hover:bg-transparent"
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