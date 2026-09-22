const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      customerInfo,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      discountPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm nào trong đơn hàng' });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.phone) {
      return res.status(400).json({ message: 'Vui lòng cung cấp họ tên và số điện thoại người nhận' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({ message: 'Vui lòng cung cấp địa chỉ nhận hàng chi tiết' });
    }

    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `GK${dateStr}-${randNum}`;

    const order = new Order({
      orderCode,
      user: req.user ? req.user._id : null,
      orderItems,
      customerInfo,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      itemsPrice,
      shippingPrice: shippingPrice !== undefined ? shippingPrice : 30000,
      discountPrice: discountPrice || 0,
      totalPrice,
      isPaid: false,
      status: 'pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { identifier } = req.params;
    let order;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(identifier).populate('user', 'name email phone');
    } else {
      order = await Order.findOne({ orderCode: identifier }).populate('user', 'name email phone');
    }

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const count = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (currentPage - 1));

    res.json({
      orders,
      page: currentPage,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, isPaid } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      if (status) order.status = status;
      if (isPaid !== undefined) {
        order.isPaid = isPaid;
        if (isPaid && !order.paidAt) {
          order.paidAt = Date.now();
        }
      }
      if (status === 'delivered' && !order.deliveredAt) {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
