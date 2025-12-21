import { useState } from "react"

export function FastqDropZone({ onDrop }) {
  const [active, setActive] = useState(false)
  
  const handleClickSelect = async () => {
    
  const folder = await window.api.selectFolder()
  if (!folder) return

  onDrop([folder])
}
  
  return (
    <div
    onClick={handleClickSelect}
      onDragOver={(e) => {
        e.preventDefault()
        e.stopPropagation()
        setActive(true)
      }}
      onDragLeave={() => setActive(false)}
      onDrop={(e) => {
        e.preventDefault()
        e.stopPropagation()

        const files = [...e.dataTransfer.files]
        const pths = window.fileApi.getPaths(files)
console.log("paths", pths)
onDrop(pths)
return;


        setActive(false)
        console.log("e",e);

        const paths = [...e.dataTransfer.files].map(f => f.path)
        console.log("p",paths);
        onDrop(paths)
      }}
      className={`
        rounded-lg border-2 border-dashed
        p-6 text-center text-sm
        transition
        ${active
          ? "border-indigo-400 bg-indigo-50"
          : "border-slate-300 bg-slate-50"}
      `}
    >
      <p className="text-slate-600">
        Drag & drop FASTQ files or folders here
      </p>
      <p className="mt-1 text-xs text-slate-400">
        Files are referenced, not copied
      </p>
    </div>
  )
}