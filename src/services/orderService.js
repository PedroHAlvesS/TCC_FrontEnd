import { getToken } from './auth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export async function createOrder(orderData) {
  const token = getToken();
  const response = await fetch(`${BACKEND_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao criar pedido');
  }

  return response.json().catch(() => null);
}

export async function getCustomerByEmail(email) {
  const token = getToken();
  const response = await fetch(`${BACKEND_URL}/api/customers/email/${encodeURIComponent(email)}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao carregar cliente');
  }

  return response.json().catch(() => null);
}
