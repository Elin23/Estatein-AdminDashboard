import Sidebar from "../components/sidebar/Sidebar"
import { Navigate, Outlet } from "react-router-dom"
import { useSidebar } from "../contexts/SidebarContext"
import { useAppSelector } from "../hooks/useAppSelector";

function MainLayout() {
  const { isLoggedIn } = useAppSelector(state => state.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />; 
  }
  
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
