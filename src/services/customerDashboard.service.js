import { getToken } from './auth';

export async function fetchCustomerOrders() {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/customer`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao obter pedidos do cliente');
  }

  return res.json().catch(() => null);
}

export default { fetchCustomerOrders };