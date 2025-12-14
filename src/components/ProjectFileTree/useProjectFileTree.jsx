import { useEffect, useState } from "react"


export function useProjectFileTree(project) {
  const [tree, setTree] = useState(() =>
    buildVirtualTree(project)
  )

  useEffect(() => {
    if (!project) return

    const handler = ({ event, path }) => {
      setTree(prev => applyFsEvent(prev, event, path))
    }

    window.projectFs.onChange(handler)

    return () => {
      // ipcRenderer.removeListener handled internally
    }
  }, [project])

  return tree
}