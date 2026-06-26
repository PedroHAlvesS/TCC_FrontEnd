import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../controllers/authController';

export default function ClientLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setError('');

    await handleLogin({
      usuario: email,
      senha: password,
      onSuccess: () => navigate('/admin/blank', { replace: true }),
      onError: setError,
    });
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="lock-icon">🚚</span>
        <h1>RápidoJá</h1>
      </header>
      <main className="login-container">
        <div className="login-card">
          <h2>Acesso do Cliente</h2>
          <p className="subtitle">Entre com seu e-mail e senha</p>
          <form onSubmit={onSubmit} className="login-form">
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoFocus
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </label>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button">
              Entrar
            </button>
          </form>
          <p className="register-link">
            Não tem conta?{' '}
            <button type="button" className="link-button" onClick={() => navigate('/cliente/create')}>
              Crie sua conta
            </button>
          </p>
          <footer className="login-footer">
            © 2024 RapidoJá. Todos os direitos reservados.
          </footer>
        </div>
      </main>
    </div>
  );
}
