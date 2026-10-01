import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().optional().nullable(),
  price: z.coerce.number().positive(),
  imageUrl: z.string().url().optional().nullable().or(z.literal('')),
  categoryId: z.coerce.number().int().positive(),
  isAvailable: z.boolean().optional()
});
