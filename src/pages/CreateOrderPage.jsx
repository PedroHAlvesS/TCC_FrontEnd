import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserEmail } from '../services/auth';
import { createOrder, getCustomerByEmail } from '../services/orderService';

export default function CreateOrderPage() {
  const [description, setDescription] = useState('');
  const [observation, setObservation] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [complement, setComplement] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setMessageType('');

    if (!description.trim() || !street.trim() || !number.trim() || !neighborhood.trim() || !zipCode.trim()) {
      setMessageType('error');
      setMessage('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setSaving(true);
      const customer = await getCustomerByEmail(getUserEmail());
      const payload = {
        customerId: String(customer.id),
        description: description.trim(),
        observation: observation.trim() || null,
        address: {
          street: street.trim(),
          number: number.trim(),
          neighborhood: neighborhood.trim(),
          zipCode: zipCode.trim(),
          complement: complement.trim() || null,
        },
      };

      await createOrder(payload);
      setMessageType('success');
      setMessage('Pedido criado com sucesso!');
      setDescription('');
      setObservation('');
      setStreet('');
      setNumber('');
      setNeighborhood('');
      setZipCode('');
      setComplement('');
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Erro ao criar pedido');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-shell">
      <main className="login-container">
        <div className="login-card">
          <button type="button" className="secondary-button" onClick={() => navigate('/cliente-dashboard')}>
            Voltar
          </button>
          <h2>Novo Pedido</h2>
          <p className="subtitle">Preencha os dados para solicitar uma entrega</p>
          <form onSubmit={handleSubmit} className="login-form">
            <label>
              Descrição do pedido
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Livro de Java" required />
            </label>
            <label>
              Observação
              <textarea value={observation} onChange={(e) => setObservation(e.target.value)} placeholder="Instruções adicionais" />
            </label>
            <label>
              Rua
              <input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Rua das Flores" required />
            </label>
            <label>
              Número
              <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="123" required />
            </label>
            <label>
              Bairro
              <input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Centro" required />
            </label>
            <label>
              CEP
              <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="12345-678" required />
            </label>
            <label>
              Complemento
              <input value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Apto 101" />
            </label>
            {message ? <div className={messageType === 'error' ? 'error-message' : 'success-banner'}>{message}</div> : null}
            <button type="submit" className="submit-button" disabled={saving}>
              {saving ? 'Criando...' : 'Criar Pedido'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
