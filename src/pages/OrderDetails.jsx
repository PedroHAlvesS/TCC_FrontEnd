import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import OrderDetailsView from '../components/OrderDetailsView';
import { fetchOrders, fetchAdminProfile, fetchDeliveryMen, assignOrderToDeliveryMan } from '../services/adminDashboard.service';
import { clearToken } from '../services/auth';

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [deliveryMen, setDeliveryMen] = useState([]);
  const [selectedDeliveryManId, setSelectedDeliveryManId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [assigning, setAssigning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    Promise.all([fetchAdminProfile(), fetchOrders(), fetchDeliveryMen()])
      .then(([adminData, orderData, deliveryMenData]) => {
        if (!mounted) return;
        setAdmin(adminData);
        setDeliveryMen(deliveryMenData || []);
        const selected = orderData.find((item) => String(item.id) === String(id));
        if (!selected) {
          setError('Pedido não encontrado');
          return;
        }
        setOrder(selected);
        setSelectedDeliveryManId(selected.deliveryManId || '');
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
    navigate('/admin', { replace: true });
  }

  async function handleAssignOrder() {
    if (!selectedDeliveryManId) {
      setError('Selecione um entregador');
      return;
    }

    setAssigning(true);
    setError('');
    setSuccessMessage('');

    try {
      await assignOrderToDeliveryMan(order.id, selectedDeliveryManId);
      setSuccessMessage('Pedido atribuído ao entregador com sucesso!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Erro ao atribuir pedido ao entregador');
    } finally {
      setAssigning(false);
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
      <Sidebar activePath="/dashboard" />
      <div className="dashboard-main">
        <OrderDetailsView
          title={`Detalhes do Pedido #${order.id}`}
          subtitle={order.status}
          order={order}
          onBack={() => navigate('/dashboard')}
          profileHeader={
            <button className="profile-button" onClick={handleLogout}>
              <span className="profile-avatar">{admin?.name?.charAt(0) || 'A'}</span>
              <div className="profile-info">
                <span>{admin?.name}</span>
                <small>Administrador</small>
              </div>
            </button>
          }
          successMessage={successMessage}
          errorMessage={error}
          onClearError={() => setError('')}
          onClearSuccess={() => setSuccessMessage('')}
          assignmentSection={
            <>
              <div className="order-assign-title">Atribuir Entregador</div>
              {order.status !== 'PENDING' ? (
                <div className="order-assign-empty">
                  <strong>Entregador atribuído:</strong>
                  <div>{order.deliveryManName || 'Nome do entregador não informado'}</div>
                </div>
              ) : (
                <>
                  <label className="order-assign-label">
                    Selecione o entregador
                    <select
                      value={selectedDeliveryManId}
                      onChange={(event) => setSelectedDeliveryManId(event.target.value)}
                    >
                      <option value="">Selecione um entregador</option>
                      {deliveryMen.map((deliveryMan) => (
                        <option key={deliveryMan.id} value={deliveryMan.id}>
                          {deliveryMan.name} · {deliveryMan.email} · ({deliveryMan.phoneNumber})
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleAssignOrder}
                    disabled={!selectedDeliveryManId || assigning}
                  >
                    {assigning ? 'Atribuindo...' : 'Atribuir Pedido ao Entregador'}
                  </button>
                  <div className="order-assign-footer">
                    <strong>Entregador selecionado</strong>
                    <div>{selectedDeliveryManId ? deliveryMen.find((d) => String(d.id) === String(selectedDeliveryManId))?.name : 'Nenhum entregador selecionado'}</div>
                  </div>
                </>
              )}
            </>
          }
        />
      </div>
    </div>
  );
}
