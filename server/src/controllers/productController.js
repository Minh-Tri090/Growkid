const Product = require('../models/Product');
const Category = require('../models/Category');

const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      ageGroup,
      minPrice,
      maxPrice,
      sortBy,
      isFeatured,
      isFlashSale,
      page = 1,
      limit = 24,
    } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    if (ageGroup && ageGroup !== 'all') {
      query.ageGroup = { $in: [ageGroup, 'all'] };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    if (isFlashSale === 'true') {
      query.isFlashSale = true;
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === 'price-asc') sortOption = { price: 1 };
    else if (sortBy === 'price-desc') sortOption = { price: -1 };
    else if (sortBy === 'rating') sortOption = { rating: -1 };
    else if (sortBy === 'popular') sortOption = { numReviews: -1 };

    const pageSize = Number(limit);
    const currentPage = Number(page);
    const count = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (currentPage - 1));

    res.json({
      products,
      page: currentPage,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: identifier }).populate('category', 'name slug');
    }

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFlashSale: true })
      .populate('category', 'name slug')
      .limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user && r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Bạn đã gửi đánh giá cho sản phẩm này rồi' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Đánh giá đã được thêm thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      brand,
      category,
      ageGroup,
      gender,
      description,
      specifications,
      price,
      originalPrice,
      images,
      countInStock,
      isFeatured,
      isFlashSale,
    } = req.body;

    const genSlug = slug || name.toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      + '-' + Date.now().toString().slice(-4);

    const product = new Product({
      name,
      slug: genSlug,
      brand: brand || 'GrowKid',
      category,
      ageGroup: ageGroup || 'all',
      gender: gender || 'unisex',
      description,
      specifications: specifications || {},
      price,
      originalPrice: originalPrice || price,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80'],
      countInStock: countInStock !== undefined ? countInStock : 50,
      isFeatured: isFeatured || false,
      isFlashSale: isFlashSale || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Đã xóa sản phẩm thành công' });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getFlashSaleProducts,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
};
