const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { categoriesData, productsData } = require('../seed/seedData');

router.post('/', async (req, res) => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const adminUser = await User.create({
      name: 'Quản trị viên GrowKid',
      email: 'admin@growkid.vn',
      password: 'admin123@GrowKid',
      phone: '0901234567',
      role: 'admin',
    });

    const customerUser = await User.create({
      name: 'Mẹ Bỉm Sữa Lan Anh',
      email: 'lananh@gmail.com',
      password: 'user123@GrowKid',
      phone: '0987654321',
      role: 'customer',
      address: {
        street: 'Số 25 ngõ 120 Hoàng Quốc Việt',
        ward: 'Cổ Nhuế 1',
        district: 'Bắc Từ Liêm',
        city: 'Hà Nội',
      },
    });

    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    const preparedProducts = productsData.map((prod) => {
      const { categorySlug, ...rest } = prod;
      return {
        ...rest,
        category: categoryMap[categorySlug] || createdCategories[0]._id,
        reviews: [
          {
            name: 'Mẹ Bảo An',
            rating: 5,
            comment: 'Sản phẩm tuyệt vời, chất liệu sờ rất thích và đóng gói cẩn thận. Giao hàng nhanh lắm!',
            user: customerUser._id,
          },
        ],
      };
    });

    const createdProducts = await Product.insertMany(preparedProducts);

    res.json({
      message: 'Nạp dữ liệu mẫu thành công!',
      categoriesCount: createdCategories.length,
      productsCount: createdProducts.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
