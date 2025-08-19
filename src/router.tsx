import { createBrowserRouter } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Submissions from './pages/Submissions';
import MainLayout from './layout/MainLayout';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Steps from "./pages/Steps";
import Testimonials from "./pages/Testimonials";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ValuedClients from "./pages/ValuedClients";
import CompanyInfo from "./pages/CompanyInfo/CompanyInfo";
import FAQ from "./pages/FAQ";
import AchievementsAndValues from "./pages/AchievementsAndValues/AchievementsAndValues";

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
        element: <ProtectedRoute allowedRoles={["sales", "admin"]} />,
        children: [
          { path: "properties", element: <Properties /> },
          { path: "submissions", element: <Submissions /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["support", "admin"]} />,
        children: [
          { path: "contact", element: <Contact /> },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          { path: "achievementsAndValues", element: <AchievementsAndValues /> },
          { path: "testimonials", element: <Testimonials /> },
          { path: "team", element: <Team /> },
          { path: "steps", element: <Steps /> },
          { path: "clients", element: <ValuedClients /> },
          { path: "info", element: <CompanyInfo /> },
          {path: "faqs" , element:<FAQ />},
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