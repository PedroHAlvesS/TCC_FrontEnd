const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

export async function createClientProfile(profileData) {
  const response = await fetch(`${BACKEND_URL}/api/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || 'Erro ao criar cadastro de cliente');
  }

  return response.json().catch(() => null);
}

export default { createClientProfile };
