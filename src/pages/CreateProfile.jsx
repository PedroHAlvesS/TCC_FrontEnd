import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken } from '../services/auth';
import Sidebar from '../components/Sidebar';
import { createAdminProfile } from '../services/CreateAdminProfile';
import { validateProfile } from '../utils/validators';

export default function CreateProfile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  async function handleCreateProfile() {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    const { valid, errors } = validateProfile({ email, phone, password }, { requirePassword: true });
    if (!valid) {
      const first = errors.email || errors.phone || errors.password;
      setErrorMessage(first);
      setSaving(false);
      return;
    }
    try {
      const payload = {
        name: name || null,
        email: email || null,
        password: password || null,
        phoneNumber: phone || null,
      };

      await createAdminProfile(payload);
      setSuccessMessage('Perfil criado com sucesso');
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
    } catch (err) {
      setErrorMessage(err?.message || 'Erro ao criar perfil');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearToken();
    navigate('/admin', { replace: true });
  }

  return (
    <div className="page-shell dashboard-shell">
      <Sidebar activePath="/admin/create" />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-title">Criar Novo Perfil</div>
            <div className="dashboard-subtitle">Preencha os dados abaixo para criar um novo perfil.</div>
          </div>

          <div className="profile-menu-container">
            <button className="profile-button" onClick={handleLogout}>
              <span className="profile-avatar">A</span>
              <div className="profile-info">
                <span>Admin</span>
                <small>Administrador</small>
              </div>
            </button>
          </div>
        </header>

        <section className="edit-profile-card">
          {successMessage && (
            <div className="success-banner">
              <span>{successMessage}</span>
              <button className="banner-close" onClick={() => setSuccessMessage('')}>×</button>
            </div>
          )}
          {errorMessage && (
            <div className="error-banner">
              <span>{errorMessage}</span>
              <button className="banner-close" onClick={() => setErrorMessage('')}>×</button>
            </div>
          )}

          <div className="edit-profile-icon">A</div>
          <h2>Criar Novo Perfil</h2>
          <div className="edit-profile-form">
            <label>
              Nome
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Digite o nome completo" />
            </label>
            <label>
              E-mail
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Digite o e-mail" />
            </label>
            <label>
              Senha
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha"
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword((p) => !p)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>
            <label>
              Telefone
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Digite o número de telefone" />
            </label>

            <div className="edit-profile-actions">
              <button type="button" className="primary-button" onClick={() => navigate('/dashboard')}>Voltar para o Dashboard</button>
              <button
                type="button"
                className="primary-button"
                onClick={handleCreateProfile}
                disabled={saving}
                style={{ opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                {saving ? 'Salvando...' : 'Criar Perfil'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
