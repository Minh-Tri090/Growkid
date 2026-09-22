const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFlashSaleProducts,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.get('/special/flash-sale', getFlashSaleProducts);
router
  .route('/:identifier')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
