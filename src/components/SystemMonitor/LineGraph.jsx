export default function LineGraph({
  data,
  color = "#000",
  height = 20,
  strokeWidth = 0.5,
  minY = 0,
  maxY = 100,
}) {
  if (!data || data.length < 2) return null

  const width = 100
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y =
      height -
      ((Math.min(Math.max(v, minY), maxY) - minY) /
        (maxY - minY)) *
        height
    return `${x},${y}`
  })

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-full"
    >
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}