import { z } from 'zod';

export const postValidate = z.object({
   title: z
    .string()
    .min(2, 'Name too short')
    .max(50, 'Name too long')
    .trim()
    .regex(/^[a-zA-Z\s]+$/, 'Title must contain only letters and spaces'),
  description: z.string().trim().optional(),
  status: z.string().optional(),
  user_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional()
});

export const postUpdate = z.object({
  title: z
    .string()
    .min(2, 'Name too short')
    .max(50, 'Name too long')
    .trim()
    .regex(/^[a-zA-Z\s]+$/, 'Title must contain only letters and spaces'),
  description: z.string().trim().optional(),
  status: z.string().optional(),
  user_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID').optional()
});