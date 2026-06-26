import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import OrdersDashboard from '../components/OrdersDashboard';
import { fetchOrders, fetchAdminProfile } from '../services/dashboardService';
import { clearToken } from '../services/auth';

export default function Dashboard() {
  const [orders, setOrders] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchAdminProfile(), fetchOrders()])
      .then(([adminData, orderData]) => {
        if (!mounted) return;
        setAdmin(adminData);
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

  if (!orders || !admin) {
    return (
      <div className="page-shell dashboard-shell">
        <div className="dashboard-main" style={{ padding: 24 }}>
          <h2>Carregando dashboard…</h2>
        </div>
      </div>
    );
  }

  function handleLogout() {
    clearToken();
    navigate('/admin', { replace: true });
  }

  return (
    <div className="page-shell dashboard-shell">
      <Sidebar activePath="/dashboard" />
      <div className="dashboard-main">
        <OrdersDashboard
          title="Dashboard"
          subtitle="Aqui está o resumo do sistema."
          orders={orders}
          profileHeader={
            <>
              <button className="profile-button" onClick={() => setProfileOpen((prev) => !prev)}>
                <span className="profile-avatar">{admin.name.charAt(0)}</span>
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
            </>
          }
          onRowClick={(order) => navigate(`/pedidos/${order.id}`)}
        />
      </div>
    </div>
  );
}
