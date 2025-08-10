import React from 'react';
import { Building2, MapPin, LayoutDashboard, Grid, FormInput, InboxIcon, MessageSquare, LogOut, Aperture, Link } from 'lucide-react';
import {  useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SidebarLink from './SidebarLink';


const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Building2, label: 'Properties', path: '/properties' },
  { icon: MapPin, label: 'Locations', path: '/locations' },
  { icon: Grid, label: 'Achievements', path: '/achievements' },
  { icon: FormInput, label: 'Our Team', path: '/team' },
  { icon: MapPin, label: 'Testimonials', path: '/testimonials' },
  { icon: InboxIcon, label: 'Submissions', path: '/submissions' },
  { icon: Aperture, label: 'Our Values', path: '/values' },
  { icon: MessageSquare, label: 'Contact', path: '/contact' },
  { icon: Link , label: 'SocialLinks', path: '/social' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
const handleLogout = async () => {
  try {
    await logout();
    navigate('/login');
  } catch (error) {
    console.error('Failed to logout:', error);
  }
};

  return (
    <div className="bg-white dark:bg-gray-800 h-screen w-64 fixed left-0 top-0 shadow-lg">
      <div className="p-6 flex items-center gap-1.5">
        <img src="/assets/imgs/logo.svg" alt="" className='w-8 h-8' />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Estatein</h1>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.path}
            {...item}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;