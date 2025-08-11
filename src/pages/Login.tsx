import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginContainer from '../components/auth/LoginContainer';
import LoginHeader from '../components/auth/LoginHeader';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const [isLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
        navigate('/');
      } else {
        setError('Registration is invitation-only.');
      }
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setError('User not found');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else {
        setError('Failed to login');
      }
    }
  };

  return (
    <LoginContainer>
      <LoginHeader isLogin={isLogin} />
      <LoginForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
      {error && (
        <div className="mt-4 text-red-600 text-center bg-red-100 p-2 rounded">
          {error}
        </div>
      )}
    </LoginContainer>
  );
};

export default Login;
