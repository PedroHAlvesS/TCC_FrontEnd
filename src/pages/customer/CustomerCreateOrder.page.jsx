import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/customerDashboard.service';
import { fetchAddressByZipCode } from '../../services/cep.service';

export default function CustomerCreateOrderPage() {
  const [description, setDescription] = useState('');
  const [observation, setObservation] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [complement, setComplement] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [addressFetched, setAddressFetched] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [cepError, setCepError] = useState('');
  const navigate = useNavigate();

  async function handleCepChange(value) {
    setZipCode(value);
    setCepError('');

    const digits = value.replace(/\D/g, '');

    if (digits.length !== 8) {
      setAddressFetched(false);
      setStreet('');
      setNeighborhood('');
      return;
    }

    setLoadingCep(true);
    setAddressFetched(false);

    try {
      const address = await fetchAddressByZipCode(digits);
      setStreet(address.street);
      setNeighborhood(address.neighborhood);
      setAddressFetched(true);
    } catch (err) {
      setCepError(err.message || 'CEP inválido ou não encontrado.');
      setStreet('');
      setNeighborhood('');
      setAddressFetched(false);
    } finally {
      setLoadingCep(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setMessageType('');

    if (!description.trim() || !zipCode.trim() || !addressFetched || !number.trim()) {
      setMessageType('error');
      setMessage('Preencha a descrição, informe um CEP válido e o número do endereço.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
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
      setAddressFetched(false);
      setCepError('');
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
              CEP
              <input value={zipCode} onChange={(e) => handleCepChange(e.target.value)} placeholder="12345-678" />
            </label>
            {loadingCep ? <div className="info-message">Consultando CEP...</div> : null}
            {cepError ? <div className="error-message">{cepError}</div> : null}
            {addressFetched ? (
              <>
                <label>
                  Rua
                  <input value={street} readOnly />
                </label>
                <label>
                  Bairro
                  <input value={neighborhood} readOnly />
                </label>
                <label>
                  Número
                  <input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="123" required />
                </label>
                <label>
                  Complemento
                  <input value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Apto 101" />
                </label>
              </>
            ) : null}
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
