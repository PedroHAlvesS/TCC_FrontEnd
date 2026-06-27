import { login } from '../services/authService';
import { setToken } from '../services/auth';

import { setUserEmail } from '../services/auth';

export async function handleLogin({ email, password, onSuccess, onError }) {
  try {
    const data = await login(email, password);
    if (data && data.token) {
      setToken(data.token);
      setUserEmail(email);
    }
    onSuccess();
  } catch (error) {
    onError(error.message);
  }
}
