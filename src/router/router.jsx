import { createBrowserRouter, Outlet, redirect } from "react-router";
import Login from "../components/login/Login";
import { SpeakerDashboard } from "../pages/dashboard/SpeakerDashboard";
import AuthLayout from "../layouts/AuthLayout";
import AppLayout from "../layouts/AppLayout";
import UserDashboard from "../pages/dashboard/user/UserDashboard";
import SpeakerProfile from "../pages/speaker/SpeakerProfile";
import ProfileEdit from "../pages/user/ProfileEdit";
import Participants from "../pages/participant/Participants";
import ScholarSearch from "../components/scholar/ScholarSearch";
import MyBookShelf from "../components/bookshelf/MyBookShelf";
import Inbox from "../components/inbox/Inbox";
import InboxLayout from "../layouts/InboxLayout";
import NotFound from "../components/404/NotFound";
import PostsPage from "../components/posts/PostsPage";
import PostDetail from "../components/posts/PostDetail";
import HandshakesComponent from "../components/handshakes/HandshakesComponent";
import NewPostPage from "../components/posts/NewPostPage";
import ParticipantProfile from "../pages/participant/ParticipantProfile";
import FileManager from "../components/FileManager/FileManager";

import Start from "../components/StartScreen/Start";
import NewProject from "../components/NewProject/NewProject";
import ProjectPage from "../components/ProjectPage/ProjectPage";
import SplashScreen from "../pages/Splash/SplashScreen";
import ResultsPage from "../components/ProjectPage/ResultPage/ResultsPage";


export const router = createBrowserRouter
  ([
    {
      element: <InboxLayout />,
      loader: () => {
        let user = localStorage.getItem("user");
        //if (!user) return redirect("/login");
        return JSON.parse(user);
      },
      children: [
        {
          element: <Inbox />,
          
          path: "/inbox"
        }
      ]

    },
    {
      element: <AuthLayout />,
      children: [
        {
          element: <Login />,
          path: "/login"
        }
      ]
    },
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

        { path: "/admin", element: <div>Admin Dashboard</div> },
        { path: "/about", element: <div>About</div> },

        { path: "/user", element: <UserDashboard /> },
        { path: "/speaker", element: <UserDashboard /> },
        { path: "/gatc/participants", element: <Participants /> },
        { path: "/scholar", element: <ScholarSearch /> },
        { path: "/my-bookshelf", element: <MyBookShelf /> },
        { path: "/user/profile/edit", element:  <ProfileEdit /> },
        { path: "/gatc/speakers", element: <SpeakerDashboard /> },

        { path: "/filemanager2", element: <FileManager /> },
        { path: "/project", element: <ProjectPage /> },
        { path: "/results", element: <ResultsPage /> },
        { path: "/newproject", element: <NewProject /> },
        { path: "/start", element: <Start /> },
        { path: "/posts/:id", element: <PostDetail /> },

        { path: "/post-new", element: <NewPostPage /> },

        { path: "/handshakes", element: <HandshakesComponent /> },
        

        
        {
          path: "/speakers/:id",
          loader: ({ params }) => {
            const id = Number(params.id);
            if (!id) {
              throw new Response("Invalid Speaker ID", { status: 400 });
            }
            return null;
          },
          
          element: <SpeakerProfile />
        },
        {
          path: "/participants/:id",
          loader: ({ params }) => {
            const id = Number(params.id);
            if (!id) {
              throw new Response("Invalid participant ID", { status: 400 });
            }
            return null;
          },
          
          element: <ParticipantProfile />
        },

        { path: "/help", element: <div>Help</div> },
        { path: "*", element: <NotFound /> },
      ]
    }

  ]);