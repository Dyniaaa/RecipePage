export type FieldErrors = Record<string, string>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value: string) {
  if (!value.trim()) return "Email jest wymagany.";
  if (!emailPattern.test(value.trim())) return "Podaj poprawny adres email.";
  return "";
}

export function validateRequired(value: string, label: string) {
  if (!value.trim()) return `${label} jest wymagane.`;
  return "";
}

export function validatePassword(value: string) {
  if (!value) return "Hasło jest wymagane.";
  if (value.length < 6) return "Hasło musi mieć co najmniej 6 znaków.";
  if (!/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(value)) {
    return "Hasło musi zawierać co najmniej jedną wielką literę.";
  }
  if (!/[^a-zA-Z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż]/.test(value)) {
    return "Hasło musi zawierać co najmniej jeden znak specjalny.";
  }
  return "";
}

export function validateNumber(
  value: string,
  label: string,
  options: { min?: number; integer?: boolean; required?: boolean } = {},
) {
  if (!value.trim()) return options.required ? `${label} jest wymagane.` : "";

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return `${label} musi być liczbą.`;
  if (options.integer && !Number.isInteger(parsed)) {
    return `${label} musi być liczbą całkowitą.`;
  }
  if (options.min !== undefined && parsed < options.min) {
    return `${label} musi wynosić co najmniej ${options.min}.`;
  }

  return "";
}
