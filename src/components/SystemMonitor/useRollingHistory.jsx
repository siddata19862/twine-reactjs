import { useRef, useState } from "react"

const MAX_POINTS = 1000

export function useRollingHistory() {
  const cpuRef = useRef([])
  const ramRef = useRef([])
  const [, force] = useState(0)

  const push = (cpu, ram) => {
    cpuRef.current.push(cpu)
    ramRef.current.push(ram)

    if (cpuRef.current.length > MAX_POINTS) {
      cpuRef.current.shift()
      ramRef.current.shift()
    }

    // trigger redraw
    force((n) => n + 1)
  }

  return {
    cpu: cpuRef.current,
    ram: ramRef.current,
    push,
  }
}