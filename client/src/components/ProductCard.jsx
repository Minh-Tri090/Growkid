import React from 'react';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ';
};

const ageLabels = {
  '0-12m': '0 - 12 tháng',
  '1-3y': '1 - 3 tuổi',
  '3-6y': '3 - 6 tuổi',
  '6y+': 'Trên 6 tuổi',
  'all': 'Mọi lứa tuổi',
};

const ProductCard = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();

  const handleCardClick = () => {
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-wrap">
        <img
          src={product.images && product.images.length ? product.images[0] : 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />

        <div className="product-badges">
          {discountPercent > 0 && (
            <span className="badge badge-sale">-{discountPercent}%</span>
          )}
          {product.ageGroup && (
            <span className="badge badge-age">{ageLabels[product.ageGroup] || product.ageGroup}</span>
          )}
          {product.isFlashSale && (
            <span className="badge badge-featured">⚡ Flash Sale</span>
          )}
        </div>
      </div>

      <div className="product-card-body">
        <div className="product-meta-row">
          <span className="product-brand">{product.brand || 'TCT'}</span>
          <span className="product-rating">
            <Star size={12} fill="#D97706" color="#D97706" />
            <span>{product.rating || 5.0}</span>
            <span className="product-rating-count">({product.numReviews || 0})</span>
          </span>
        </div>

        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        <div className="product-price-row">
          <span className="product-price">{formatCurrency(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="product-original-price">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="product-actions">
          <button
            className="btn btn-outline btn-sm btn-block btn-add-cart"
            onClick={handleAddToCart}
            title="Thêm vào giỏ hàng"
          >
            <ShoppingBag size={15} />
            <span>Thêm giỏ hàng</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
