import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OrderDetailsView from '../components/OrderDetailsView';
import { clearToken, getUserEmail } from '../services/auth';
import { fetchDeliveryManOrdersByEmail, updateDeliveryManOrderStatus } from '../services/dashboardService';

export default function DeliveryManOrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('ASSIGNED');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const email = getUserEmail();

    fetchDeliveryManOrdersByEmail(email)
      .then((orders) => {
        if (!mounted) return;
        const selected = orders.find((item) => String(item.id) === String(id));
        if (!selected) {
          setError('Pedido não encontrado');
          return;
        }
        setOrder(selected);
        setSelectedStatus(selected.status || 'ASSIGNED');
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
    navigate('/entregador', { replace: true });
  }

  async function handleUpdateStatus() {
    if (!order) return;

    setUpdatingStatus(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateDeliveryManOrderStatus(order.id, selectedStatus, getUserEmail());
      setOrder({ ...order, status: selectedStatus });
      setSuccessMessage('Status atualizado com sucesso!');
    } catch (err) {
      setError(err.message || 'Erro ao atualizar status');
    } finally {
      setUpdatingStatus(false);
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

  if (error && !order) {
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
          onBack={() => navigate('/entregador-dashboard')}
          profileHeader={
            <button className="profile-button" type="button" onClick={handleLogout}>
              <span className="profile-avatar">E</span>
              <div className="profile-info">
                <span>{getUserEmail() || 'Entregador'}</span>
                <small>Conta do entregador</small>
              </div>
            </button>
          }
          successMessage={successMessage}
          errorMessage={error}
          onClearError={() => setError('')}
          onClearSuccess={() => setSuccessMessage('')}
          assignmentSection={
            <>
              <div className="order-assign-title">Atualizar Status</div>
              <label className="order-assign-label">
                Novo status
                <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                  <option value="ASSIGNED">ASSIGNED</option>
                  <option value="IN_TRANSIT">IN_TRANSIT</option>
                  <option value="DELIVERED">DELIVERED</option>
                </select>
              </label>
              <button
                type="button"
                className="primary-button"
                onClick={handleUpdateStatus}
                disabled={updatingStatus || selectedStatus === order.status}
              >
                {updatingStatus ? 'Atualizando...' : 'Atualizar Status'}
              </button>
              <div className="order-assign-footer">
                <strong>Status atual</strong>
                <div>{order.status}</div>
              </div>
            </>
          }
        />
      </div>
    </div>
  );
}
