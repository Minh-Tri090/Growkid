import React, { useEffect } from 'react';
import { CheckCircle2, Copy, ArrowRight, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount || 0) + ' đ';
};

const OrderSuccessPage = ({ orderData, onNavigate }) => {
  const order = orderData?.order;

  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 0' }}>
        <div className="empty-state">
          <h2 className="empty-state-title">Không tìm thấy thông tin đơn hàng</h2>
          <button className="btn btn-primary" onClick={() => onNavigate('home')}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Đã sao chép: ${text}`);
  };

  const vietQrUrl = `https://img.vietqr.io/image/MB-0901234567-compact2.png?amount=${order.totalPrice}&addInfo=${order.orderCode}&accountName=GROWKID%20VIET%20NAM`;

  return (
    <div className="order-success-page" style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '40px',
            boxShadow: 'var(--shadow-card)',
            textAlign: 'center',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent-green-light)',
              color: 'var(--color-accent-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <CheckCircle2 size={44} />
          </div>

          <h1 style={{ fontSize: '1.875rem', marginBottom: 8, color: 'var(--text-primary)' }}>
            Đặt Hàng Thành Công!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', maxWidth: 500, margin: '0 auto 20px' }}>
            Cảm ơn ba/mẹ <strong>{order.customerInfo.name}</strong> đã tin tưởng TCT. Đơn hàng của bạn đang được chuẩn bị để giao đến bé!
          </p>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              backgroundColor: '#F8FAFC',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Mã đơn hàng:</span>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              {order.orderCode}
            </span>
            <button
              onClick={() => copyToClipboard(order.orderCode)}
              style={{ color: 'var(--text-muted)', padding: 4 }}
              title="Sao chép mã đơn"
            >
              <Copy size={16} />
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
              padding: '24px 16px',
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'center',
              fontSize: '0.8125rem',
            }}
          >
            <div>
              <div style={{ color: 'var(--color-accent-green)', fontWeight: 700, marginBottom: 4 }}>
                ● Đã nhận đơn
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Hệ thống đã lưu</div>
            </div>
            <div>
              <div style={{ color: 'var(--color-primary)', fontWeight: 700, marginBottom: 4 }}>
                ○ Đang đóng gói
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Kho đang xử lý</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
                ○ Đang giao hàng
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>1 - 2 ngày tới</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>
                ○ Giao thành công
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Bé nhận quà</div>
            </div>
          </div>
        </div>

        {order.paymentMethod === 'BANK_TRANSFER' ? (
          <div
            style={{
              backgroundColor: '#FFF5F5',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid #FFE3E3',
              padding: '32px',
              marginBottom: 32,
            }}
          >
            <h3 style={{ fontSize: '1.25rem', color: '#E11D48', marginBottom: 16, textAlign: 'center' }}>
              📱 Hướng Dẫn Chuyển Khoản Qua VietQR
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={vietQrUrl}
                  alt="VietQR Payment"
                  style={{
                    width: '100%',
                    maxWidth: 220,
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    margin: '0 auto',
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                  Mở ứng dụng ngân hàng quét mã để thanh toán tự động
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <span className="text-muted">Ngân hàng: </span>
                  <strong>MB Bank (Ngân hàng Quân Đội)</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="text-muted">Số tài khoản: </span>
                  <strong>0901234567</strong>
                  <button onClick={() => copyToClipboard('0901234567')} style={{ color: 'var(--color-primary)' }}>
                    <Copy size={14} />
                  </button>
                </div>
                <div>
                  <span className="text-muted">Chủ tài khoản: </span>
                  <strong>CONG TY CO PHAN GROWKID VIET NAM</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="text-muted">Số tiền: </span>
                  <strong style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>{formatCurrency(order.totalPrice)}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="text-muted">Nội dung chuyển khoản: </span>
                  <strong style={{ backgroundColor: '#FFF', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border-color)' }}>
                    {order.orderCode}
                  </strong>
                  <button onClick={() => copyToClipboard(order.orderCode)} style={{ color: 'var(--color-primary)' }}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#F0FDF4',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid #BBF7D0',
              padding: '24px',
              marginBottom: 32,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              💵
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#166534', marginBottom: 4 }}>
                Thanh toán khi nhận hàng (COD): {formatCurrency(order.totalPrice)}
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#15803D' }}>
                Quý khách vui lòng chuẩn bị số tiền mặt tương ứng. Nhân viên giao hàng sẽ liên hệ trước khi đến. Quý khách hoàn toàn được đồng kiểm tra sản phẩm trước khi thanh toán.
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-color)',
            padding: '28px',
            boxShadow: 'var(--shadow-card)',
            marginBottom: 32,
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 16 }}>
            Chi Tiết Đơn Hàng
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24, fontSize: '0.875rem' }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Thông tin người nhận</div>
              <div>Họ tên: {order.customerInfo.name}</div>
              <div>Số điện thoại: {order.customerInfo.phone}</div>
              {order.customerInfo.email && <div>Email: {order.customerInfo.email}</div>}
              {order.customerInfo.note && <div>Ghi chú: {order.customerInfo.note}</div>}
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Địa chỉ giao hàng</div>
              <div>{order.shippingAddress.street}</div>
              <div>{order.shippingAddress.district ? `${order.shippingAddress.district}, ` : ''}{order.shippingAddress.city}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {order.orderItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 12,
                  borderBottom: '1px solid var(--border-color)',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Số lượng: {item.quantity}</div>
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, textAlign: 'right', fontSize: '1.125rem', fontWeight: 800 }}>
            Tổng cộng: <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          <button className="btn btn-outline" onClick={() => onNavigate('home')}>
            <Home size={16} />
            <span>Về trang chủ</span>
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('products')}>
            <span>Tiếp tục mua sắm</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
