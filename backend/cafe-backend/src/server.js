import 'dotenv/config';
import app from './app.js';
import prisma from './config/prisma.js';

const PORT = Number(process.env.PORT) || 5000;

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error('Помилка: заповніть DATABASE_URL та JWT_SECRET у файлі .env');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Backend запущено: http://localhost:${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
