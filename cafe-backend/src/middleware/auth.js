import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Потрібна авторизація' });
    }

    const token = header.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.userId) },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) return res.status(401).json({ message: 'Користувача не знайдено' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Недійсний або прострочений токен' });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Доступ лише для адміністратора' });
  }
  next();
}
