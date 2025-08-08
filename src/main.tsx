import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { createHashRouter, RouterProvider } from "react-router-dom"
import Create from "./pages/create/Create.tsx"
import Properties from "./pages/create/Properties.tsx"
import Services from "./pages/create/Services.tsx"
import SiteSettings from "./pages/create/SiteSettings.tsx"
import Testimonials from "./pages/create/Testimonials.tsx"
import Faqs from "./pages/create/Faqs.tsx"
import Achievements from "./pages/create/Achievements.tsx"
import Team from "./pages/create/Team.tsx"
import Contact from "./pages/create/Contact.tsx"
import Locations from "./pages/create/Locations.tsx"
import Clients from "./pages/create/Clients.tsx"

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "create",
        element: <Create />,
        children: [
          {
            path: "properties",
            element: <Properties />,
          },
          {
            path: "services",
            element: <Services />,
          },
          {
            path: "site_settings",
            element: <SiteSettings />,
          },
          {
            path: "testimonials",
            element: <Testimonials />,
          },
          {
            path: "faqs",
            element: <Faqs />,
          },
          {
            path: "achievements",
            element: <Achievements />,
          },
          {
            path: "team",
            element: <Team />,
          },
          {
            path: "contact",
            element: <Contact />,
          },
          {
            path: "locations",
            element: <Locations />,
          },
          {
            path: "clients",
            element: <Clients />,
          },
        ],
      },
    ],
  },
])
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
