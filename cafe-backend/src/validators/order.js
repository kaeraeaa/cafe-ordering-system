import { z } from 'zod';

export const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.coerce.number().int().positive(),
      quantity: z.coerce.number().int().min(1).max(20)
    })
  ).min(1, 'Кошик не може бути порожнім')
});

export const orderStatusSchema = z.object({
  status: z.enum(['NEW', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'])
});
