import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import OrdersDashboardComponent from '../../components/OrdersDashboard.component';
import { fetchOrders, fetchAdminProfile } from '../../services/adminDashboard.service';
import { clearToken } from '../../services/auth';
import { ROUTES, buildRoute } from '../../routes/ROUTES';

export default function AdminDashboardPage() {
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
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  }

  return (
    <div className="page-shell dashboard-shell">
      <Sidebar activePath="/dashboard" />
      <div className="dashboard-main">
        <OrdersDashboardComponent
          title="Dashboard"
          subtitle="Aqui está o resumo do sistema."
          orders={orders}
          profileHeader={
            <>
              <button className="profile-button" onClick={() => setProfileOpen((prev) => !prev)}>
                <span className="profile-avatar">{admin.name.charAt(0)}</span>
                <div className="profile-info">
                  <span>{admin.name}</span>
                  <small>{admin.profile}</small>
                </div>
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <button type="button" className="profile-dropdown-item" onClick={() => navigate(ROUTES.ADMIN_EDIT_PROFILE)}>
                    Editar Perfil
                  </button>
                  <button type="button" className="profile-dropdown-item" onClick={() => navigate(ROUTES.ADMIN_CREATE_PROFILE)}>
                    Criar Novo Perfil
                  </button>
                  <button type="button" className="profile-dropdown-item logout" onClick={handleLogout}>
                    Sair
                  </button>
                </div>
              )}
            </>
          }
          onRowClick={(order) => navigate(buildRoute(ROUTES.ADMIN_ORDER_DETAILS, { id: order.id }))}
        />
      </div>
    </div>
  );
}
