import { createBrowserRouter, Outlet, redirect } from "react-router";
import AppLayout from "../layouts/AppLayout";
import NotFound from "../components/404/NotFound";
import FileManager from "../components/FileManager/FileManager";

import Start from "../components/StartScreen/Start";
import NewProject from "../components/NewProject/NewProject";
import ProjectPage from "../components/ProjectPage/ProjectPage";
import SplashScreen from "../pages/Splash/SplashScreen";
import ResultsPage from "../components/ProjectPage/ResultPage/ResultsPage";
import StartUbuntu from "../components/StartScreen/StartUbuntu";


export const router = createBrowserRouter
  ([
    
    
    {
      element: (<AppLayout />),
      loader: () => {
        let user = localStorage.getItem("user");
        //if (!user) return redirect("/login");
        return JSON.parse(user);
      },
      children: [
        
        {
          path: "/",
          element: <SplashScreen />,
          loader: () => {
            
          }
        },

        
        
        
        { path: "/filemanager2", element: <FileManager /> },
        { path: "/project", element: <ProjectPage /> },
        { path: "/results", element: <ResultsPage /> },
        { path: "/newproject", element: <NewProject /> },
        { path: "/start", element: <StartUbuntus /> },
        

        
        
        

        
        { path: "*", element: <NotFound /> },
      ]
    }

  ]);