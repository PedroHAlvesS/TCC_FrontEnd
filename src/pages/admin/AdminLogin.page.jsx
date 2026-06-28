import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../../controllers/authController';
import LoginComponent from '../../components/Login.component';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setError('');

    await handleLogin({
      email,
      password,
      onSuccess: () => navigate('/admin-dashboard', { replace: true }),
      onError: setError,
    });
  }

  return <LoginComponent
        title="Acesso Administrativo"
        email={email}
        password={password}
        error={error}
        onEmailChange={(event) => setEmail(event.target.value)}
        onPasswordChange={(event) => setPassword(event.target.value)}
        onSubmit={onSubmit}
        showRegisterLink={false}
      />
}
