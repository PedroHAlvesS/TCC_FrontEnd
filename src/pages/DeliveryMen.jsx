import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { fetchDeliveryMen, fetchAdminProfile, createDeliveryMan, updateDeliveryMan, deleteDeliveryMan } from '../services/dashboardService';
import { clearToken } from '../services/auth';
import { validateProfile } from '../utils/validators';

function formatPhone(phone) {
  if (!phone) return '-';
  const normalized = phone.replace(/\D/g, '');
  return normalized.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
}

function formatDate(dateString) {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DeliveryMen() {
  const [deliveryMen, setDeliveryMen] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingDeliveryMan, setEditingDeliveryMan] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchAdminProfile(), fetchDeliveryMen()])
      .then(([adminData, deliveryData]) => {
        if (!mounted) return;
        setAdmin(adminData);
        setDeliveryMen(Array.isArray(deliveryData) ? deliveryData : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Erro ao carregar entregadores');
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const editDeliveryManId = location.state?.editDeliveryManId;
    if (!editDeliveryManId || !deliveryMen?.length) return;

    const deliveryManToEdit = deliveryMen.find((item) => String(item.id) === String(editDeliveryManId));
    if (deliveryManToEdit) {
      openEditDrawer(deliveryManToEdit);
    }
  }, [location.state, deliveryMen]);

  function handleLogout() {
    clearToken();
    navigate('/admin', { replace: true });
  }

  function resetCreateForm() {
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setNewPhone('');
    setShowPassword(false);
    setCreateError('');
  }

  function openDrawer() {
    resetCreateForm();
    setEditingDeliveryMan(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(deliveryMan) {
    setEditingDeliveryMan(deliveryMan);
    setNewName(deliveryMan.name || '');
    setNewEmail(deliveryMan.email || '');
    setNewPassword('');
    setNewPhone(deliveryMan.phoneNumber || '');
    setShowPassword(false);
    setCreateError('');
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setCreateError('');
    setEditingDeliveryMan(null);
  }

  async function handleCreateDeliveryMan() {
    setCreating(true);
    setCreateError('');
    setSuccessMessage('');

    const validation = validateProfile({ email: newEmail, phone: newPhone, password: newPassword }, { requirePassword: true });
    if (!newName.trim()) {
      validation.errors.name = 'Nome é obrigatório';
    }

    if (Object.keys(validation.errors).length > 0) {
      setCreateError(validation.errors.name || validation.errors.email || validation.errors.phone || validation.errors.password);
      setCreating(false);
      return;
    }

    try {
      await createDeliveryMan({
        name: newName,
        email: newEmail,
        password: newPassword,
        phoneNumber: newPhone,
      });

      setSuccessMessage('Entregador cadastrado com sucesso.');
      closeDrawer();
      resetCreateForm();
      const updatedDeliveryMen = await fetchDeliveryMen();
      setDeliveryMen(Array.isArray(updatedDeliveryMen) ? updatedDeliveryMen : []);
    } catch (err) {
      setCreateError(err?.message || 'Erro ao cadastrar entregador');
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdateDeliveryMan() {
    if (!editingDeliveryMan) return;

    setCreating(true);
    setCreateError('');
    setSuccessMessage('');

    const validation = validateProfile({ email: newEmail, phone: newPhone, password: newPassword }, { requirePassword: false });
    if (Object.keys(validation.errors).length > 0) {
      setCreateError(validation.errors.email || validation.errors.phone || validation.errors.password);
      setCreating(false);
      return;
    }

    try {
      await updateDeliveryMan(editingDeliveryMan.id, {
        email: newEmail,
        phoneNumber: newPhone,
        ...(newPassword ? { password: newPassword } : {}),
      });

      setSuccessMessage('Entregador atualizado com sucesso.');
      closeDrawer();
      resetCreateForm();
      const updatedDeliveryMen = await fetchDeliveryMen();
      setDeliveryMen(Array.isArray(updatedDeliveryMen) ? updatedDeliveryMen : []);
    } catch (err) {
      setCreateError(err?.message || 'Erro ao atualizar entregador');
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteDeliveryMan(deliveryMan) {
    const confirmed = window.confirm(`Deseja realmente excluir ${deliveryMan.name}?`);
    if (!confirmed) return;

    try {
      await deleteDeliveryMan(deliveryMan.id);
      setSuccessMessage('Entregador excluído com sucesso.');
      const updatedDeliveryMen = await fetchDeliveryMen();
      setDeliveryMen(Array.isArray(updatedDeliveryMen) ? updatedDeliveryMen : []);
    } catch (err) {
      setError(err?.message || 'Erro ao excluir entregador');
    }
  }

  const filteredDeliveryMen = (deliveryMen || []).filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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

  if (!deliveryMen || !admin) {
    return (
      <div className="page-shell dashboard-shell">
        <div className="dashboard-main" style={{ padding: 24 }}>
          <h2>Carregando entregadores…</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell dashboard-shell">
      <Sidebar activePath="/entregadores" />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-title">Entregadores</div>
            <div className="dashboard-subtitle">Gerencie os entregadores cadastrados no sistema.</div>
          </div>

          <div className="profile-menu-container">
            <button className="profile-button" onClick={() => setProfileOpen((prev) => !prev)}>
              <span className="profile-avatar">{admin.name?.charAt(0) || 'A'}</span>
              <div className="profile-info">
                <span>{admin.name}</span>
                <small>Administrador</small>
              </div>
            </button>
            {profileOpen && (
              <div className="profile-dropdown">
                <button type="button" className="profile-dropdown-item" onClick={() => navigate('/admin/edit')}>
                  Editar Perfil
                </button>
                <button type="button" className="profile-dropdown-item" onClick={() => navigate('/admin/create')}>
                  Criar Novo Perfil
                </button>
                <button type="button" className="profile-dropdown-item logout" onClick={handleLogout}>
                  Sair
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="dashboard-orders">
          <div className="dashboard-orders-header">
            <div>
              <h2>Entregadores</h2>
              <p>Filtre pelo nome ou adicione um novo entregador.</p>
            </div>
            <button type="button" className="primary-button" onClick={openDrawer}>
              + Novo Entregador
            </button>
          </div>

          <div className="dashboard-filter-row">
            <label>
              Buscar entregador
              <input
                type="text"
                placeholder="Digite o nome do entregador"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
          </div>

          {successMessage && (
            <div className="success-banner" style={{ marginBottom: 20 }}>
              <span>{successMessage}</span>
              <button className="banner-close" onClick={() => setSuccessMessage('')}>×</button>
            </div>
          )}
          <div className="dashboard-orders-table-wrapper">
            <table className="dashboard-orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Data de Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveryMen.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                      Nenhum entregador encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredDeliveryMen.map((deliveryMan) => (
                    <tr key={deliveryMan.id}>
                      <td>#{deliveryMan.id}</td>
                      <td>{deliveryMan.name}</td>
                      <td>{deliveryMan.email}</td>
                      <td>{formatPhone(deliveryMan.phoneNumber)}</td>
                      <td>{formatDate(deliveryMan.createdAt)}</td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="action-button" onClick={() => navigate(`/entregadores/pedidos/${deliveryMan.id}`)}>
                            👁️
                          </button>
                          <button type="button" className="action-button" onClick={() => openEditDrawer(deliveryMan)}>
                            ✏️
                          </button>
                          <button type="button" className="action-button delete" onClick={() => handleDeleteDeliveryMan(deliveryMan)}>
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {drawerOpen && <div className="drawer-overlay" onClick={closeDrawer} />}
        <aside className={`delivery-side-panel ${drawerOpen ? 'open' : ''}`}>
          <div className="delivery-side-panel-header">
            <div>
              <h2>{editingDeliveryMan ? 'Editar Entregador' : 'Novo Entregador'}</h2>
              <p>{editingDeliveryMan ? 'Atualize apenas o e-mail, senha e telefone do entregador.' : 'Preencha os dados abaixo para cadastrar um novo entregador.'}</p>
            </div>
            <button type="button" className="drawer-close-button" onClick={closeDrawer}>×</button>
          </div>

          {createError && (
            <div className="error-banner">
              <span>{createError}</span>
              <button className="banner-close" onClick={() => setCreateError('')}>×</button>
            </div>
          )}

          <div className="edit-profile-form">
            <label>
              Nome
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Digite o nome completo"
                disabled={!!editingDeliveryMan}
              />
            </label>
            <label>
              E-mail
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="Digite o e-mail" />
            </label>
            <label>
              Senha
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={editingDeliveryMan ? 'Deixe em branco para manter a senha atual' : 'Digite a senha'}
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>
            <label>
              Telefone
              <input type="text" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="Digite o número de telefone" />
            </label>

            <div className="edit-profile-actions" style={{ flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                className="primary-button"
                onClick={editingDeliveryMan ? handleUpdateDeliveryMan : handleCreateDeliveryMan}
                disabled={creating}
                style={{ opacity: creating ? 0.7 : 1, cursor: creating ? 'not-allowed' : 'pointer', width: '100%' }}
              >
                {creating ? (editingDeliveryMan ? 'Salvando...' : 'Cadastrando...') : (editingDeliveryMan ? 'Salvar Alterações' : 'Cadastrar Entregador')}
              </button>
              <button type="button" className="secondary-button" onClick={closeDrawer} disabled={creating}>
                Cancelar
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
