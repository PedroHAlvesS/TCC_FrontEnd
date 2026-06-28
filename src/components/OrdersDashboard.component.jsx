import { useMemo, useState } from 'react';

export default function OrdersDashboardComponent({
  title,
  subtitle,
  orders,
  profileHeader,
  profileMenu,
  onRowClick,
  showNameFilter = true,
  showCreateOrderButton = false,
  onCreateOrder,
  initialStatus = 'PENDING',
}) {
  const [filterStatus, setFilterStatus] = useState(initialStatus);
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(
    () => ({
      pending: orders.filter((order) => order.status === 'Pendente').length,
      assigned: orders.filter((order) => order.status === 'Atribuído').length,
      inTransit: orders.filter((order) => order.status === 'Em Trânsito').length,
      delivered: orders.filter((order) => order.status === 'Entregue').length,
    }),
    [orders]
  );

  const filteredOrders = useMemo(
    () =>
      orders
        .filter((order) => order.status === filterStatus)
        .filter((order) => order.customerName.toLowerCase().includes(searchTerm.toLowerCase())),
    [orders, filterStatus, searchTerm]
  );

  return (
    <>
      <header className="dashboard-header">
        <div>
          <div className="dashboard-title">{title}</div>
          <div className="dashboard-subtitle">{subtitle}</div>
        </div>

        {profileHeader ? <div className="profile-menu-container">{profileHeader}</div> : null}
        {profileMenu}
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
            {showNameFilter ? <p>Filtre por status ou pelo nome do cliente.</p> : <p>Filtre por status.</p>}
          </div>
          {showCreateOrderButton ? (
            <button type="button" className="primary-button" onClick={onCreateOrder}>
              Criar Pedido
            </button>
          ) : null}
        </div>

        <div className="dashboard-filter-row">
          <div>
            <label>
              Status
              <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
                <option value="Pendente">Pendente</option>
                <option value="Atribuído">Atribuído</option>
                <option value="Em Trânsito">Em Trânsito</option>
                <option value="Entregue">Entregue</option>
              </select>
            </label>
          </div>
          {showNameFilter ? (
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
          ) : null}
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '28px 0' }}>
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} onClick={() => onRowClick(order)} style={{ cursor: 'pointer' }}>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
