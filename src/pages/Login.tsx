import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import LoginContainer from '../components/auth/LoginContainer';
import LoginHeader from '../components/auth/LoginHeader';
import LoginForm from '../components/auth/LoginForm';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

   
  };

  return (
    <LoginContainer>
      <LoginHeader isLogin={true} />
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
