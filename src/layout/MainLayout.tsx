import Sidebar from "../components/sidebar/Sidebar"
import { Outlet } from "react-router-dom"
import { useSidebar } from "../contexts/SidebarContext"

function MainLayout() {
  const { isCollapsed } = useSidebar()
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
