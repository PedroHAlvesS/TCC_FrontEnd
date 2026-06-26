import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken, getUserEmail, setUserEmail } from '../services/auth';
import { fetchCustomerProfileByEmail, updateCustomerProfile } from '../services/CustomerProfileService';
import { validateProfile } from '../utils/validators';
import ProfileEditForm from '../components/ProfileEditForm';

export default function ClientEditProfile() {
  const [customer, setCustomer] = useState(null);
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
    const emailKey = getUserEmail();

    fetchCustomerProfileByEmail(emailKey)
      .then((data) => {
        if (!mounted) return;
        setCustomer(data);
        setEmail(data.email || '');
        setPhone(data.phoneNumber || '');
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
    if (!customer) return;
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

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

      const updated = await updateCustomerProfile(customer.id, payload);
      setSuccessMessage('Alterado com sucesso');
      if (email && email !== customer.email) {
        setUserEmail(email);
      }
      setCustomer((prev) => ({ ...prev, email, phoneNumber: phone }));
      setPassword('');
    } catch (err) {
      setErrorMessage(err?.message || 'Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    clearToken();
    navigate('/', { replace: true });
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

          <div className="profile-menu-container">
            <button className="profile-button" onClick={handleLogout}>
              <span className="profile-avatar">C</span>
              <div className="profile-info">
                <span>{customer.name || 'Cliente'}</span>
                <small>Conta do cliente</small>
              </div>
            </button>
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
          onCancel={() => navigate('/cliente-dashboard')}
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
