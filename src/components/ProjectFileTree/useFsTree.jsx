import { useEffect, useState } from "react"
import { applyFsEvent } from "./treePatch"

export function useFsTree() {
  const [tree, setTree] = useState([])
  const [root, setRoot] = useState(null)

  useEffect(() => {
    window.fsApi.onSnapshot(({ root, tree }) => {
        console.log(root,tree);
      setRoot(root)
      setTree(tree)
    })

    window.fsApi.onEvent(({ event, path }) => {
      setTree(prev => applyFsEvent(prev, event, path))
    })
  }, [])

  return { root, tree }
}