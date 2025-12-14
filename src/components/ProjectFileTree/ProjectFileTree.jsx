import { useState } from "react"
import {
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { useProjectFileTree } from "./useProjectFileTree"
import { useFsTree } from "./useFsTree"

export default function ProjectFileTree() {
  const { tree } = useFsTree()

  return (
    <div className="space-y-1 text-sm">
      {tree.map((node) => (
        <TreeNode key={node.path} node={node} level={0} />
      ))}
    </div>
  )
}
/* ---------- tree node ---------- */

function TreeNode({ node, level }) {
  const [open, setOpen] = useState(true)
  const isFolder = node.type === "folder"

  return (
    <div>
      <div
        className="flex items-center gap-1 cursor-default select-none"
        style={{ paddingLeft: level * 14 }}
        onClick={() => isFolder && setOpen(!open)}
      >
        {isFolder ? (
          open ? <ChevronDown size={14} /> : <ChevronRight size={14} />
        ) : (
          <span className="w-[14px]" />
        )}

        {isFolder ? (
          open ? (
            <FolderOpen size={14} className="text-indigo-600" />
          ) : (
            <Folder size={14} className="text-indigo-600" />
          )
        ) : (
          <FileText size={14} className="text-slate-500" />
        )}

        <span className="truncate text-slate-700">
          {node.name}
        </span>
      </div>

      {open && node.children?.map((child) => (
        <TreeNode
          key={child.path}
          node={child}
          level={level + 1}
        />
      ))}
    </div>
  )
}

function buildVirtualTree(project) {
  const root = []

  // project.twine
  root.push({
    type: "file",
    name: "project.twine",
    path: "project.twine",
  })

  // fastq/
  if (project.fastq?.files?.length) {
    root.push({
      type: "folder",
      name: "fastq",
      path: "fastq",
      children: project.fastq.files.map((f) => ({
        type: "file",
        name: f.name,
        path: `fastq/${f.name}`,
      })),
    })
  }

  // placeholders for future pipeline
  root.push(
    {
      type: "folder",
      name: "runs",
      path: "runs",
      children: [],
    },
    {
      type: "folder",
      name: "checkpoints",
      path: "checkpoints",
      children: [],
    }
  )

  return root
}