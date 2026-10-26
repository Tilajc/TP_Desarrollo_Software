import { z } from 'zod';

export const cardSchema = z.object({
  question: z
    .string()
    .trim()
    .min(1, 'La pregunta es obligatoria')
    .min(3, 'La pregunta debe tener al menos 3 caracteres'),

  answer: z.string().trim().min(1, 'La respuesta es obligatoria'),

  hint: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || value.length >= 3,
      'La pista debe tener al menos 3 caracteres'
    )
    .optional(),
});
