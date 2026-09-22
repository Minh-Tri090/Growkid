import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ';
};

const CartPage = ({ onNavigate }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingPrice,
    totalPrice,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'GROWKID10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setCouponApplied('GROWKID10 (Giảm 10%)');
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      setDiscount(shippingPrice);
      setCouponApplied('FREESHIP (Miễn phí vận chuyển)');
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn. Hãy thử mã "GROWKID10"');
    }
  };

  const finalTotal = Math.max(0, totalPrice - discount);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2 className="empty-state-title">Giỏ hàng của bạn đang trống</h2>
          <p className="empty-state-desc">
            Bạn chưa chọn món đồ nào cho bé. Hãy khám phá bộ sưu tập sản phẩm mới nhất của TCT nhé!
          </p>
          <button className="btn btn-primary" onClick={() => onNavigate('products')}>
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page" style={{ padding: '32px 0 60px' }}>
      <div className="container">
        <h1 style={{ fontSize: '1.75rem', marginBottom: 24 }}>Giỏ Hàng Mua Sắm</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }}>
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-color)',
              padding: 24,
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 700 }}>Danh sách sản phẩm ({cartItems.length})</span>
              <button
                className="btn btn-ghost btn-sm text-danger"
                onClick={clearCart}
                style={{ fontSize: '0.75rem' }}
              >
                Xóa tất cả
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto auto',
                    gap: 16,
                    alignItems: 'center',
                    paddingBottom: 16,
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      backgroundColor: '#F8FAFC',
                    }}
                  />

                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 4 }}>
                      {item.name}
                    </h4>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#F8FAFC',
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                      style={{ padding: '6px 10px' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 10px', fontSize: '0.875rem', fontWeight: 700 }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      style={{ padding: '6px 10px' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--color-primary)' }}>
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product)}
                      style={{ color: 'var(--text-muted)', marginTop: 6, padding: 4 }}
                      title="Xóa món này"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24 }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onNavigate('products')}
              >
                <ArrowLeft size={16} />
                <span>Tiếp tục chọn thêm đồ cho bé</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, marginBottom: 12, fontSize: '0.875rem' }}>
                <Tag size={16} color="var(--color-primary)" />
                <span>Mã giảm giá (Coupon)</span>
              </div>
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập GROWKID10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{ textTransform: 'uppercase' }}
                />
                <button type="submit" className="btn btn-outline btn-sm">
                  Áp dụng
                </button>
              </form>
              {couponApplied && (
                <div style={{ color: 'var(--color-accent-green)', fontSize: '0.8125rem', marginTop: 8, fontWeight: 600 }}>
                  ✓ Đã áp dụng mã: {couponApplied}
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                padding: 24,
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>Tóm Tắt Đơn Hàng</h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.875rem' }}>
                <span className="text-muted">Tổng tiền hàng:</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.875rem' }}>
                <span className="text-muted">Phí giao hàng:</span>
                <span style={{ fontWeight: 600, color: shippingPrice === 0 ? 'var(--color-accent-green)' : 'inherit' }}>
                  {shippingPrice === 0 ? 'Miễn phí' : formatCurrency(shippingPrice)}
                </span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                  <span>Giảm giá voucher:</span>
                  <span style={{ fontWeight: 700 }}>-{formatCurrency(discount)}</span>
                </div>
              )}

              <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)', margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Tổng thanh toán:</span>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                  {formatCurrency(finalTotal)}
                </span>
              </div>

              <button
                className="btn btn-primary btn-block btn-lg"
                onClick={() => onNavigate('checkout', { discount })}
              >
                <span>Tiến hành đặt hàng</span>
                <ArrowRight size={18} />
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 16,
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={16} color="var(--color-accent-green)" />
                <span>Bảo mật thanh toán & Được đồng kiểm khi nhận</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
