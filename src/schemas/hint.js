import { z } from 'zod';

export const hintSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'El contenido es obligatorio')
    .min(3, 'El contenido debe tener al menos 3 caracteres'),

  cardId: z.coerce
    .number()
    .int('El ID de la tarjeta debe ser un número entero')
    .positive('Ingresá el ID de una tarjeta válida'),
});
