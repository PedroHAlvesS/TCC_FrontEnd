import { getToken, getUserEmail } from './auth';

export async function fetchOrders() {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao obter pedidos');
  }

  return res.json().catch(() => null);
}

export async function fetchAdminProfile() {
  const token = getToken();
  const email = getUserEmail();
  if (!email) {
    throw new Error('Email de admin não encontrado');
  }

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admins/email/${encodeURIComponent(email)}`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao obter perfil de admin');
  }

  return res.json().catch(() => null);
}

export async function fetchDeliveryMen() {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delivery-men`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao obter entregadores');
  }

  return res.json().catch(() => null);
}

export default { fetchOrders, fetchAdminProfile, fetchDeliveryMen };
