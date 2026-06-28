import { getToken } from './auth';

export async function fetchDeliveryManOrders() {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/delivery-man`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao obter pedidos do entregador');
  }

  return res.json().catch(() => null);
}

export async function fetchDeliveryManProfile() {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delivery-men/email`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao obter perfil de entregador');
  }

  return res.json().catch(() => null);
}

export default { fetchDeliveryManOrders, fetchDeliveryManProfile };