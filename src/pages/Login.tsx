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
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <LoginContainer>
      <LoginHeader isLogin={isLogin} />
      <LoginForm
        isLogin={isLogin}
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </LoginContainer>
  );
};

export default Login;
