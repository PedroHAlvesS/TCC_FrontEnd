export function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function isValidPhoneNumber(phone) {
  if (!phone) return false;
  const digits = String(phone).replace(/\D/g, '');
  return digits.length === 11 && /^[0-9]+$/.test(digits);
}

export function isValidPassword(password) {
  if (!password) return false;
  return String(password).length >= 6;
}

export function validateProfile({ email, phone, password }, { requirePassword = false } = {}) {
  const errors = {};
  if (!isValidEmail(email)) errors.email = 'E-mail inválido';
  if (!isValidPhoneNumber(phone)) errors.phone = 'Telefone deve ter 11 dígitos numéricos';
  if (requirePassword) {
    if (!isValidPassword(password)) errors.password = 'Senha deve ter ao menos 6 caracteres';
  } else if (password) {
    // only validate if provided
    if (!isValidPassword(password)) errors.password = 'Senha deve ter ao menos 6 caracteres';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export default { isValidEmail, isValidPhoneNumber, isValidPassword, validateProfile };
