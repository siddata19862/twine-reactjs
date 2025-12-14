export default function LineGraph({ data, height = 40, color }) {
  if (!data.length) return null

  const max = 100
  const stepX = 100 / (data.length - 1)

  const points = data
    .map((v, i) => {
      const x = i * stepX
      const y = height - (v / max) * height
      return `${x},${y}`
    })
    .join(" ")

  return (
    <svg
      viewBox={`0 0 100 ${height}`}
      className="w-28 h-10 overflow-visible"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}