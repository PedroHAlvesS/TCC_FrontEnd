import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearToken, getToken, getUserEmail } from '../services/auth';
import { fetchCustomerOrdersByEmail } from '../services/dashboardService';
import OrdersDashboard from '../components/OrdersDashboard';

export default function ClientDashboard() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
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
            <button className="profile-button" type="button" onClick={handleLogout}>
              <span className="profile-avatar">C</span>
              <div className="profile-info">
                <span>{getUserEmail() || 'Cliente'}</span>
                <small>Conta do cliente</small>
              </div>
            </button>
          }
          onRowClick={(order) => navigate(`/pedidos/${order.id}`)}
        />
      </div>
    </div>
  );
}
