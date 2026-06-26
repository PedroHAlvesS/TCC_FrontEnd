import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken, getUserEmail } from '../services/auth';
import { fetchCustomerOrdersByEmail } from '../services/dashboardService';
import { fetchCustomerProfileByEmail, deleteCustomerAccount } from '../services/CustomerProfileService';
import OrdersDashboard from '../components/OrdersDashboard';

export default function ClientDashboard() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const email = getUserEmail();
    fetchCustomerOrdersByEmail(email)
      .then((orderData) => {
        if (!mounted) return;
        setOrders(orderData);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  function handleLogout() {
    clearToken();
    navigate('/', { replace: true });
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm('Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (!confirmed) return;

    try {
      const profile = await fetchCustomerProfileByEmail(getUserEmail());
      await deleteCustomerAccount(profile.id);
      clearToken();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Erro ao excluir conta');
    }
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

  if (!orders) {
    return (
      <div className="page-shell dashboard-shell">
        <div className="dashboard-main" style={{ padding: 24 }}>
          <h2>Carregando dashboard do cliente…</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell dashboard-shell">
      <div className="dashboard-main">
        <OrdersDashboard
          title="Painel do Cliente"
          subtitle="Confira seus pedidos"
          orders={orders}
          showNameFilter={false}
          profileHeader={
            <>
              <button className="profile-button" type="button" onClick={() => setProfileOpen((prev) => !prev)}>
                <span className="profile-avatar">C</span>
                <div className="profile-info">
                  <span>{getUserEmail() || 'Cliente'}</span>
                  <small>Conta do cliente</small>
                </div>
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <button type="button" className="profile-dropdown-item" onClick={() => navigate('/cliente/edit')}>
                    Editar Perfil
                  </button>
                  <button type="button" className="profile-dropdown-item" onClick={handleDeleteAccount}>
                    Excluir Conta
                  </button>
                  <button type="button" className="profile-dropdown-item logout" onClick={handleLogout}>
                    Sair
                  </button>
                </div>
              )}
            </>
          }
          onRowClick={(order) => navigate(`/pedidos/${order.id}`)}
        />
      </div>
    </div>
  );
}
