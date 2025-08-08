import React, { useState } from 'react';
import { Mail, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import InputField from './InputField';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputField
        icon={Mail}
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="Email address"
        required
      />

      <InputField
        icon={Key}
        type="password"
        value={password}
        onChange={setPassword}
        placeholder="Password"
        required
      />

      {error && (
        <div className="text-[#703BF7] text-sm text-center bg-[#EDE7FE] p-3 rounded-lg animate-shake">
          {error}
        </div>
      )}

      <button
        type="submit"
        className="w-full py-3 px-4 text-white text-sm font-medium rounded-lg
                 bg-[#8254F8]
                 hover:bg-[#946CF9]
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#703BF7]
                 transform transition-all duration-150 hover:scale-[1.02]
                 flex items-center justify-center gap-2"
      >
        Sign in
      </button>
    </form>
  );
};

export default LoginForm;
