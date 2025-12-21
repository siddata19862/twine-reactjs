import { useEffect } from "react"
import { useNavigate } from "react-router"
//import { useProjectRegistryStore } from "@/store/useProjectRegistryStore"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useProjectRegistryStore } from "../../store/useProjectRegistry"

export default function ProjectsList() {
  const navigate = useNavigate()
  const { projects, loading, refresh } = useProjectRegistryStore()

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="h-full w-full bg-[#f8fafc] p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Projects
          </h1>
          <p className="text-xs text-slate-500">
            Recently opened Twine projects
          </p>
        </div>

        <Separator />

        {/* List */}
        <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {loading && (
            <div className="p-6 text-sm text-slate-500">
              Loading registry…
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="p-6 text-sm text-slate-500">
              No projects found.
            </div>
          )}

          {!loading &&
            projects.map((p) => (
              <div
                key={p.projectId}
                onClick={async () => {
  await window.electron.invoke(
    "project:open",
    p.twinePath
  )

  navigate(`/newproject`)
}}
                className="
                  group cursor-pointer
                  border-b last:border-b-0
                  px-6 py-4
                  transition-colors
                  hover:bg-slate-50
                "
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-sm font-medium">
                      {p.name}
                    </div>

                    <div className="mt-1 font-mono text-[11px] text-slate-500">
                      {p.projectDir}
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-500">
                    <div>Last opened</div>
                    <div className="font-mono">
                      {new Date(p.lastOpenedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Card>
      </div>
    </div>
  )
}