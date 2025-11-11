import { z } from 'zod';


export const loginValidate = z
  .object({
    email: z.string().email().trim().toLowerCase(),
    password: z
      .string()
      .min(8, `TOO SHORT PASSWORD`)
      .max(30, `TOO LONG PASSWORD`),
  });

export const registerValidate = z
  .object({
    email: z.string().email().trim().toLowerCase(),
    password: z
      .string()
      .min(8, `TOO SHORT PASSWORD`)
      .max(30, `TOO LONG PASSWORD`)
      .trim(),
    name: z
      .string()
      .min(2, 'Name too short')
      .max(50, 'Name too long')
      .trim()
      .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
    phone: z
      .string()
      .regex(/^\+\d{10,15}$/, 'Invalid phone number')
      .optional(),
    vehicle_number: z
      .string()
      .min(3, 'Vehicle Number Too short')
      .max(10, 'Vehicle Number Too long')
      .trim()
      .optional(),
    district_id: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid district ID')
      .optional(),
    role: z.enum(['staff', 'customer']).optional()
  });

  export const adminValidate = z
  .object({
    email: z.string().email().trim().toLowerCase(),
    password: z
      .string()
      .min(8, `TOO SHORT PASSWORD`)
      .max(30, `TOO LONG PASSWORD`)
      .trim(),
    name: z
      .string()
      .min(2, 'Name too short')
      .max(50, 'Name too long')
      .trim()
      .regex(/^[a-zA-Z\s]+$/, 'Name must contain only letters and spaces'),
    phone: z
      .string()
      .regex(/^\+\d{10,15}$/, 'Invalid phone number')
      .optional(),
    role: z.enum(['admin']).optional()
  });