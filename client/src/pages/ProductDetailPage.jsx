import React, { useState } from 'react';
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  Send,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addProductReview } from '../services/api';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ';
};

const ageLabels = {
  '0-12m': '0 - 12 tháng (Sơ sinh)',
  '1-3y': '1 - 3 tuổi (Tập đi)',
  '3-6y': '3 - 6 tuổi (Mẫu giáo)',
  '6y+': 'Trên 6 tuổi (Tiểu học)',
  'all': 'Mọi lứa tuổi',
};

const ProductDetailPage = ({ product, onBack, onNavigate }) => {
  const { addToCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const [selectedImage, setSelectedImage] = useState(
    product.images && product.images.length ? product.images[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onNavigate('checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    setReviewLoading(true);
    try {
      await addProductReview(product._id, { rating, comment });
      setReviewSuccess(true);
      if (!product.reviews) product.reviews = [];
      product.reviews.unshift({
        name: user.name,
        rating,
        comment,
        createdAt: new Date(),
      });
      setComment('');
    } catch (err) {
      alert(err.message || 'Lỗi khi gửi đánh giá');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="product-detail-page" style={{ padding: '24px 0 60px' }}>
      <div className="container">
        <button
          className="btn btn-ghost btn-sm"
          onClick={onBack}
          style={{ marginBottom: 20 }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại danh sách sản phẩm</span>
        </button>

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '32px',
            boxShadow: 'var(--shadow-card)',
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: 40,
            marginBottom: 40,
          }}
        >
          <div>
            <div
              style={{
                width: '100%',
                paddingTop: '100%',
                position: 'relative',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                backgroundColor: '#F8FAFC',
                marginBottom: 16,
                border: '1px solid var(--border-color)',
              }}
            >
              <img
                src={selectedImage || (product.images && product.images[0])}
                alt={product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {discountPercent > 0 && (
                <div style={{ position: 'absolute', top: 12, left: 12 }}>
                  <span className="badge badge-sale">Giảm -{discountPercent}%</span>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: 10 }}>
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: selectedImage === img ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className="product-brand" style={{ fontSize: '0.8125rem' }}>
                {product.brand || 'TCT'}
              </span>
              <span className="badge badge-age">
                {ageLabels[product.ageGroup] || product.ageGroup}
              </span>
              {product.isFlashSale && (
                <span className="badge badge-featured">⚡ Flash Sale</span>
              )}
            </div>

            <h1 style={{ fontSize: '1.625rem', lineHeight: 1.3, marginBottom: 12 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', color: 'var(--color-accent-amber)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating || 5) ? '#D97706' : 'none'}
                    color="#D97706"
                  />
                ))}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{product.rating || 5.0}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                ({product.numReviews || (product.reviews ? product.reviews.length : 0)} đánh giá từ phụ huynh)
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#FFF5F5',
                padding: '16px 20px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #FFE3E3',
                display: 'flex',
                alignItems: 'baseline',
                gap: 16,
                marginBottom: 24,
              }}
            >
              <span style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
              <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                ✓ Còn hàng ({product.countInStock || 50} sản phẩm)
              </span>
            </div>

            <div style={{ marginBottom: 24, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} color="var(--color-accent-green)" />
                <span><strong>Chất liệu:</strong> {product.specifications?.material || 'Cotton Organic an toàn cho da trẻ'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} color="var(--color-accent-green)" />
                <span><strong>Tiêu chuẩn:</strong> {product.specifications?.safetyStandard || 'Đạt chứng nhận an toàn quốc tế'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Check size={16} color="var(--color-accent-green)" />
                <span><strong>Xuất xứ:</strong> {product.specifications?.origin || 'Chính hãng phân phối'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Số lượng:</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                <button
                  style={{ padding: '6px 12px' }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus size={14} />
                </button>
                <span style={{ padding: '0 12px', fontWeight: 700, fontSize: '0.9375rem' }}>
                  {quantity}
                </span>
                <button
                  style={{ padding: '6px 12px' }}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 'auto' }}>
              <button
                className="btn btn-outline btn-lg"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>Thêm vào giỏ</span>
              </button>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleBuyNow}
              >
                <span>Mua ngay</span>
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                marginTop: 24,
                paddingTop: 20,
                borderTop: '1px solid var(--border-color)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                textAlign: 'center',
              }}
            >
              <div>
                <ShieldCheck size={20} color="var(--color-primary)" style={{ margin: '0 auto 4px' }} />
                <span>100% Chính hãng</span>
              </div>
              <div>
                <RotateCcw size={20} color="var(--color-primary)" style={{ margin: '0 auto 4px' }} />
                <span>Đổi trả 7 ngày</span>
              </div>
              <div>
                <Truck size={20} color="var(--color-primary)" style={{ margin: '0 auto 4px' }} />
                <span>Freeship từ 500k</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: '#F8FAFC' }}>
            <button
              style={{
                padding: '16px 24px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                borderBottom: activeTab === 'description' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'description' ? 'var(--color-primary)' : 'var(--text-secondary)',
                backgroundColor: activeTab === 'description' ? '#FFF' : 'transparent',
              }}
              onClick={() => setActiveTab('description')}
            >
              Mô tả chi tiết
            </button>
            <button
              style={{
                padding: '16px 24px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                borderBottom: activeTab === 'specs' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'specs' ? 'var(--color-primary)' : 'var(--text-secondary)',
                backgroundColor: activeTab === 'specs' ? '#FFF' : 'transparent',
              }}
              onClick={() => setActiveTab('specs')}
            >
              Thông số an toàn & Kích cỡ
            </button>
            <button
              style={{
                padding: '16px 24px',
                fontWeight: 700,
                fontSize: '0.9375rem',
                borderBottom: activeTab === 'reviews' ? '3px solid var(--color-primary)' : '3px solid transparent',
                color: activeTab === 'reviews' ? 'var(--color-primary)' : 'var(--text-secondary)',
                backgroundColor: activeTab === 'reviews' ? '#FFF' : 'transparent',
              }}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh giá của phụ huynh ({product.reviews ? product.reviews.length : 0})
            </button>
          </div>

          <div style={{ padding: '32px' }}>
            {activeTab === 'description' && (
              <div style={{ lineHeight: 1.8, fontSize: '0.9375rem', color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: 16 }}>{product.description}</p>
                <h4 style={{ margin: '20px 0 8px', color: 'var(--text-primary)' }}>Tại sao cha mẹ nên chọn cho bé?</h4>
                <ul style={{ paddingLeft: 20, listStyle: 'disc', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <li>Quy trình sản xuất được kiểm định chặt chẽ, không tồn dư hóa chất độc hại.</li>
                  <li>Thiết kế công thái học bảo vệ xương và sự phát triển tự nhiên của bé.</li>
                  <li>Dễ dàng vệ sinh, giặt sạch và độ bền cao theo thời gian.</li>
                </ul>
              </div>
            )}

            {activeTab === 'specs' && (
              <div style={{ maxWidth: 640 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--text-muted)', width: 180 }}>Chất liệu</td>
                      <td style={{ padding: '12px 0' }}>{product.specifications?.material || '100% Organic an toàn'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--text-muted)' }}>Xuất xứ</td>
                      <td style={{ padding: '12px 0' }}>{product.specifications?.origin || 'Chính hãng'}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--text-muted)' }}>Độ tuổi khuyên dùng</td>
                      <td style={{ padding: '12px 0' }}>{ageLabels[product.ageGroup] || product.ageGroup}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--text-muted)' }}>Tiêu chuẩn an toàn</td>
                      <td style={{ padding: '12px 0' }}>{product.specifications?.safetyStandard || 'Đạt chuẩn CE / QCVN'}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--text-muted)' }}>Kích cỡ / Quy cách</td>
                      <td style={{ padding: '12px 0' }}>{product.specifications?.size || 'Tiêu chuẩn'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: 20,
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)',
                    marginBottom: 32,
                  }}
                >
                  <h4 style={{ marginBottom: 12 }}>Chia sẻ cảm nhận của bạn về sản phẩm</h4>
                  {reviewSuccess ? (
                    <div style={{ color: 'var(--color-accent-green)', fontWeight: 600 }}>
                      ✓ Cảm ơn bạn đã gửi đánh giá!
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Đánh giá số sao:</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={20}
                              style={{ cursor: 'pointer' }}
                              fill={s <= rating ? '#D97706' : 'none'}
                              color="#D97706"
                              onClick={() => setRating(s)}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <textarea
                          className="form-control"
                          placeholder="Chia sẻ trải nghiệm thực tế của bé khi dùng sản phẩm này để các mẹ khác cùng tham khảo nhé..."
                          rows={3}
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        disabled={reviewLoading}
                      >
                        <Send size={14} />
                        <span>{reviewLoading ? 'Đang gửi...' : 'Gửi đánh giá'}</span>
                      </button>
                    </form>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev, i) => (
                      <div
                        key={i}
                        style={{
                          paddingBottom: 16,
                          borderBottom: '1px solid var(--border-color)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{rev.name}</span>
                          <div style={{ display: 'flex', color: '#D97706' }}>
                            {[...Array(5)].map((_, s) => (
                              <Star
                                key={s}
                                size={13}
                                fill={s < rev.rating ? '#D97706' : 'none'}
                                color="#D97706"
                              />
                            ))}
                          </div>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên để lại nhận xét nhé!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
