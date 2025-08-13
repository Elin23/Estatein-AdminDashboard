// src/components/sidebar/SidebarLink.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface SidebarLinkProps {
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: boolean;
  unreadCount?: number;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  icon: Icon,
  label,
  path,
  isActive,
  unreadCount = 0,
}) => {
  const showCount = unreadCount > 0;

  return (
    <Link
      to={path}
      className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        isActive ? 'bg-blue-50 dark:bg-gray-800 text-gray15 border-r-4 border-purple70' : ''
      }`}
      aria-label={showCount ? `${label}, ${unreadCount} unread` : label}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="font-medium">{label}</span>

      {showCount && (
        <span className="ml-2 inline-flex min-w-[18px] h-[18px] px-1 items-center justify-center rounded-full bg-red-500 text-white text-[11px] leading-none font-semibold">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default SidebarLink;
