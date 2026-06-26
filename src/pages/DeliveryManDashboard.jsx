import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersDashboard from '../components/OrdersDashboard';
import { clearToken, getUserEmail } from '../services/auth';
import { fetchDeliveryManOrdersByEmail } from '../services/dashboardService';

export default function DeliveryManDashboard() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const email = getUserEmail();

    fetchDeliveryManOrdersByEmail(email)
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
    navigate('/entregador', { replace: true });
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
          <h2>Carregando dashboard do entregador…</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell dashboard-shell">
      <div className="dashboard-main">
        <OrdersDashboard
          title="Painel do Entregador"
          subtitle="Confira os pedidos atribuídos a você"
          orders={orders}
          showNameFilter={true}
          showCreateOrderButton={false}
          initialStatus="ASSIGNED"
          profileHeader={
            <>
              <button className="profile-button" type="button" onClick={() => setProfileOpen((prev) => !prev)}>
                <span className="profile-avatar">E</span>
                <div className="profile-info">
                  <span>{getUserEmail() || 'Entregador'}</span>
                  <small>Conta do entregador</small>
                </div>
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <button type="button" className="profile-dropdown-item logout" onClick={handleLogout}>
                    Sair
                  </button>
                </div>
              )}
            </>
          }
          onRowClick={(order) => navigate(`/entregador/pedidos/${order.id}`)}
        />
      </div>
    </div>
  );
}
