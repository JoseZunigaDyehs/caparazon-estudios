export type Validator = (value: string) => string | null;

export const validators: Record<string, Validator> = {
  required: (value) => {
    return value.trim() ? null : "Este campo es obligatorio.";
  },
  email: (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? null
      : "Ingresa un correo válido.";
  },
  whatsapp: (value) => {
    const limpio = value.replace(/[^\d+]/g, "");
    return limpio.length >= 8
      ? null
      : "Ingresa un número de WhatsApp válido.";
  },
};

export function validateField(
  value: string,
  validatorKeys?: string[],
): string | null {
  if (!validatorKeys || validatorKeys.length === 0) return null;

  for (const key of validatorKeys) {
    const validator = validators[key];
    if (!validator) continue;
    const error = validator(value);
    if (error) return error;
  }

  return null;
}

export function validateStepAnswer(
  value: string,
  stepQuestion: string,
): string | null {
  return value.trim()
    ? null
    : `Selecciona una opción para continuar en: ${stepQuestion}`;
}
