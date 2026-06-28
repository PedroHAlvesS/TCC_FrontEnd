import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken, getUserEmail, setUserEmail } from '../../services/auth';
import { updateCustomerProfile } from '../../services/customerProfile.service';
import { validateProfile } from '../../utils/validators';
import ProfileEditForm from '../../components/ProfileEditForm';
import { ROUTES } from '../../routes/ROUTES';


export default function CustomerEditProfilePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  async function handleEditProfile() {
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    const { valid, errors } = validateProfile({ email, phone, password });
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

      await updateCustomerProfile(payload);
      setSuccessMessage('Alterado com sucesso. Você será deslogado em 2 segundos...');

      window.setTimeout(() => {
        handleLogout();
      }, 2000);
    } catch (err) {
      setErrorMessage(err?.message || 'Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearToken();
    navigate(ROUTES.ROOT, { replace: true });
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
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-title">Editar Perfil</div>
            <div className="dashboard-subtitle">Atualize suas informações pessoais.</div>
          </div>
        </header>

        <ProfileEditForm
          title="rapidoJá"
          subtitle="Atualize suas informações pessoais."
          email={email}
          phone={phone}
          password={password}
          showPassword={showPassword}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onPasswordChange={setPassword}
          onTogglePassword={() => setShowPassword((prev) => !prev)}
          onSave={handleEditProfile}
          onCancel={() => navigate(ROUTES.CUSTOMER_DASHBOARD)}
          onClearSuccess={() => setSuccessMessage('')}
          onClearError={() => setErrorMessage('')}
          saving={saving}
          successMessage={successMessage}
          errorMessage={errorMessage}
          buttonLabel={saving ? 'Salvando...' : 'Salvar Alterações'}
        />
      </div>
    </div>
  );
}
