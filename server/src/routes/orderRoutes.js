const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(createOrder).get(protect, admin, getAllOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:identifier', getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
