import { StrictMode, useEffect, useState } from 'react'
//import './App.css'
import { router } from './router/router.jsx'

import { Query, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ProjectWatcher from './components/ProjectWatcher/ProjectWatcher.js';



function App() {

   
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
