import prisma from '../config/prisma.js';
import { productSchema } from '../validators/product.js';

export async function getProducts(req, res) {
  const { categoryId, search } = req.query;
  const products = await prisma.product.findMany({
    where: {
      ...(categoryId ? { categoryId: Number(categoryId) } : {}),
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {})
    },
    include: { category: true },
    orderBy: { id: 'desc' }
  });
  res.json(products);
}

export async function getCategories(req, res) {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json(categories);
}

export async function getProduct(req, res) {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true }
  });
  if (!product) return res.status(404).json({ message: 'Товар не знайдено' });
  res.json(product);
}

export async function createProduct(req, res) {
  const data = productSchema.parse(req.body);
  const product = await prisma.product.create({ data });
  res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const data = productSchema.partial().parse(req.body);
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data
  });
  res.json(product);
}

export async function deleteProduct(req, res) {
  const id = Number(req.params.id);
  const usedInOrders = await prisma.orderItem.count({ where: { productId: id } });

  if (usedInOrders > 0) {
    const product = await prisma.product.update({
      where: { id },
      data: { isAvailable: false }
    });
    return res.json({ message: 'Товар приховано, оскільки він вже є в замовленнях', product });
  }

  await prisma.product.delete({ where: { id } });
  res.json({ message: 'Товар видалено' });
}
