import { z } from 'zod';

const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede superar los 50 caracteres'),

  lastName: z
    .string()
    .trim()
    .min(1, 'El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede superar los 50 caracteres'),

  email: z.string().trim().email('El formato de email no es válido'),

  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),

  role: z.enum(['ADMIN', 'USER'], { message: 'Seleccioná un rol válido' }),
});

const editUserSchema = userSchema.extend({
  password: z
    .string()
    .refine(
      (value) => value === '' || value.length >= 6,
      'La contraseña debe tener al menos 6 caracteres'
    ),
});

export const getUserSchema = (isEditing) =>
  isEditing ? editUserSchema : userSchema;
