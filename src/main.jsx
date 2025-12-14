import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'remixicon/fonts/remixicon.css'
//import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, redirect, RouterProvider } from 'react-router'
import { Outlet } from 'react-router'
import { SpeakerDashboard } from './pages/dashboard/SpeakerDashboard.jsx'
import Login from './components/login/Login.jsx'
import { router } from './router/router.jsx'
import App from './App.jsx'




//localStorage.setItem("user", JSON.stringify({ id: 1, name: "John Doe", type: "user" }));
//localStorage.removeItem("user");

createRoot(document.getElementById('root')).render(
  <App></App>,
)
