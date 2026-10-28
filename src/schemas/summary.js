import { z } from 'zod';

export const summarySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio')
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede superar los 100 caracteres'),

  content: z.string().trim().min(1, 'El contenido es obligatorio'),
});
