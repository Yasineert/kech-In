/**
 * Form validation helpers shared by the authentication screens.
 * Pure functions: no React Native imports, so they are unit-testable in Node.
 */

export type ValidationResult = {valid: true} | {valid: false; error: string};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const MIN_PASSWORD_LENGTH = 8;

const ok: ValidationResult = {valid: true};
const fail = (error: string): ValidationResult => ({valid: false, error});

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

/** Requires a minimum length, at least one letter and at least one digit. */
export function isStrongPassword(password: string): boolean {
  return (
    password.length >= MIN_PASSWORD_LENGTH &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
}

export function validateLogin(email: string, password: string): ValidationResult {
  if (email.trim() === '' || password === '') {
    return fail('Veuillez remplir tous les champs.');
  }
  if (!isValidEmail(email)) {
    return fail('Adresse e-mail invalide.');
  }
  return ok;
}

export function validateRegistration(input: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const {fullName, email, password, confirmPassword} = input;
  if (
    fullName.trim() === '' ||
    email.trim() === '' ||
    password === '' ||
    confirmPassword === ''
  ) {
    return fail('Veuillez remplir tous les champs.');
  }
  if (!isValidEmail(email)) {
    return fail('Adresse e-mail invalide.');
  }
  if (!isStrongPassword(password)) {
    return fail(
      `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères, dont une lettre et un chiffre.`,
    );
  }
  if (password !== confirmPassword) {
    return fail('Les mots de passe ne correspondent pas.');
  }
  return ok;
}
