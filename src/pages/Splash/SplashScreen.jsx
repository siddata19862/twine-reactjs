import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import logo from "/logoNew.png"
//import { useNavigate } from "react-router-dom"


const Styles = {

  splash: {
    height: "100vh",
    background: "#2a9969",
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

  loader: {
    width: "240px",
    height: "6px",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  loaderBar: {
    height: "100%",
    background: "linear-gradient(90deg, #56d39dff, #2bbb7dff)",
    transition: "width 0.2s ease",
  },

  percent: {
    fontSize: "0.9rem",
    opacity: 0.8,
  },
}

export default function SplashScreen() {
  const navigate = useNavigate()

  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  // Fake loader logic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 8
      })
    }, 120)

    return () => clearInterval(interval)
  }, [])

  // Fade + navigate
  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => setFadeOut(true), 400)
      setTimeout(() => {
        navigate("/start", { replace: true })
      }, 1000)
    }
  }, [progress, navigate])

  return (
    <div
      style={{
        ...Styles.splash,
        ...(fadeOut ? Styles.fadeOut : {}),
      }}
    >
      
      <img src={logo} style={{height:150}} />
      

      <div style={Styles.loader}>
        <div
          style={{
            ...Styles.loaderBar,
            width: `${Math.min(progress, 100)}%`,
          }}
        />
      </div>

      <div style={Styles.percent}>
        {Math.floor(progress)}%
      </div>
    </div>
  )
}