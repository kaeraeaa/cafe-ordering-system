import { ZodError } from 'zod';

export function notFound(req, res) {
  res.status(404).json({ message: 'Маршрут не знайдено' });
}

export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Перевірте введені дані',
      errors: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  if (err?.code === 'P2002') {
    return res.status(409).json({ message: 'Запис з такими даними вже існує' });
  }

  if (err?.code === 'P2025') {
    return res.status(404).json({ message: 'Запис не знайдено' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Внутрішня помилка сервера'
  });
}
