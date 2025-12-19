import { Outlet, useLoaderData } from "react-router";
import SpeakerSidebar from "../components/sidebar/SpeakerSidebar";
import UserSidebar from "../components/sidebar/UserSidebar";
import SpeakerTopbar from "../components/topbar/SpeakerTopbar";
import UserTopbar from "../components/topbar/UserTopbar";
import { useEffect } from "react";

import './AppLayout.css';

export default function InboxLayout() {
  const user = useLoaderData(); // injected by router

  
  const Topbar = {
    speaker: SpeakerTopbar,
    user: UserTopbar
  }[user.type];

  useEffect(()=>{
    console.log("user",user);
  });
  

  return (
    <div className="app-layout">
        
      <Topbar />
      
      <div className="app-body">
        
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}