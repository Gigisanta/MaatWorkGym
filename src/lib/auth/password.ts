import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function isPasswordStrong(password: string): {
  valid: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (password.length < 8) {
    reasons.push('La contraseña debe tener al menos 8 caracteres');
  }
  if (!/[A-Z]/.test(password)) {
    reasons.push('La contraseña debe contener al menos una mayúscula');
  }
  if (!/[a-z]/.test(password)) {
    reasons.push('La contraseña debe contener al menos una minúscula');
  }
  if (!/[0-9]/.test(password)) {
    reasons.push('La contraseña debe contener al menos un número');
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}
