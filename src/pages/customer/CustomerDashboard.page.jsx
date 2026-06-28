import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken, getUserEmail } from '../../services/auth';
import { fetchCustomerOrders } from '../../services/customerDashboard.service';
import { fetchCustomerProfile, deleteCustomerAccount } from '../../services/customerProfile.service';
import OrdersDashboardComponent from '../../components/OrdersDashboard.component';

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchCustomerProfile(), fetchCustomerOrders()])
      .then(([customerProfileData, orderData]) => {
        if (!mounted) return;
        setCustomerData(customerProfileData);
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
      await deleteCustomerAccount();
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
        <OrdersDashboardComponent
          title="Painel do Cliente"
          subtitle="Confira seus pedidos"
          orders={orders}
          showNameFilter={false}
          showCreateOrderButton={true}
          onCreateOrder={() => navigate('/cliente/create-pedido')}
          profileHeader={
            <>
              <button className="profile-button" type="button" onClick={() => setProfileOpen((prev) => !prev)}>
                <span className="profile-avatar">C</span>
                <div className="profile-info">
                  <span>{customerData.name}</span>
                  <small>{customerData.profile}</small>
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
          onRowClick={(order) => navigate(`/cliente/pedidos/${order.id}`)}
        />
      </div>
    </div>
  );
}
