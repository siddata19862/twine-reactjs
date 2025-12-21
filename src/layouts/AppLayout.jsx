import { Outlet, useLoaderData, useNavigate } from "react-router";


import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import MenuBar from "../components/menubar/MenuBar";





export default function AppLayout() {
  const user = useLoaderData(); // injected by router
  const navigate = useNavigate();
  
  

  return (
    <div className="app-layout">
        
      

      
      <div className="app-body">
        
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}