import { Mail, Key, LogIn, UserPlus } from 'lucide-react';

interface Props {
  isLogin: boolean;
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginForm = ({
  isLogin,
  email,
  password,
  setEmail,
  setPassword,
  handleSubmit,
}: Props) => (
  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
    <div className="space-y-4">
      {/* Email */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email address"
          className="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple65 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Key className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="appearance-none block w-full pl-11 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple65 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
    </div>
    <button
      type="submit"
      className="group relative w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-purple70 to-purple60 hover:scale-[1.02] transition"
    >
      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
        {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
      </span>
      {isLogin ? 'Sign in' : 'Create Account'}
    </button>
  </form>
);

export default LoginForm;
