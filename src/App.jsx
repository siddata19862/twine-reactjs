import { StrictMode, useEffect, useState } from 'react'
//import './App.css'
import { router } from './router/router.jsx'

import { Query, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ProjectWatcher from './components/ProjectWatcher/ProjectWatcher.js';
import { useSystemStore } from './store/useSystemStore.js';



function App() {

   
  const setInfo = useSystemStore(s => s.setInfo)
  const setStats = useSystemStore(s => s.setStats)

  useEffect(() => {
    let cleanup;

    async function initSystem() {
      // 1️One-time static system info
      const info = await window.electron.invoke("system:getInfo")
      console.log("info",info);
      setInfo(info)

      // Start live stats
      await window.electron.invoke("system:startStats")
      //window.electron.send("system:startStats")

      // Listen for stats
      console.log("start");
      cleanup = window.electron.on("system:stats", (stats) => {
        //console.log("..",stats);
        setStats(stats)
      })
    }

    initSystem()

    return () => {
      // clean listener on app shutdown / hot reload
      cleanup?.()
    }
  }, [])

  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>
      <StrictMode>
      <ProjectWatcher />
      <RouterProvider router={router}>
      </RouterProvider>
      
    </StrictMode>
    </QueryClientProvider>
  )
}

export default App
