import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleLogin } from '../controllers/authController';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setError('');

    await handleLogin({
      usuario,
      senha,
      onSuccess: () => navigate('/dashboard', { replace: true }),
      onError: setError,
    });
  }

  return (
    <div className="page-shell">
      <header className="page-header">
        <span className="lock-icon">🔒</span>
        <h1>Área Administrativa</h1>
      </header>
      <main className="login-container">
        <div className="login-card">
          <h2>RapidoJá</h2>
          <p className="subtitle">Acesso Administrativo</p>
          <form onSubmit={onSubmit} className="login-form">
            <label>
              Usuário
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Digite seu usuário"
                required
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </label>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-button">
              Entrar
            </button>
          </form>
          <footer className="login-footer">
            © 2024 RapidoJá. Todos os direitos reservados.
          </footer>
        </div>
      </main>
    </div>
  );
}
