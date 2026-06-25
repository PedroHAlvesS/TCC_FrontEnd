import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { fetchOrders, fetchAdminProfile } from '../services/dashboardService';
import { clearToken } from '../services/auth';

export default function Dashboard() {
  const [orders, setOrders] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
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

  const stats = {
    pending: orders.filter((order) => order.status === 'PENDING').length,
    assigned: orders.filter((order) => order.status === 'ASSIGNED').length,
    inTransit: orders.filter((order) => order.status === 'IN_TRANSIT').length,
    delivered: orders.filter((order) => order.status === 'DELIVERED').length,
  };

  const filteredOrders = orders
    .filter((order) => order.status === filterStatus)
    .filter((order) => order.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

  function handleLogout() {
    clearToken();
    navigate('/admin', { replace: true });
  }

  return (
    <div className="page-shell dashboard-shell">
      <Sidebar activePath="/dashboard" />
      <div className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <div className="dashboard-title">Dashboard</div>
            <div className="dashboard-subtitle">Aqui está o resumo do sistema.</div>
          </div>

          <div className="profile-menu-container">
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
          </div>
        </header>

        <section className="dashboard-stats">
          <div className="dashboard-card">
            <div className="dashboard-card-title">Pedidos não atribuídos</div>
            <div className="dashboard-card-value">{stats.pending}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-title">Pedidos atribuídos</div>
            <div className="dashboard-card-value">{stats.assigned}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-title">Pedidos em trânsito</div>
            <div className="dashboard-card-value">{stats.inTransit}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-title">Pedidos entregues</div>
            <div className="dashboard-card-value">{stats.delivered}</div>
          </div>
        </section>

        <section className="dashboard-orders">
          <div className="dashboard-orders-header">
            <div>
              <h2>Pedidos</h2>
              <p>Filtre por status ou pelo nome do cliente.</p>
            </div>
          </div>

          <div className="dashboard-filter-row">
            <div>
              <label>
                Status
                <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                  <option value="PENDING">PENDING</option>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                Buscar por nome
                <input
                  type="text"
                  placeholder="Digite o nome do cliente"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="dashboard-orders-table-wrapper">
            <table className="dashboard-orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Endereço</th>
                  <th>Data do Pedido</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} onClick={() => navigate(`/pedidos/${order.id}`)} style={{ cursor: 'pointer' }}>
                    <td>#{order.id}</td>
                    <td>{order.customerName}</td>
                    <td>
                      {order.address.street}, {order.address.number}
                      {order.address.complement ? `, ${order.address.complement}` : ''}
                      <br />
                      <small>{order.address.neighborhood}</small>
                    </td>
                    <td>{new Date(order.creationDate).toLocaleString('pt-BR')}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
