import { Router } from 'express';
import { auth, adminOnly } from '../middleware/auth.js';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = Router();
router.post('/', auth, createOrder);
router.get('/my', auth, getMyOrders);
router.get('/', auth, adminOnly, getAllOrders);
router.patch('/:id/status', auth, adminOnly, updateOrderStatus);
export default router;
