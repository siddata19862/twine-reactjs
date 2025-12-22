import { useEffect, useState } from "react"
import { ChevronRight, ChevronDown, FileText } from "lucide-react"

import { useTwineStore } from "@/store/useTwineStore"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export default function OutputViewer() {
  const twine = useTwineStore(s => s.twine)

  const [tree, setTree] = useState([])
  const [expanded, setExpanded] = useState({})
  const [selected, setSelected] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!twine?.projectDir) return
    window.electron.invoke("outputs:list", twine.projectDir).then(setTree)
  }, [twine])

  useEffect(() => {
    if (!selected) return
    window.electron.invoke("outputs:preview", selected.path).then(setPreview)
  }, [selected])

  const toggle = path =>
    setExpanded(e => ({ ...e, [path]: !e[path] }))

  return (
    <Card
      className="
        gap-0 py-0 
        h-full
        grid grid-rows-[auto_1fr]
        overflow-hidden
        rounded
        border border-[#d6dbe0]
        bg-white
        shadow-none
        text-slate-800
      "
    >
      {/* ================= HEADER ================= */}
      <div
        className="
          px-4 py-2
          border-b border-[#dde2e7]
          bg-[#fafafa]
          text-sm font-medium
          text-slate-700
        "
      >
        Output Viewer
      </div>

      {/* ================= BODY ================= */}
      <div className="grid grid-cols-[260px_1fr] h-full">
        {/* ================= LEFT — FILE TREE ================= */}
        <aside className="border-r border-[#e2e6ea] bg-[#fafafa]">
          <ScrollArea className="h-full px-2 py-2">
            {tree.map(node => (
              <TreeNode
                key={node.path}
                node={node}
                expanded={expanded}
                toggle={toggle}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
          </ScrollArea>
        </aside>

        {/* ================= RIGHT — PREVIEW ================= */}
        <section className="flex flex-col bg-[#f8f9fb]">
          {/* File header */}
          <div
            className="
              px-3 py-2
              border-b border-[#dde2e7]
              bg-[#fafafa]
              text-[11px]
              text-slate-600
              truncate
            "
          >
            {selected ? selected.name : "No file selected"}
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-3">
            {!preview && (
              <p className="text-xs text-slate-500">
                Select a file from the left panel to preview its contents
              </p>
            )}

            {preview && <Preview file={preview} />}
          </ScrollArea>
        </section>
      </div>
    </Card>
  )
}
/* =======================
   TREE NODE
======================= */

function TreeNode({
  node,
  expanded,
  toggle,
  onSelect,
  selected,
  level = 0,
}) {
  const isDir = node.type === "dir"
  const open = expanded[node.path]
  const isSelected = selected?.path === node.path

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1.5 rounded px-1.5 py-0.5 cursor-pointer select-none",
          "text-xs",
          "hover:bg-[#eef1f4]",
          isSelected && "bg-[#e7eaee]"
        )}
        style={{ marginLeft: level * 12 }}
        onClick={() => (isDir ? toggle(node.path) : onSelect(node))}
      >
        {isDir ? (
          open ? (
            <ChevronDown size={12} className="text-slate-500" />
          ) : (
            <ChevronRight size={12} className="text-slate-500" />
          )
        ) : (
          <span className="w-[12px]" />
        )}

        <span className="truncate text-slate-800">
          {node.name}
        </span>
      </div>

      {isDir &&
        open &&
        node.children?.map(child => (
          <TreeNode
            key={child.path}
            node={child}
            expanded={expanded}
            toggle={toggle}
            onSelect={onSelect}
            selected={selected}
            level={level + 1}
          />
        ))}
    </div>
  )
}

/* =======================
   PREVIEW
======================= */

function Preview({ file }) {
  const ext = file.path.split(".").pop().toLowerCase()

  if (["html", "htm", "json", "csv"].includes(ext)) {
    return (
      <iframe
        src={file.url}
        title="preview"
        className="
          w-full
          h-[80vh]
          rounded
          border border-[#dde2e7]
          bg-white
        "
      />
    )
  }

  if (["png", "jpg", "jpeg", "svg", "webp"].includes(ext)) {
    return (
      <img
        src={file.url}
        alt=""
        className="
          max-w-full
          max-h-[80vh]
          rounded
          border border-[#dde2e7]
          bg-white
        "
      />
    )
  }

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <FileText size={14} />
      Preview not available for this file type
    </div>
  )
}