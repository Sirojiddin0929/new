import { z } from 'zod';

export const blogValidate = z
  .object({
    user_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid USER ID').optional(),
    isPrivate: z.boolean().optional(),
    title: z.string(),
    content: z.string().optional()
  })

export const blogUpdate = z
    .object({
    user_id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid USER ID').optional(),
    isPrivate: z.boolean().optional(),
    title: z.string().optional(),
    content: z.string().optional()
    });