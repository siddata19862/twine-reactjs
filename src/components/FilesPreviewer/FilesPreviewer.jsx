import { useEffect, useState } from "react"
import { useTwineStore } from "../../store/useTwineStore"
import TreeNode from "../TreeNode/TreeNodeNew"
//import TreeNodeNew from "../TreeNode/TreeNodeNew"



export default function FilesPreviewer({
  title = "Detected FASTQ Files",
  className = "",
}) {
  const twine = useTwineStore(s => s.twine)
  const [tree, setTree] = useState(null)

  useEffect(() => {
    if (twine?.project_structure) {
      setTree(twine.project_structure)
    }
  }, [twine])

  if (!tree) {
    return (
      <div className={`rounded border border-slate-200 bg-white p-4 text-xs text-slate-500 ${className}`}>
        No FASTQ files detected yet
      </div>
    )
  }

  return (
    <div className={`rounded border border-slate-200 bg-white p-4 ${className}`}>
      <h4 className="mb-2 text-xs font-semibold text-slate-700">
        {title}
      </h4>

      <div className="font-mono text-xs">
        <TreeNode
          node={tree}
          onTreeChange={(updatedTree) => {
            console.log("FULL TREE:", updatedTree)
          }}
        />
      </div>
    </div>
  )
}