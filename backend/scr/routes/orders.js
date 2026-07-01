import express from 'express';
import { createOrder, getOrder, updateOrderStatus } from '../controllers/orderController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, updateOrderStatus);

export default router;
