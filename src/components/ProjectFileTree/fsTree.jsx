import fs from "fs"
import path from "path"

export function buildFsTree(rootDir) {
  const walk = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    return entries.map((entry) => {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        return {
          type: "folder",
          name: entry.name,
          path: fullPath,
          children: walk(fullPath),
        }
      }

      return {
        type: "file",
        name: entry.name,
        path: fullPath,
      }
    })
  }

  return walk(rootDir)
}