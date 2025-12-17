import { Outlet, useLoaderData, useNavigate } from "react-router";
import SpeakerSidebar from "../components/sidebar/SpeakerSidebar";
import UserSidebar from "../components/sidebar/UserSidebar";
import SpeakerTopbar from "../components/topbar/SpeakerTopbar";
import UserTopbar from "../components/topbar/UserTopbar";
import { useEffect } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"





export default function AppLayout() {
  const user = useLoaderData(); // injected by router
  const navigate = useNavigate();
  
  const Topbar = UserTopbar;

  useEffect(()=>{
    console.log("user",user);
  });
  

  return (
    <div className="app-layout">
        
      

 <Menubar className="border-none shadow-none">
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem onClick={() => navigate("/newproject")}>New Project</MenubarItem>
      {/* <MenubarItem onClick={async ()=>{await window.projectApi.open();navigate("/project")}}>Open Project</MenubarItem> */}
      <MenubarItem onClick={() => navigate("/")}>Close Project</MenubarItem>
      <MenubarItem onClick={() => navigate("/start")}>Quit Twine</MenubarItem>
    </MenubarContent>
  </MenubarMenu>

  <MenubarMenu>
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarItem  onClick={() => navigate("/")}>Workspace</MenubarItem>
    </MenubarContent>
  </MenubarMenu>

  <MenubarMenu>
    <MenubarTrigger>Help</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>About</MenubarItem>
      <MenubarItem>Licensing Information</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
      <div className="app-body">
        
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}