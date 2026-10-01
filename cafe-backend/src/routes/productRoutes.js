import { Router } from 'express';
import {
  getProducts, getProduct, getCategories,
  createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/', auth, adminOnly, createProduct);
router.put('/:id', auth, adminOnly, updateProduct);
router.delete('/:id', auth, adminOnly, deleteProduct);
export default router;
