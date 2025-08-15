import React, { useEffect, useRef, useState } from "react"
import {
  StepForward,
  Building2,
  MapPin,
  LayoutDashboard,
  Grid,
  FormInput,
  InboxIcon,
  MessageSquare,
  LogOut,
  Aperture,
  User,
  Menu,
  PersonStanding,
  CircleQuestionMarkIcon,
  Info,
} from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import SidebarLink from "./SidebarLink"
import Switch from "../UI/Switch"
import { logout } from "../../redux/slices/authSlice"
import { getAuth, signOut } from "firebase/auth"
import { db } from "../../firebaseConfig"
import { ref, onValue, query, limitToLast } from "firebase/database"
import type { RootState } from "../../redux/store"
import { useSidebar } from "../../contexts/SidebarContext"
import { useAppDispatch, useAppSelector } from "../../hooks/useAppSelector"

const LAST_SEEN_KEY = "notif:lastSeenAt"
const SEEN_IDS_KEY = "notif:seenIds"
const SYNC_EVENT = "notif:sync"

function loadSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_IDS_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
    visible: ["sales", "support", "admin"],
  },
  {
    icon: Building2,
    label: "Properties",
    path: "/properties",
    visible: ["sales", "support", "admin"],
  },
  {
    icon: Grid,
    label: "Achievements",
    path: "/achievements",
    visible: ["support", "admin"],
  },
  {
    icon: FormInput,
    label: "Our Team",
    path: "/team",
    visible: ["support", "admin"],
  },
  {
    icon: MapPin,
    label: "Testimonials",
    path: "/testimonials",
    visible: ["support", "admin"],
  },
  {
    icon: InboxIcon,
    label: "Submissions",
    path: "/submissions",
    visible: ["sales", "support", "admin"],
  },
  {
    icon: StepForward,
    label: "Steps",
    path: "/steps",
    visible: ["support", "admin"],
  },
  {
    icon: Aperture,
    label: "Our Values",
    path: "/values",
    visible: ["support", "admin"],
  },
  {
    icon: PersonStanding,
    label: "Valued Clients",
    path: "/clients",
    visible: ["support", "admin"],
  },
  {
    icon: MessageSquare,
    label: "Contact",
    path: "/contact",
    visible: ["support", "admin"],
  },
  {
    icon: Info,
    label: "Company Info",
    path: "/info",
    visible: ["support", "admin"],
  },
  {
    icon: User,
    label: "User Management",
    path: "/user-management",
    visible: ["admin"],
  },
  {
    icon: CircleQuestionMarkIcon,
    label: "FAQs",
    path: "/faqs",
    visible: ["admin"],
  },
]

const Sidebar: React.FC = () => {
  const userRole = useAppSelector((state: RootState) => state.auth.role) || ""

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const auth = getAuth()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const [unreadCount, setUnreadCount] = useState(0)
  const [seenIds, setSeenIds] = useState<Set<string>>(() => loadSeenIds())
  const lastSeenRef = useRef<number>(
    Number(localStorage.getItem(LAST_SEEN_KEY) || 0)
  )

  useEffect(() => {
    const notifRef = query(ref(db, "notifications"), limitToLast(200))
    const off = onValue(
      notifRef,
      (snap) => {
        const data = snap.val() || {}
        let count = 0
        for (const [id, v] of Object.entries<any>(data)) {
          const ts = typeof v?.createdAt === "number" ? v.createdAt : 0
          const isUnread =
            ts > lastSeenRef.current && !seenIds.has(id as string)
          if (isUnread) count++
        }
        setUnreadCount(count)
      },
      () => setUnreadCount(0)
    )
    return () => off()
  }, [seenIds])

  useEffect(() => {
    const handler = () => {
      setSeenIds(loadSeenIds())
      lastSeenRef.current = Number(localStorage.getItem(LAST_SEEN_KEY) || 0)
    }
    window.addEventListener(SYNC_EVENT, handler)
    return () => window.removeEventListener(SYNC_EVENT, handler)
  }, [])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SEEN_IDS_KEY || e.key === LAST_SEEN_KEY) {
        setSeenIds(loadSeenIds())
        lastSeenRef.current = Number(localStorage.getItem(LAST_SEEN_KEY) || 0)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      dispatch(logout())
      navigate("/login")
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 h-screen fixed left-0 top-0 shadow-lg flex flex-col transition-all duration-300 z-50
        ${isCollapsed ? "w-16" : "w-64"}
      `}
    >
      <div className="p-4 gap-4 flex flex-col md:flex-row items-start md:items-center justify-between">
        <button className="rounded md:hidden" onClick={toggleSidebar}>
          <Menu className="w-5 h-5 dark:text-gray-200 text-gray-800" />
        </button>

        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img
              src="/assets/imgs/logo.svg"
              alt="Estatein Logo"
              className="size-8"
            />
            <h1 className="text-gray-800 dark:text-gray-200 font-bold">
              Estatein
            </h1>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Switch />
        </div>
      </div>

      <nav className="flex-1 mt-2 overflow-y-auto">
        {menuItems.map((item) =>
          item.visible.includes(userRole) ? (
            <SidebarLink
              key={item.path}
              {...item}
              isActive={location.pathname === item.path}
              unreadCount={item.path === "/" ? unreadCount : 0}
              isCollapsed={isCollapsed}
            />
          ) : null
        )}
      </nav>

      <div className="p-2">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded
            text-[clamp(0.8rem,1vw,0.9rem)]"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )
}

export default Sidebar
