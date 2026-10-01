import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: 'Кава' }, update: {}, create: { name: 'Кава' } }),
    prisma.category.upsert({ where: { name: 'Чай' }, update: {}, create: { name: 'Чай' } }),
    prisma.category.upsert({ where: { name: 'Десерти' }, update: {}, create: { name: 'Десерти' } })
  ]);

  const [coffee, tea, desserts] = categories;

  const products = [
    { name: 'Капучино', description: 'Еспресо з молочною пінкою', price: 65, categoryId: coffee.id, imageUrl: '' },
    { name: 'Лате', description: 'Ніжна кава з молоком', price: 70, categoryId: coffee.id, imageUrl: '' },
    { name: 'Американо', description: 'Еспресо з гарячою водою', price: 50, categoryId: coffee.id, imageUrl: '' },
    { name: 'Зелений чай', description: 'Ароматний зелений чай', price: 55, categoryId: tea.id, imageUrl: '' },
    { name: 'Чізкейк', description: 'Ніжний вершковий десерт', price: 85, categoryId: desserts.id, imageUrl: '' }
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { name: product.name } });
    if (!existing) await prisma.product.create({ data: product });
  }

  const passwordHash = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@cafe.local' },
    update: { role: 'ADMIN' },
    create: {
      name: 'Адміністратор',
      email: 'admin@cafe.local',
      passwordHash,
      role: 'ADMIN'
    }
  });

  console.log('Seed завершено. Адмін: admin@cafe.local / Admin123!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
