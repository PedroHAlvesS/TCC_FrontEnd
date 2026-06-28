import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import OrderDetailsView from '../../components/OrderDetailsView';
import { clearToken, getUserEmail } from '../../services/auth';
import { updateDeliveryManOrderStatus } from '../../services/deliveryManDashboard.service';

function normalizeStatus(status) {
  return String(status || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/\s+/g, '_');
}

function getNextDeliveryStatuses(currentStatus) {
  const normalizedStatus = normalizeStatus(currentStatus);

  switch (normalizedStatus) {
    case 'ATRIBUIDO':
    case 'ASSIGNED':
      return ['IN_TRANSIT', 'CANCELED'];
    case 'EM_TRANSITO':
    case 'IN_TRANSIT':
      return ['DELIVERED', 'CANCELED'];
    default:
      return [];
  }
}

const STATUS_LABELS = {
  IN_TRANSIT: 'Em Trânsito',
  DELIVERED: 'Entregue',
  CANCELED: 'Cancelado',
};

export default function DeliveryManOrderDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [deliveryManData, setDeliveryManData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const ordersFromState = location.state.orders;
    const deliveryManDataFromState = location.state.deliveryManData;
    setDeliveryManData(deliveryManDataFromState);

    const resolveOrder = (orders) => {
      const selected = orders?.find((item) => String(item.id) === String(id));
      if (!selected) {
        setError('Pedido não encontrado');
        return;
      }

      if (mounted) {
        const nextStatuses = getNextDeliveryStatuses(selected.status);
        setOrder(selected);
        setSelectedStatus(nextStatuses[0] || '');
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
    navigate('/entregador', { replace: true });
  }

  async function handleUpdateStatus() {
    if (!order) return;

    setUpdatingStatus(true);
    setError('');
    setSuccessMessage('');

    try {
      await updateDeliveryManOrderStatus(order.id, selectedStatus);
      setOrder({ ...order, status: STATUS_LABELS[selectedStatus]});
      setSuccessMessage('Status atualizado com sucesso!');
    } catch (err) {
      setError(err.message || 'Erro ao atualizar status');
    } finally {
      setUpdatingStatus(false);
    }
  }

  const availableStatuses = getNextDeliveryStatuses(order?.status);

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
            <>
              <button className="profile-button" type="button" onClick={() => setProfileOpen((prev) => !prev)}>
                <span className="profile-avatar">{deliveryManData.name.charAt(0)}</span>
                <div className="profile-info">
                  <span>{deliveryManData.name}</span>
                  <small>{deliveryManData.profile}</small>
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
          successMessage={successMessage}
          errorMessage={error}
          onClearError={() => setError('')}
          onClearSuccess={() => setSuccessMessage('')}
          assignmentSection={
            <>
              <div className="order-assign-title">Atualizar Status</div>
              <label className="order-assign-label">
                Novo status
                <select
                  value={selectedStatus}
                  onChange={(event) => setSelectedStatus(event.target.value)}
                  disabled={availableStatuses.length === 0}
                >
                  {availableStatuses.length === 0 ? (
                    <option value="">Sem transições disponíveis</option>
                  ) : (
                    availableStatuses.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status] || status}
                      </option>
                    ))
                  )}
                </select>
              </label>
              <button
                type="button"
                className="primary-button"
                onClick={handleUpdateStatus}
                disabled={updatingStatus || availableStatuses.length === 0 || !selectedStatus}
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
