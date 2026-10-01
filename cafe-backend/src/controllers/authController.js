import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { registerSchema, loginSchema } from '../validators/auth.js';

function signToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function register(req, res) {
  const data = registerSchema.parse(req.body);
  const email = data.email.toLowerCase();

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ message: 'Користувач з таким email вже існує' });

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({
    data: { name: data.name, email, passwordHash },
    select: { id: true, name: true, email: true, role: true }
  });

  res.status(201).json({ user, token: signToken(user) });
}

export async function login(req, res) {
  const data = loginSchema.parse(req.body);
  const email = data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    return res.status(401).json({ message: 'Неправильний email або пароль' });
  }

  const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({ user: safeUser, token: signToken(safeUser) });
}

export async function me(req, res) {
  res.json({ user: req.user });
}
