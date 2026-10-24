import { z } from 'zod';

export const subjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres'),

  description: z
    .string()
    .trim()
    .max(300, 'La descripción no puede superar los 300 caracteres'),
});
