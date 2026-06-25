import { login } from '../services/authService';
import { setToken } from '../services/auth';

import { setUserEmail } from '../services/auth';

export async function handleLogin({ usuario, senha, onSuccess, onError }) {
  try {
    const data = await login(usuario, senha);
    if (data && data.token) {
      setToken(data.token);
      setUserEmail(usuario);
    }
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}
