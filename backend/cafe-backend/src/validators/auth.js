import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Ім’я має містити щонайменше 2 символи'),
  email: z.string().trim().email('Некоректний email'),
  password: z.string().min(6, 'Пароль має містити щонайменше 6 символів')
});

export const loginSchema = z.object({
  email: z.string().trim().email('Некоректний email'),
  password: z.string().min(1, 'Введіть пароль')
});
