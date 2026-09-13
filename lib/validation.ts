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

export function validateNumber(
  value: string,
  label: string,
  options: { min?: number; integer?: boolean } = {},
) {
  if (!value.trim()) return "";

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
