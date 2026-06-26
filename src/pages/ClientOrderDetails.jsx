import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OrderDetailsView from '../components/OrderDetailsView';
import { clearToken, getUserEmail } from '../services/auth';
import { fetchCustomerOrdersByEmail } from '../services/dashboardService';

export default function ClientOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const email = getUserEmail();

    fetchCustomerOrdersByEmail(email)
      .then((orders) => {
        if (!mounted) return;
        const selected = orders.find((item) => String(item.id) === String(id));
        if (!selected) {
          setError('Pedido não encontrado');
          return;
        }
        setOrder(selected);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Erro ao carregar pedido');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  function handleLogout() {
    clearToken();
    navigate('/', { replace: true });
  }

  if (loading) {
    return (
      <div className="page-shell dashboard-shell">
        <div className="dashboard-main" style={{ padding: 24 }}>
          <h2>Carregando pedido...</h2>
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
        <OrderDetailsView
          title={`Detalhes do Pedido #${order.id}`}
          subtitle={order.status}
          order={order}
          onBack={() => navigate('/cliente-dashboard')}
          profileHeader={
            <button className="profile-button" type="button" onClick={handleLogout}>
              <span className="profile-avatar">C</span>
              <div className="profile-info">
                <span>{getUserEmail() || 'Cliente'}</span>
                <small>Conta do cliente</small>
              </div>
            </button>
          }
          errorMessage={error}
          onClearError={() => setError('')}
        />
      </div>
    </div>
  );
}
