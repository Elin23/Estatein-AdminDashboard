import { createBrowserRouter } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Locations from './pages/Locations';
import Submissions from './pages/Submissions';
import MainLayout from './layout/MainLayout';
import Achievements from './pages/Achievements';
import Team from './pages/Team';
import Values from './pages/Values';
import Contact from './pages/Contact';
import Steps from "./pages/Steps";
import Testimonials from "./pages/Testimonials";
import SocialLinks from "./pages/SocialLinks";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      {
        element: <ProtectedRoute allowedRoles={["sales", "support", "admin"]} />,
        children: [
          { path: "properties", element: <Properties /> },     
          { path: "submissions", element: <Submissions /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["support", "admin"]} />,
        children: [
          { path: "locations", element: <Locations /> },
          { path: "achievements", element: <Achievements /> },
          { path: "contact", element: <Contact /> },
          { path: "testimonials", element: <Testimonials /> },
          { path: "team", element: <Team /> },
          { path: "values", element: <Values /> },
          { path: "social", element: <SocialLinks /> },
          { path: "steps", element: <Steps /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "user-management", element: <UserManagement /> },
        ],
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
    ]
  }
]
);

export default router;