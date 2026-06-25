import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import CustomerDetailsCard from '../components/CustomerDetailsCard';
import { clearToken } from '../services/auth';
import { fetchAdminProfile, fetchCustomers, fetchCustomerOrders } from '../services/dashboardService';

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

export default function CustomerOrders() {
  const { id } = useParams();
  const [admin, setAdmin] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [searchDeliveryMan, setSearchDeliveryMan] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchAdminProfile(), fetchCustomers(), fetchCustomerOrders(id)])
      .then(([adminData, customersData, orderData]) => {
        if (!mounted) return;
        setAdmin(adminData);
        const foundCustomer = (customersData || []).find((item) => String(item.id) === String(id));
        if (!foundCustomer) {
          setError('Cliente não encontrado.');
          setLoading(false);
          return;
        }
        setCustomer(foundCustomer);
        setOrders(Array.isArray(orderData) ? orderData : []);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Erro ao carregar dados do cliente');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const filteredOrders = useMemo(() => {
    const searchTerm = searchDeliveryMan.toLowerCase();
    return orders.filter((order) => {
      const deliveryManName = String(order.deliveryManName || '').toLowerCase();
      const matchesDeliveryMan = deliveryManName.includes(searchTerm);
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      return matchesDeliveryMan && matchesStatus;
    });
  }, [orders, searchDeliveryMan, statusFilter]);

  function handleLogout() {
    clearToken();
    navigate('/admin', { replace: true });
  }

  if (loading) {
    return (
      <div className="page-shell dashboard-shell">
        <div className="dashboard-main" style={{ padding: 24 }}>
          <h2>Carregando cliente...</h2>
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
      <Sidebar activePath="/clientes" />
      <div className="dashboard-main">
        <div className="page-actions-row">
          <button type="button" className="secondary-button" onClick={() => navigate('/clientes')}>
            ← Voltar para clientes
          </button>
        </div>

        <header className="dashboard-header">
          <div>
            <div className="dashboard-title">Pedidos do Cliente</div>
            <div className="dashboard-subtitle">Veja todos os pedidos feitos por este cliente.</div>
          </div>
          <div className="profile-menu-container">
            <button className="profile-button" onClick={handleLogout}>
              <span className="profile-avatar">{admin?.name?.charAt(0) || 'A'}</span>
              <div className="profile-info">
                <span>{admin?.name}</span>
                <small>Administrador</small>
              </div>
            </button>
          </div>
        </header>

        <section className="dashboard-orders" style={{ padding: '24px 28px' }}>
          <CustomerDetailsCard customer={customer} />

          <div className="dashboard-orders-header" style={{ marginTop: 32 }}>
            <div>
              <h2>Pedidos do Cliente</h2>
              <p>Busque pelo nome do entregador ou filtre por status do pedido.</p>
            </div>
          </div>

          <div className="dashboard-filter-row" style={{ gridTemplateColumns: 'repeat(3, minmax(240px, 1fr))' }}>
            <label>
              Buscar entregador
              <input
                type="text"
                placeholder="Digite o nome do entregador"
                value={searchDeliveryMan}
                onChange={(event) => setSearchDeliveryMan(event.target.value)}
              />
            </label>
            <label>
              Filtrar status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">Todos os status</option>
                <option value="PENDING">Pendente</option>
                <option value="ASSIGNED">Atribuído</option>
                <option value="IN_TRANSIT">Em trânsito</option>
                <option value="DELIVERED">Entregue</option>
                <option value="CANCELED">Cancelado</option>
              </select>
            </label>
          </div>

          <div className="dashboard-orders-table-wrapper">
            <table className="dashboard-orders-table">
              <thead>
                <tr>
                  <th>ID do Pedido</th>
                  <th>Cliente</th>
                  <th>Entregador</th>
                  <th>Endereço de Entrega</th>
                  <th>Data do Pedido</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                      Nenhum pedido encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/pedidos/${order.id}`)}>
                      <td>#{order.id}</td>
                      <td>{order.customerName}</td>
                      <td>{order.deliveryManName || '-'}</td>
                      <td>{order.address?.street}, {order.address?.number}</td>
                      <td>{formatDate(order.creationDate)}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
