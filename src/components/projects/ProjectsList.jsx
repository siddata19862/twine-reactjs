import { useEffect } from "react"
import { useNavigate } from "react-router"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useProjectRegistryStore } from "../../store/useProjectRegistry"
import { FileText } from "lucide-react"

export default function ProjectsList({ mode = "full" }) {
  const navigate = useNavigate()
  const { projects, loading, refresh } = useProjectRegistryStore()

  useEffect(() => {
    refresh()
  }, [])

  const isCompact = mode === "compact"

  return (
    <div className={`h-full w-full ${isCompact ? "px-2 py-2" : "px-10 py-4"} bg-[#f4f6f8]`}>
      <div className={isCompact ? "" : "mx-auto max-w-5xl"}>
        {/* Header */}
        {!isCompact && (
          <>
            <div className="mb-2">
              <h1 className="text-sm font-semibold tracking-tight text-slate-900">
                Projects
              </h1>
              <p className="text-[11px] text-slate-500">
                Recently opened Twine projects
              </p>
            </div>
            <Separator className="mb-2 h-px bg-slate-200" />
          </>
        )}

        <Card className="rounded-none border-0 bg-transparent shadow-none p-0 gap-0">
          {/* Full mode table header */}
          {!isCompact && (
            <div className="grid grid-cols-[2fr_3fr_1.5fr] px-4 py-2 text-[10px] font-medium uppercase tracking-wide text-slate-400 border-b border-slate-200">
              <div>Project</div>
              <div>Directory</div>
              <div className="text-right">Last opened</div>
            </div>
          )}

          {loading && (
            <div className="px-4 py-2 text-[11px] text-slate-500">
              Loading project registry…
            </div>
          )}

          {!loading && projects.length === 0 && (
            <div className="px-4 py-2 text-[11px] text-slate-500">
              No projects found.
            </div>
          )}

          {!loading &&
            projects.map((p, idx) => (
              <div
  key={p.projectId}
  onClick={async () => {
    await window.electron.invoke("project:open", p.twinePath)
    navigate("/project")
  }}
  className={`
    cursor-pointer
    transition-colors transition-border
    border border-transparent
    hover:border-slate-300
    hover:bg-slate-50
    ${idx !== projects.length - 1 ? "border-b-slate-100" : ""}
    ${isCompact ? "px-3 py-2" : "px-4 py-2"}
  `}
>
                {/* FULL MODE */}
                {!isCompact && (
                  <div className="grid grid-cols-[2fr_3fr_1.5fr] items-center text-[12px]">
                    <div className="flex items-center gap-2 truncate font-medium text-slate-900">
                      <FileText size={14} className="shrink-0 text-slate-400" />
                      <span className="truncate">{p.name}</span>
                    </div>

                    <div className="truncate font-mono text-[11px] text-slate-500">
                      {p.projectDir}
                    </div>

                    <div className="text-right font-mono text-[11px] text-slate-600">
                      {new Date(p.lastOpenedAt).toLocaleString()}
                    </div>
                  </div>
                )}

                {/* COMPACT MODE */}
                {isCompact && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-slate-900">
                      <FileText size={13} className="text-slate-400" />
                      <span className="truncate">{p.name}</span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-500 truncate">
                      {p.projectDir}
                    </div>

                    <div className="text-[10px] font-mono text-slate-400">
                      {new Date(p.lastOpenedAt).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </Card>
      </div>
    </div>
  )
}