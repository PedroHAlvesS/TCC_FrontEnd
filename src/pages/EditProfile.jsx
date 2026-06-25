import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminProfile } from '../services/dashboardService';
import { clearToken, setUserEmail } from '../services/auth';
import Sidebar from '../components/Sidebar';
import { updateAdminProfile } from '../services/EditAdminProfile';
import { validateProfile } from '../utils/validators';

export default function EditProfile() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    fetchAdminProfile()
      .then((data) => {
        if (!mounted) return;
        setAdmin(data);
        setEmail(data.email || '');
        setPhone(data.phoneNumber || '');
        // make sure password field is always empty on load
        setPassword('');
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Erro ao carregar perfil');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleEditProfile() {
    if (!admin) return;
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    // validate email and phone; password validated only if provided
    const { valid, errors } = validateProfile({ email, phone, password }, { requirePassword: false });
    if (!valid) {
      const first = errors.email || errors.phone || errors.password;
      setErrorMessage(first);
      setSaving(false);
      return;
    }
    try {
      const payload = {
        email: email || null,
        phoneNumber: phone || null,
        password: password || null,
      };
      await updateAdminProfile(admin.id, payload);
      setSuccessMessage('Alterado com sucesso');
      if (email && email !== admin.email) {
        setUserEmail(email);
      }

      setAdmin((prev) => ({ ...prev, email, phoneNumber: phone }));
      setPassword('');
    } catch (err) {
      setErrorMessage(err?.message || 'Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearToken();
    navigate('/admin', { replace: true });
  }

  if (loading) {
    return (
      <div className="page-shell dashboard-shell">
        <div className="dashboard-main" style={{ padding: 24 }}>
          <h2>Carregando...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell dashboard-shell">
        <div className="dashboard-main" style={{ padding: 24 }}>
          <h2>Erro</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell dashboard-shell">
      <Sidebar activePath="/admin/edit" />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-title">Editar Perfil</div>
            <div className="dashboard-subtitle">Atualize suas informações pessoais.</div>
          </div>

          <div className="profile-menu-container">
            <button className="profile-button" onClick={handleLogout}>
              <span className="profile-avatar">{admin.name?.charAt(0) || 'A'}</span>
              <div className="profile-info">
                <span>{admin.name}</span>
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
          <h2>rapidoJá</h2>
          <div className="edit-profile-form">
            <label>
              E-mail
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label>
              Telefone
              <input type="text" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>
            <label>
              Senha
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Digite sua nova senha"
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>
            <div className="edit-profile-actions">
              <button type="button" className="primary-button" onClick={() => navigate('/dashboard')}>
                Voltar para o Dashboard
              </button>
              <button
                type="button"
                className="primary-button"
                onClick={handleEditProfile}
                disabled={saving}
                style={{ opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
              >
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}