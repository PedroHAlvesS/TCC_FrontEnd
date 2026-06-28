import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import OrderDetailsView from '../../components/OrderDetailsView';
import { clearToken, getUserEmail } from '../../services/auth';
import { fetchCustomerOrders } from '../../services/customerDashboard.service';
import { ROUTES, buildRoute } from '../../routes/ROUTES';


export default function CustomerOrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;
    const ordersFromState = location.state.orders;
    setCustomerData(location.state.customerData);

    const resolveOrder = (orders) => {
      const selected = orders?.find((item) => String(item.id) === String(id));
      if (!selected) {
        setError('Pedido não encontrado');
        return;
      }

      if (mounted) {
        setOrder(selected);
      }
    };

    resolveOrder(ordersFromState);
    if (mounted) setLoading(false);
    return () => {
      mounted = false;
    };
    
  }, [id, location.state]);

  function handleLogout() {
    clearToken();
    navigate(ROUTES.ROOT, { replace: true });
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm('Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.');
    if (!confirmed) return;

    try {
      await deleteCustomerAccount();
      clearToken();
      navigate(ROUTES.ROOT, { replace: true });
    } catch (err) {
      setError(err.message || 'Erro ao excluir conta');
    }
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
          onBack={() => navigate(ROUTES.CUSTOMER_DASHBOARD)}
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
                  <button type="button" className="profile-dropdown-item" onClick={() => navigate(ROUTES.CUSTOMER_EDIT_PROFILE)}>
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
          errorMessage={error}
          onClearError={() => setError('')}
        />
      </div>
    </div>
  );
}
