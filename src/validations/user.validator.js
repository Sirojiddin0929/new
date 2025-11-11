import { z } from 'zod';

export const userValidate = z
  .object({
    username: z
      .string()
      .min(2, 'Name too short')
      .max(50, 'Name too long')
      .trim()
      .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
    phone: z.string().regex(/^\+\d{10,15}$/, 'Invalid phone number'),
    email: z.string().email(),
    password: z.string().min(8, `TOO SHORT FOR A PASSWORD`).max(30, `TOO LONG FOR A PASSWORD`)
  });

export const userUpdate = z
  .object({
    username: z
      .string()
      .min(2, 'Name too short')
      .max(50, 'Name too long')
      .trim()
      .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces')
      .optional(),
    phone: z
      .string()
      .regex(/^\+\d{10,15}$/, 'Invalid phone number')
      .optional(),
      email: z.string().email().optional(),
    password: z.string().min(8, `TOO SHORT FOR A PASSWORD`).max(30, `TOO LONG FOR A PASSWORD`).optional()
  });