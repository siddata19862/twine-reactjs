import {
  Folder,
  FileText,
  Link2,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

const INDENT = 16
const CHECK_COL = "w-5 flex justify-center shrink-0"

/* =========================================================
   PairNode — single selectable FASTQ unit
   ========================================================= */
function PairNode({ node, depth, forceCheck, onSelectionChange }) {
  const [checked, setChecked] = useState(false)

  // IMPORTANT: parent only forces TRUE, never FALSE
  const effectiveChecked =
    forceCheck === true ? true : checked

  const paths =
    node.files?.map(f => f.path).filter(Boolean) ?? []

  const toggle = () => {
    const next = !effectiveChecked
    setChecked(next)

    if (!onSelectionChange || !paths.length) return

    if (next) {
      onSelectionChange(prev =>
        Array.from(new Set([...prev, ...paths]))
      )
    } else {
      onSelectionChange(prev =>
        prev.filter(p => !paths.includes(p))
      )
    }
  }

  return (
    <div>
      {/* Pair row */}
      <div
        style={{ paddingLeft: (depth + 1) * INDENT }}
        className="
          flex items-center gap-2 text-xs
          rounded px-2 py-1 cursor-pointer
          hover:bg-slate-50
        "
        onClick={toggle}
      >
        <div className={CHECK_COL}>
          <Checkbox
            checked={effectiveChecked}
            onClick={(e) => {
              e.stopPropagation()
              toggle()
            }}
          />
        </div>

        <Link2 className="h-4 w-4 text-slate-700 shrink-0" />
        <span className="font-medium text-slate-900">
          {node.sample}
        </span>
      </div>

      {/* FASTQ rows — visual only */}
      {node.files.map((f, i) => (
        <div
          key={i}
          style={{ paddingLeft: (depth + 2) * INDENT }}
          className="
            flex items-center gap-2 text-xs
            text-slate-500 px-2 py-0.5
            cursor-pointer
            hover:bg-slate-50
          "
          onClick={toggle}
        >
          <div className={CHECK_COL}>
            <Checkbox checked={effectiveChecked} />
          </div>

          <FileText className="h-4 w-4 text-slate-400 shrink-0" />
          <span>{f.name}</span>

          <span
            className="
              ml-2 rounded bg-slate-100 px-1
              text-[10px] text-slate-600
            "
          >
            {f.read}
          </span>
        </div>
      ))}
    </div>
  )
}

/* =========================================================
   TreeNode — folder owns subtree selection
   ========================================================= */
export default function TreeNode({
  node,
  depth = 0,
  forceCheck,
  onSelectionChange,
}) {
  const [open, setOpen] = useState(true)
  const [checked, setChecked] = useState(false)

  // CRITICAL RULE:
  // parent forces children ON only
  const effectiveChecked =
    forceCheck === true ? true : checked

  /* ---------- Folder ---------- */
  if (node.type === "folder") {
    return (
      <div>
        <div
          style={{ paddingLeft: depth * INDENT }}
          className="
            flex items-center gap-2 text-xs
            rounded px-2 py-1
            hover:bg-yellow-50
          "
        >
          {/* expand / collapse */}
          <div
            className="cursor-pointer"
            onClick={() => setOpen(v => !v)}
          >
            {open ? (
              <ChevronDown className="h-3 w-3 text-slate-400" />
            ) : (
              <ChevronRight className="h-3 w-3 text-slate-400" />
            )}
          </div>

          <div className={CHECK_COL}>
            <Checkbox
              checked={effectiveChecked}
              onClick={(e) => {
                e.stopPropagation()
                setChecked(v => !v)
              }}
            />
          </div>

          <Folder className="h-4 w-4 text-yellow-600 shrink-0" />
          <span
            className="font-medium text-slate-800 cursor-pointer select-none"
            onClick={() => setChecked(v => !v)}
          >
            {node.name}
          </span>
        </div>

        {open &&
          node.children?.map((c, i) => (
            <TreeNode
              key={i}
              node={c}
              depth={depth + 1}
              forceCheck={effectiveChecked}
              onSelectionChange={onSelectionChange}
            />
          ))}
      </div>
    )
  }

  /* ---------- Pair ---------- */
  if (node.type === "pair") {
    return (
      <PairNode
        node={node}
        depth={depth}
        forceCheck={forceCheck}
        onSelectionChange={onSelectionChange}
      />
    )
  }

  /* ---------- Single / Unsorted ---------- */
  return (
    <div
      style={{ paddingLeft: depth * INDENT }}
      className="
        flex items-center gap-2 text-xs
        text-slate-500 px-2 py-1
      "
    >
      <div className={CHECK_COL} />
      <FileText className="h-4 w-4 text-slate-400 shrink-0" />
      <span>{node.name}</span>
    </div>
  )
}