import { Lock } from 'lucide-react';

interface Props {
  isLogin: boolean;
}

const LoginHeader = ({ isLogin }: Props) => (
  <div className="text-center">
    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple70 to-purple60">
      <Lock className="h-8 w-8 text-white" />
    </div>
    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
      {isLogin ? 'Welcome Back!' : 'Create Account'}
    </h2>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
      {isLogin ? 'Sign in to access your dashboard' : 'Join us to get started'}
    </p>
  </div>
);

export default LoginHeader;
