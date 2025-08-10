import { Mail, Key } from 'lucide-react';
import InputField from './InputField';

interface Props {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginForm = ({ email, password, setEmail, setPassword, handleSubmit }: Props) => (
  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
    <div className="space-y-4">
      <InputField
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Email address"
        Icon={Mail}
        required
      />

      <InputField
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Password"
        Icon={Key}
        required
      />
    </div>
    <button
      type="submit"
      className="group relative w-full flex justify-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-purple70 to-purple60 hover:scale-[1.02] transition"
    >
      Login
    </button>
  </form>
);

export default LoginForm;
