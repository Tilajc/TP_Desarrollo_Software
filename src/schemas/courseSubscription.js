import { z } from 'zod';

export const courseSubscriptionSchema = z.object({
  courseId: z.coerce
    .number()
    .int('El ID del curso debe ser un número entero')
    .positive('Ingresá el ID de un curso válido'),

  subscriberId: z.coerce
    .string()
    .refine(
      (value) => value === '' || /^[1-9]\d*$/.test(value),
      'Ingresá el ID de un usuario válido'
    )
    .optional(),
});
