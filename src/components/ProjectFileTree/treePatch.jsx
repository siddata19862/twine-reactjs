export function applyFsEvent(tree, event, relPath) {
  const parts = relPath.split(/[\\/]/)

  const mutate = (nodes, depth = 0) => {
    const name = parts[depth]
    if (!name) return nodes

    const existing = nodes.find(n => n.name === name)

    if (!existing && (event === "add" || event === "addDir")) {
      nodes.push({
        type: event === "addDir" ? "folder" : "file",
        name,
        path: parts.slice(0, depth + 1).join("/"),
        children: event === "addDir" ? [] : undefined,
      })
      return [...nodes]
    }

    if (existing && (event === "unlink" || event === "unlinkDir")) {
      return nodes.filter(n => n !== existing)
    }

    if (existing?.children) {
      existing.children = mutate(existing.children, depth + 1)
    }

    return [...nodes]
  }

  return mutate([...tree])
}