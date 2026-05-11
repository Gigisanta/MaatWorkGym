// GymPro Input Validation
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}
export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\\w+=/gi, '')
    .trim()
    .slice(0, 255);
}
export function validateUsername(username: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof username !== 'string') {
    errors.push('Usuario debe ser una cadena de texto');
    return { valid: false, errors };
  }
  if (username.length < 3) errors.push('Usuario debe tener al menos 3 caracteres');
  if (username.length > 50) errors.push('Usuario no puede exceder 50 caracteres');
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) errors.push('Usuario solo puede contener letras');
  return { valid: errors.length === 0, errors };
}
export function validatePassword(password: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof password !== 'string') {
    errors.push('Contrasenia debe ser una cadena de texto');
    return { valid: false, errors };
  }
  if (password.length < 8) errors.push('Contrasenia debe tener al menos 8 caracteres');
  if (password.length > 128) errors.push('Contrasenia no puede exceder 128 caracteres');
  return { valid: errors.length === 0, errors };
}
export function validateDNI(dni: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof dni !== 'string') {
    errors.push('DNI debe ser una cadena de texto');
    return { valid: false, errors };
  }
  const clean = dni.replace(/[.-]/g, '');
  if (!/^\d{7,8}$/.test(clean)) errors.push('DNI debe tener 7 u 8 digitos');
  return { valid: errors.length === 0, errors };
}
export function validateEmail(email: unknown): ValidationResult {
  const errors: string[] = [];
  if (typeof email !== 'string') {
    errors.push('Email debe ser una cadena de texto');
    return { valid: false, errors };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Formato de email invalido');
  if (email.length > 254) errors.push('Email no puede exceder 254 caracteres');
  return { valid: errors.length === 0, errors };
}
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  allowedFields: string[],
): Partial<T> {
  const r: Partial<T> = {};
  for (const k of allowedFields) {
    if (k in obj) (r as Record<string, unknown>)[k] = sanitizeString(obj[k]);
  }
  return r;
}
