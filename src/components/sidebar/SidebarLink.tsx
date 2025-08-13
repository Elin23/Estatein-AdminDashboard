import React from "react"
import { Link } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

interface SidebarLinkProps {
  icon: LucideIcon
  label: string
  path: string
  isActive: boolean
  isCollapsed?: boolean
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon: Icon,
  label,
  path,
  isActive,
  isCollapsed,
}) => {
  return (
    <Link
      to={path}
      className={`flex items-center ${
        !isCollapsed ? " justify-start " : "justify-center"
      } md:justify-start px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
        text-[clamp(0.8rem,1vw,0.9rem)]
        ${
          isActive
            ? "bg-blue-50 dark:bg-gray-800 text-gray15 border-r-4 border-purple70"
            : ""
        }
      `}
    >
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      {!isCollapsed && <span className="font-medium">{label}</span>}
    </Link>
  )
}

export default SidebarLink
