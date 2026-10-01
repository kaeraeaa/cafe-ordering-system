import prisma from '../config/prisma.js';
import { orderSchema, orderStatusSchema } from '../validators/order.js';

const orderInclude = {
  items: { include: { product: true } },
  user: { select: { id: true, name: true, email: true } }
};

export async function createOrder(req, res) {
  const data = orderSchema.parse(req.body);
  const productIds = data.items.map(item => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, isAvailable: true } });

  if (products.length !== new Set(productIds).size) {
    return res.status(400).json({ message: 'Один або декілька товарів недоступні' });
  }

  const byId = new Map(products.map(product => [product.id, product]));
  const total = data.items.reduce((sum, item) => {
    const product = byId.get(item.productId);
    return sum + Number(product.price) * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      userId: req.user.id,
      total,
      items: {
        create: data.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: byId.get(item.productId).price
        }))
      }
    },
    include: orderInclude
  });

  res.status(201).json(order);
}

export async function getMyOrders(req, res) {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
}

export async function getAllOrders(req, res) {
  const orders = await prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
}

export async function updateOrderStatus(req, res) {
  const data = orderStatusSchema.parse(req.body);
  const order = await prisma.order.update({
    where: { id: Number(req.params.id) },
    data: { status: data.status },
    include: orderInclude
  });
  res.json(order);
}
