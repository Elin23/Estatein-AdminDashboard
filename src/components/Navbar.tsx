import { NavLink } from "react-router-dom"

const tabs = [
  { name: "Properties", path: "/create/properties" },
  { name: "Services", path: "/create/services" },
  { name: "Testimonials", path: "/create/testimonials" },
  { name: "FAQs", path: "/create/faqs" },
  { name: "Achievements", path: "/create/achievements" },
  { name: "Team", path: "/create/team" },
  { name: "Clients", path: "/create/clients" },
  { name: "Contact", path: "/create/contact" },
  { name: "Locations", path: "/create/locations" },
  { name: "Site Settings", path: "/create/site_settings" },
]

const Navbar = () => {
  return (
    <nav className="bg-[#1A1A1A]  py-6 flex space-x-4 justify-center ">
      {tabs.map((tab) => {
        return (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded text-white font-medium transition-all duration-200 ${
                isActive ? "bg-[#703BF7]" : "hover:bg-[#2A2A2A]"
              }`
            }
          >
            {tab.name}
          </NavLink>
        )
      })}
    </nav>
  )
}

export default Navbar
