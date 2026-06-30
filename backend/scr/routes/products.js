import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductsByTag,
  createProduct,
  seedProducts
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/search', getProducts);
router.get('/tag/:tag', getProductsByTag);
router.get('/seed', seedProducts); // Temporary seed endpoint
router.get('/:slug', getProductBySlug);
router.post('/', createProduct);

export default router;
