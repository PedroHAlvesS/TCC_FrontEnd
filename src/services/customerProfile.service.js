import { getToken, getUserEmail } from './auth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export async function fetchCustomerProfile() {
  const token = getToken();
  const res = await fetch(`${BACKEND_URL}/api/customers/email`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao obter perfil de cliente');
  }

  return res.json().catch(() => null);
}

export async function updateCustomerProfile(profileData) {
  const token = getToken();
  const res = await fetch(`${BACKEND_URL}/api/customers`, {
    method: 'PUT',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {},
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao atualizar perfil de cliente');
  }

  return res.json().catch(() => null);
}

export async function deleteCustomerAccount() {
  const token = getToken();
  const res = await fetch(`${BACKEND_URL}/api/customers`, {
    method: 'DELETE',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao excluir conta de cliente');
  }

  return res.json().catch(() => null);
}
