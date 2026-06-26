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

export async function fetchCustomers() {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/customers`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao obter clientes');
  }

  return res.json().catch(() => null);
}

export async function createDeliveryMan(deliveryData) {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delivery-men`, {
    method: 'POST',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        },
    body: JSON.stringify(deliveryData),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao criar entregador');
  }

  return res.json().catch(() => null);
}

export async function updateDeliveryMan(deliveryManId, deliveryData) {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delivery-men/${deliveryManId}`, {
    method: 'PUT',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        },
    body: JSON.stringify(deliveryData),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao atualizar entregador');
  }

  return res.json().catch(() => null);
}

export async function deleteDeliveryMan(deliveryManId) {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delivery-men/${deliveryManId}`, {
    method: 'DELETE',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao excluir entregador');
  }

  return res.json().catch(() => null);
}

export async function fetchDeliveryManOrders(deliveryManId) {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/delivery-man/${deliveryManId}`, {
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

export async function fetchCustomerOrders(customerId) {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/customer/${customerId}`, {
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

export async function assignOrderToDeliveryMan(orderId, deliveryManId) {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/assign`, {
    method: 'PUT',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        },
    body: JSON.stringify({ deliveryManId }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao atribuir pedido ao entregador');
  }

  return res.json().catch(() => null);
}

export async function fetchCustomerOrdersByEmail(email) {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/customer/email/${email}`, {
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

export async function fetchDeliveryManOrdersByEmail(email) {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/delivery-man/email/${encodeURIComponent(email)}`, {
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

export async function updateDeliveryManOrderStatus(orderId, status, email) {
  const token = getToken();
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/status/${email}`, {
    method: 'PUT',
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        },
    body: JSON.stringify({ status, email }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao atualizar status do pedido');
  }

  return res.json().catch(() => null);
}

export default { fetchOrders, fetchAdminProfile, fetchDeliveryMen, fetchCustomers, createDeliveryMan, updateDeliveryMan, deleteDeliveryMan, fetchDeliveryManOrders, fetchCustomerOrders, fetchCustomerOrdersByEmail, fetchDeliveryManOrdersByEmail, updateDeliveryManOrderStatus, assignOrderToDeliveryMan };
