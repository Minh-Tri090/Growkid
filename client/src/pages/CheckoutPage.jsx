import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, Banknote, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrderApi } from '../services/api';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ';
};

const CheckoutPage = ({ onNavigate, checkoutData = {} }) => {
  const { cartItems, subtotal, shippingPrice, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const discount = checkoutData.discount || 0;
  const finalTotal = Math.max(0, totalPrice - discount);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [street, setStreet] = useState(user?.address?.street || '');
  const [city, setCity] = useState(user?.address?.city || 'Hà Nội');
  const [district, setDistrict] = useState(user?.address?.district || '');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      if (!name && user.name) setName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (!email && user.email) setEmail(user.email);
      if (!street && user.address?.street) setStreet(user.address.street);
      if (!city && user.address?.city) setCity(user.address.city);
    }
  }, [user]);

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <div className="empty-state">
          <h2 className="empty-state-title">Chưa có sản phẩm để đặt hàng</h2>
          <button className="btn btn-primary" onClick={() => onNavigate('products')}>
            Xem danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        customerInfo: { name, phone, email, note },
        shippingAddress: { street, city, district },
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        discountPrice: discount,
        totalPrice: finalTotal,
      };

      const createdOrder = await createOrderApi(orderPayload);
      clearCart();
      onNavigate('order-success', { order: createdOrder });
    } catch (err) {
      setError(err.message || 'Lỗi khi tạo đơn hàng. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page" style={{ padding: '32px 0 60px' }}>
      <div className="container">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => onNavigate('cart')}
          style={{ marginBottom: 20 }}
        >
          <ArrowLeft size={16} />
          <span>Quay lại giỏ hàng</span>
        </button>

        <h1 style={{ fontSize: '1.75rem', marginBottom: 24 }}>Thông Tin Đặt Hàng</h1>

        {error && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #FCA5A5',
              marginBottom: 24,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-color)',
                  padding: 24,
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>
                  <MapPin size={20} color="var(--color-primary)" />
                  <span>1. Địa chỉ nhận hàng</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">
                      Họ và tên ba/mẹ <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ví dụ: Hoàng Lan Anh"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Số điện thoại nhận hàng <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Ví dụ: 0912 345 678"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email (để nhận mã vận đơn & hóa đơn điện tử)</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Địa chỉ chi tiết (Số nhà, tên đường, ngõ/ngách) <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: Tòa R2 Vinhome Ocean Park, Đa Tốn"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Quận / Huyện</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ví dụ: Gia Lâm"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tỉnh / Thành phố <span className="required">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Hà Nội / TP.HCM / ..."
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Ghi chú giao hàng (nếu có)</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--border-color)',
                  padding: 24,
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>
                  <Banknote size={20} color="var(--color-primary)" />
                  <span>2. Phương thức thanh toán</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 16,
                      borderRadius: 'var(--radius-lg)',
                      border: paymentMethod === 'COD' ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      backgroundColor: paymentMethod === 'COD' ? '#FFF5F5' : 'var(--bg-card)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                        Thanh toán khi nhận hàng (COD)
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Nhận hàng, kiểm tra hàng thoải mái rồi mới thanh toán tiền mặt cho nhân viên giao hàng.
                      </div>
                    </div>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 16,
                      borderRadius: 'var(--radius-lg)',
                      border: paymentMethod === 'BANK_TRANSFER' ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      backgroundColor: paymentMethod === 'BANK_TRANSFER' ? '#FFF5F5' : 'var(--bg-card)',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={() => setPaymentMethod('BANK_TRANSFER')}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>Chuyển khoản VietQR (Khuyên dùng)</span>
                        <span className="badge badge-success">Tự động 24/7</span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        Quét mã QR chuẩn VietQR qua mọi App ngân hàng, tự động điền số tiền và mã đơn hàng.
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-color)',
                padding: 24,
                boxShadow: 'var(--shadow-card)',
                position: 'sticky',
                top: 90,
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>
                Đơn Hàng ({cartItems.length} sản phẩm)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 240, overflowY: 'auto', marginBottom: 16 }}>
                {cartItems.map((item) => (
                  <div key={item.product} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        SL: {item.quantity} x {formatCurrency(item.price)}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem' }}>
                <span className="text-muted">Tạm tính:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem' }}>
                <span className="text-muted">Phí giao hàng:</span>
                <span style={{ color: shippingPrice === 0 ? 'var(--color-accent-green)' : 'inherit' }}>
                  {shippingPrice === 0 ? 'Miễn phí' : formatCurrency(shippingPrice)}
                </span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem', color: 'var(--color-primary)' }}>
                  <span>Voucher giảm giá:</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <hr style={{ border: 'none', borderTop: '1px dashed var(--border-color)', margin: '12px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Tổng thanh toán:</span>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-primary)' }}>
                  {formatCurrency(finalTotal)}
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
              >
                {loading ? 'Đang gửi đơn hàng...' : 'Xác nhận đặt hàng'}
              </button>

              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)', justifyContent: 'center' }}>
                <ShieldCheck size={16} color="var(--color-accent-green)" />
                <span>Cam kết bảo mật thông tin & Hỗ trợ đổi trả 7 ngày</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
