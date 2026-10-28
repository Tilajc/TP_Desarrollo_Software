import { z } from 'zod';

export const courseSchema = z.object({
  authorId: z.coerce
    .number()
    .int('El autor no es válido')
    .positive('Seleccioná un autor')
    .optional(),

  subjectId: z.coerce
    .number()
    .int('La materia no es válida')
    .positive('Seleccioná una materia'),
});
