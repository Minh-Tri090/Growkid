import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ';
};

const CartDrawer = ({ onNavigate }) => {
  const {
    isCartOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    itemsCount,
    subtotal,
    shippingPrice,
    totalPrice,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 500000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="drawer-overlay" onClick={closeCart}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShoppingBag size={20} color="var(--color-primary)" />
            <h3 className="modal-title">Giỏ hàng của bạn ({itemsCount})</h3>
          </div>
          <button className="modal-close-btn" onClick={closeCart}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '12px 20px', backgroundColor: '#FFF5F5', borderBottom: '1px solid #FFE3E3' }}>
          <div style={{ fontSize: '0.8125rem', marginBottom: 6, color: 'var(--text-secondary)' }}>
            {remainingForFreeShipping > 0 ? (
              <span>
                Mua thêm <strong>{formatCurrency(remainingForFreeShipping)}</strong> để được <strong>Miễn phí vận chuyển</strong>!
              </span>
            ) : (
              <span style={{ color: 'var(--color-accent-green)', fontWeight: 'bold' }}>
                🎉 Đơn hàng của bạn đã được MIỄN PHÍ VẬN CHUYỂN!
              </span>
            )}
          </div>
          <div style={{ height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                backgroundColor: remainingForFreeShipping === 0 ? 'var(--color-accent-green)' : 'var(--color-primary)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {cartItems.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <ShoppingBag className="empty-state-icon" />
              <h4 className="empty-state-title">Giỏ hàng trống</h4>
              <p className="empty-state-desc">
                Chưa có món đồ nào được thêm vào giỏ. Hãy chọn những món quà tuyệt vời nhất cho bé nhé!
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  closeCart();
                  onNavigate('products');
                }}
              >
                Khám phá sản phẩm ngay
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  style={{
                    display: 'flex',
                    gap: 12,
                    paddingBottom: 16,
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      backgroundColor: '#F8FAFC',
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          lineHeight: 1.3,
                          color: 'var(--text-primary)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {item.name}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product)}
                        style={{ color: 'var(--text-muted)', padding: 2 }}
                        title="Xóa khỏi giỏ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {formatCurrency(item.price)}
                      </span>

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
                          style={{ padding: '4px 8px', color: 'var(--text-secondary)' }}
                        >
                          <Minus size={13} />
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.8125rem', fontWeight: 600 }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product, item.quantity + 1)}
                          style={{ padding: '4px 8px', color: 'var(--text-secondary)' }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div
            style={{
              padding: '16px 20px',
              borderTop: '1px solid var(--border-color)',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.875rem' }}>
              <span className="text-muted">Tạm tính:</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.875rem' }}>
              <span className="text-muted">Phí giao hàng:</span>
              <span style={{ fontWeight: 600, color: shippingPrice === 0 ? 'var(--color-accent-green)' : 'inherit' }}>
                {shippingPrice === 0 ? 'Miễn phí' : formatCurrency(shippingPrice)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 16,
                paddingTop: 8,
                borderTop: '1px dashed var(--border-color)',
              }}
            >
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Tổng thanh toán:</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  closeCart();
                  onNavigate('checkout');
                }}
              >
                <span>Tiến hành đặt hàng</span>
                <ArrowRight size={16} />
              </button>
              <button
                className="btn btn-outline btn-block btn-sm"
                onClick={() => {
                  closeCart();
                  onNavigate('cart');
                }}
              >
                Xem chi tiết giỏ hàng
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginTop: 12,
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <ShieldCheck size={14} color="var(--color-accent-green)" />
              <span>Được kiểm tra hàng trước khi thanh toán</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
