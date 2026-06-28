import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginComponent from '../../components/Login.component';
import { handleLogin } from '../../controllers/authController';

export default function CustomerLoginPage() {
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
      onSuccess: () => navigate('/cliente-dashboard', { replace: true }),
      onError: setError,
    });
  }

  return (
    <LoginComponent
      title="Acesso do Cliente"
      email={email}
      password={password}
      error={error}
      onEmailChange={(event) => setEmail(event.target.value)}
      onPasswordChange={(event) => setPassword(event.target.value)}
      onSubmit={onSubmit}
      showRegisterLink={true}
      registerButtonText="Crie sua conta"
      onRegisterClick={() => navigate('/cliente/create')}
    />
  );
}
