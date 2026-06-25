import { createAuthPayload } from '../models/authModel';

export async function login(email, password) {
  
  const payload = createAuthPayload(email, password);

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new Error(data?.message || 'Usuário ou senha inválidos');
  }

  return response.json().catch(() => null);
}
