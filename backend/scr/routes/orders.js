import express from 'express';
import { createOrder, getOrder, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/:id', getOrder);
router.put('/:id/status', updateOrderStatus);

export default router;
