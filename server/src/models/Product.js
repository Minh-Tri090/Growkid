const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên sản phẩm'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    brand: {
      type: String,
      default: 'GrowKid',
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Vui lòng chọn danh mục'],
    },
    ageGroup: {
      type: String,
      enum: ['0-12m', '1-3y', '3-6y', '6y+', 'all'],
      default: 'all',
      required: true,
    },
    gender: {
      type: String,
      enum: ['boy', 'girl', 'unisex'],
      default: 'unisex',
    },
    description: {
      type: String,
      required: [true, 'Vui lòng nhập mô tả sản phẩm'],
    },
    specifications: {
      material: { type: String, default: '100% Cotton Organic an toàn cho da bé' },
      origin: { type: String, default: 'Việt Nam / Nhập khẩu chính hãng' },
      safetyStandard: { type: String, default: 'Đạt chứng nhận an toàn cho trẻ sơ sinh & trẻ nhỏ' },
      size: { type: String, default: 'Đủ kích cỡ theo chuẩn tháng tuổi' },
    },
    price: {
      type: Number,
      required: [true, 'Vui lòng nhập giá bán'],
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    countInStock: {
      type: Number,
      required: true,
      default: 50,
      min: 0,
    },
    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    flashSaleDiscount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  if (this.originalPrice > this.price && this.originalPrice > 0) {
    this.discountPercentage = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  } else if (!this.originalPrice || this.originalPrice < this.price) {
    this.originalPrice = this.price;
    this.discountPercentage = 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
