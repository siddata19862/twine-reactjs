import {
  Folder,
  FileText,
  Link2,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

export default function TreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(true)

  const pad = { paddingLeft: depth * 16 }

  /* ---------- Folder ---------- */
  if (node.type === "folder") {
    return (
      <div>
        <div
          style={pad}
          onClick={() => setOpen(!open)}
          className="
            group flex items-center gap-2 text-xs cursor-pointer
            rounded px-2 py-1
            hover:bg-yellow-50
          "
        >
          {open ? (
            <ChevronDown className="h-3 w-3 text-slate-400" />
          ) : (
            <ChevronRight className="h-3 w-3 text-slate-400" />
          )}

          <Folder className="h-4 w-4 text-yellow-600 group-hover:text-yellow-700" />

          <span className="font-medium text-slate-800">
            {node.name}
          </span>
        </div>

        {open &&
          node.children?.map((c, i) => (
            <TreeNode key={i} node={c} depth={depth + 1} />
          ))}
      </div>
    )
  }

  /* ---------- Paired FASTQ ---------- */
  if (node.type === "pair") {
    return (
      <div style={pad} className="mt-1 space-y-1">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-700">
          <Link2 className="h-4 w-4 text-indigo-600" />
          {node.sample}
        </div>

        <div className="ml-6 space-y-1">
          {node.files.map((f, i) => (
            <div
              key={i}
              className="
                group flex items-center gap-2 text-xs
                text-slate-700
                hover:text-slate-900
              "
            >
              <Checkbox
                onClick={(e) => e.stopPropagation()}
                className="
                  h-3.5 w-3.5
                  rounded-[3px]
                  border border-slate-300
                  bg-white

                  group-hover:border-slate-400
                  group-hover:bg-slate-50

                  data-[state=checked]:bg-indigo-600
                  data-[state=checked]:border-indigo-600
                  data-[state=checked]:text-white

                  focus-visible:ring-1
                  focus-visible:ring-indigo-400

                  transition-colors
                "
              />

              <FileText className="h-4 w-4 text-slate-400" />

              <span>{f.name}</span>

              <span className="ml-2 rounded bg-indigo-100 text-indigo-700 px-1 text-[10px]">
                {f.read}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ---------- Single FASTQ ---------- */
  return (
    <div
      style={pad}
      className="
        group flex items-center gap-2 text-xs
        text-slate-700
        hover:text-slate-900
      "
    >
      <Checkbox
        onClick={(e) => e.stopPropagation()}
        className="
          h-3.5 w-3.5
          rounded-[3px]
          border border-slate-300
          bg-white

          group-hover:border-slate-400
          group-hover:bg-slate-50

          data-[state=checked]:bg-indigo-600
          data-[state=checked]:border-indigo-600
          data-[state=checked]:text-white

          focus-visible:ring-1
          focus-visible:ring-indigo-400

          transition-colors
        "
      />

      <FileText className="h-4 w-4 text-slate-400" />
      <span>{node.name}</span>
    </div>
  )
}