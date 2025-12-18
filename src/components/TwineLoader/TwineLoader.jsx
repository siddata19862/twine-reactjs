import { useEffect, useState } from "react"
import { useNavigate } from "react-router"

const Styles = {
  splash: {
    height: "100vh",
    background: "#0f172a",
    color: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "24px",
    opacity: 1,
    transition: "opacity 0.6s ease",
  },

  fadeOut: {
    opacity: 0,
  },

  logo: {
    fontSize: "3rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
  },

  subtitle: {
    fontSize: "0.95rem",
    opacity: 0.85,
    textAlign: "center",
    minHeight: "1.2em",
    transition: "opacity 0.4s ease",
  },

  subtitleFade: {
    opacity: 0,
  },

  loader: {
    width: "240px",
    height: "6px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  loaderBar: {
    height: "100%",
    background: "linear-gradient(90deg, #38bdf8, #6366f1)",
    transition: "width 0.15s linear",
  },

  percent: {
    fontSize: "0.9rem",
    opacity: 0.8,
  },
}

export default function TwineLoader({
  title = "Twine",
  steps = [],
  duration = 2500,
  navigateTo,
  onComplete,
}) {
  const navigate = useNavigate()

  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  const [stepIndex, setStepIndex] = useState(0)
  const [stepFade, setStepFade] = useState(false)

  // Progress logic
  useEffect(() => {
    const start = Date.now()
    const timer = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / duration) * 100, 100)
      setProgress(pct)
      if (pct >= 100) clearInterval(timer)
    }, 50)

    return () => clearInterval(timer)
  }, [duration])

  // Rotate subtitles
  useEffect(() => {
  if (!steps.length) return

  let cancelled = false
  let timeout

  const base = Math.max(duration / steps.length, 600)

  const rotate = () => {
    if (cancelled) return

    setStepFade(true)

    setTimeout(() => {
      if (cancelled) return

      setStepIndex((i) => (i + 1) % steps.length)
      setStepFade(false)

      // 👇 subtle human-like jitter
      const jitter = Math.random() * 300 - 150 // -150ms to +150ms
      timeout = setTimeout(rotate, base + jitter)
    }, 200) // fade duration
  }

  timeout = setTimeout(rotate, base)

  return () => {
    cancelled = true
    clearTimeout(timeout)
  }
}, [steps, duration])

  // Finish
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setFadeOut(true), 300)

      setTimeout(() => {
        onComplete?.()
        if (navigateTo) navigate(navigateTo, { replace: true })
      }, 900)
    }
  }, [progress, navigateTo, navigate, onComplete])

  return (
    <div
      style={{
        ...Styles.splash,
        ...(fadeOut ? Styles.fadeOut : {}),
      }}
    >
      <div style={Styles.logo}>{title}</div>

      {steps.length > 0 && (
        <div
          style={{
            ...Styles.subtitle,
            ...(stepFade ? Styles.subtitleFade : {}),
          }}
        >
          {steps[stepIndex]}
        </div>
      )}

      <div style={Styles.loader}>
        <div
          style={{
            ...Styles.loaderBar,
            width: `${Math.floor(progress)}%`,
          }}
        />
      </div>

      <div style={Styles.percent}>{Math.floor(progress)}%</div>
    </div>
  )
}