// src/components/sidebar/Sidebar.tsx
import React, { useEffect, useRef, useState } from 'react';
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
  Link as LinkIcon,
  User
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarLink from './SidebarLink';
import Switch from '../UI/Switch';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { getAuth, signOut } from 'firebase/auth';
import { db } from '../../firebaseConfig';
import { ref, onValue, query, limitToLast } from 'firebase/database';

const LAST_SEEN_KEY = 'notif:lastSeenAt';
const SEEN_IDS_KEY = 'notif:seenIds';
const SYNC_EVENT = 'notif:sync';

function loadSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_IDS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Building2, label: 'Properties', path: '/properties' },
  { icon: MapPin, label: 'Locations', path: '/locations' },
  { icon: Grid, label: 'Achievements', path: '/achievements' },
  { icon: FormInput, label: 'Our Team', path: '/team' },
  { icon: MapPin, label: 'testimonials', path: '/testimonials' },
  { icon: InboxIcon, label: 'Submissions', path: '/submissions' },
  { icon: StepForward, label: 'Steps', path: '/steps' },
  { icon: Aperture, label: 'Our Values', path: '/values' },
  { icon: MessageSquare, label: 'Contact', path: '/contact' },
  { icon: LinkIcon, label: 'SocialLinks', path: '/social' },
  { icon: User, label: 'User Management', path: '/user-management' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth();

  const [unreadCount, setUnreadCount] = useState(0);
  const [seenIds, setSeenIds] = useState<Set<string>>(() => loadSeenIds());
  const lastSeenRef = useRef<number>(Number(localStorage.getItem(LAST_SEEN_KEY) || 0));

  useEffect(() => {
    const notifRef = query(ref(db, 'notifications'), limitToLast(200));
    const off = onValue(
      notifRef,
      (snap) => {
        const data = snap.val() || {};
        let count = 0;
        for (const [id, v] of Object.entries<any>(data)) {
          const ts = typeof v?.createdAt === 'number' ? v.createdAt : 0;
          const isUnread = ts > lastSeenRef.current && !seenIds.has(id as string);
          if (isUnread) count++;
        }
        setUnreadCount(count);
      },
      () => setUnreadCount(0)
    );
    return () => off();
  }, [seenIds]);

  useEffect(() => {
    const handler = () => {
      setSeenIds(loadSeenIds());
      lastSeenRef.current = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
    };
    window.addEventListener(SYNC_EVENT, handler);
    return () => window.removeEventListener(SYNC_EVENT, handler);
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SEEN_IDS_KEY || e.key === LAST_SEEN_KEY) {
        setSeenIds(loadSeenIds());
        lastSeenRef.current = Number(localStorage.getItem(LAST_SEEN_KEY) || 0);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 h-screen w-64 fixed left-0 top-0 shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <img
            src="/assets/imgs/logo.svg"
            alt="Estatein Logo"
            className="w-8 h-8"
          />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Estatein
          </h1>
        </div>
        <Switch />
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.path}
            {...item}
            isActive={location.pathname === item.path}
            unreadCount={item.path === '/' ? unreadCount : 0}
          />
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
