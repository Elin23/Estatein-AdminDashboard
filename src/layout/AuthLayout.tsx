import React from 'react';
import { Building2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F0FE] dark:bg-[#141414] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-[#FBFAFF] dark:bg-[#1A1A1A] rounded-2xl shadow-2xl p-8 space-y-8 transform transition-all duration-300">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-[#8254F8] to-[#A685FA] transform transition-transform duration-300 hover:scale-110">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-[#141414] dark:text-white">
              Welcome Back!
            </h2>
            <p className="mt-2 text-sm text-[#666666] dark:text-[#999999]">
              Sign in to access your dashboard
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
