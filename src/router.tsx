import { createBrowserRouter } from "react-router-dom"
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Locations from './pages/Locations';
import Submissions from './pages/Submissions';
import MainLayout from './layout/MainLayout';
import Achievements from './pages/Achievements';
import Team from './pages/Team';
import Values from './pages/Values';
import Contact  from './pages/Contact';
import Steps from "./pages/Steps"
import Testimonials from "./pages/Testimonials";
import SocialLinks from "./pages/SocialLinks";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      
        <MainLayout />
     
    ),
    children: [
      { path: '', element: <Dashboard /> },
      { path: 'properties', element: <Properties /> },
      { path: 'locations', element: <Locations /> },
      { path: 'achievements', element: <Achievements /> },
      { path: 'submissions', element: <Submissions /> },
      { path: 'contact', element: <Contact /> },
      { path: 'testimonials', element: <Testimonials /> },
      { path: 'team', element: <Team /> },
      { path: 'values', element: <Values /> },
      { path: 'social', element: <SocialLinks /> },
      { path: "steps", element: <Steps /> },
      { path: "user-management", element: <UserManagement /> },

    ],
  },
])

export default router
