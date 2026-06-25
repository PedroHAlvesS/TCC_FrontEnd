import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { fetchOrders, fetchAdminProfile, fetchDeliveryMen, assignOrderToDeliveryMan } from '../services/dashboardService';
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
        <div className="page-actions-row">
          <button type="button" className="secondary-button" onClick={() => navigate('/dashboard')}>
            ← Voltar para dashboard
          </button>
        </div>

        <header className="dashboard-header" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="dashboard-title">Detalhes do Pedido #{order.id}</div>
            <div className="dashboard-subtitle">{order.status}</div>
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

        {successMessage && (
          <div className="success-banner">
            <span>{successMessage}</span>
            <button
              type="button"
              className="banner-close"
              onClick={() => setSuccessMessage('')}
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button
              type="button"
              className="banner-close"
              onClick={() => setError('')}
            >
              ✕
            </button>
          </div>
        )}

        <div className="order-details-grid">
          <section className="order-details-card">
            <div className="order-details-box">
              <div className="order-details-row">
                <div>
                  <span className="order-details-label">Cliente</span>
                  <div>{order.customerName}</div>
                </div>
                <div>
                  <span className="order-details-label">Data do Pedido</span>
                  <div>{new Date(order.creationDate).toLocaleString('pt-BR')}</div>
                </div>
              </div>

              <div className="order-details-row">
                <div>
                  <span className="order-details-label">Descrição</span>
                  <div>{order.description}</div>
                </div>
                <div>
                  <span className="order-details-label">Status</span>
                  <div>{order.status}</div>
                </div>
              </div>

              <div className="order-details-row">
                <div>
                  <span className="order-details-label">Observação</span>
                  <div>{order.observation || 'Nenhuma observação informada'}</div>
                </div>
                <div>
                  <span className="order-details-label">Complemento</span>
                  <div>{order.complement || 'Nenhum complemento informado'}</div>
                </div>
              </div>

              <div className="order-address-box">
                <div className="order-address-title">Endereço de Entrega</div>
                <div>{order.address.street}, {order.address.number}</div>
                <div>{order.address.neighborhood}</div>
                <div>{order.address.zipCode}</div>
                <div>{order.address.complement || 'Sem complemento'}</div>
              </div>
            </div>
          </section>

          <section className="order-assign-card">
            <div className="order-assign-box">
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
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
