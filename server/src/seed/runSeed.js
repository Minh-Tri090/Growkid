const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { categoriesData, productsData } = require('./seedData');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/growkid';
    await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected to ${mongoUri} for seeding...`);

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    console.log('[Seed] Cleared existing data.');

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

    console.log('[Seed] Created default users:');
    console.log(' - Admin: admin@growkid.vn / admin123@GrowKid');
    console.log(' - Customer: lananh@gmail.com / user123@GrowKid');

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`[Seed] Created ${createdCategories.length} categories.`);

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
          {
            name: 'Ba Tùng Lâm',
            rating: 5,
            comment: 'Bé nhà mình rất thích. Đồ xịn sò, chuẩn chính hãng.',
            user: customerUser._id,
          },
        ],
      };
    });

    const createdProducts = await Product.insertMany(preparedProducts);
    console.log(`[Seed] Created ${createdProducts.length} rich products.`);

    await Order.create({
      orderCode: 'GK260904-1001',
      user: customerUser._id,
      customerInfo: {
        name: 'Mẹ Bỉm Sữa Lan Anh',
        phone: '0987654321',
        email: 'lananh@gmail.com',
        note: 'Giao trong giờ hành chính giúp em ạ',
      },
      shippingAddress: {
        street: 'Số 25 ngõ 120 Hoàng Quốc Việt',
        ward: 'Cổ Nhuế 1',
        district: 'Bắc Từ Liêm',
        city: 'Hà Nội',
      },
      paymentMethod: 'COD',
      orderItems: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: createdProducts[0].price,
          quantity: 2,
        },
      ],
      itemsPrice: createdProducts[0].price * 2,
      shippingPrice: 30000,
      discountPrice: 0,
      totalPrice: createdProducts[0].price * 2 + 30000,
      isPaid: false,
      status: 'confirmed',
    });

    console.log('[Seed] Sample order created successfully.');
    console.log('===> SEED DATABASE COMPLETED SUCCESSFULLY <===');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
};

seedDatabase();
