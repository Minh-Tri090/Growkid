import React from 'react';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo-container" style={{ marginBottom: 16 }}>
              <div className="logo-icon"><span>T</span></div>
              <div className="logo-text">
                <span className="logo-title" style={{ color: '#FFFFFF' }}>
                  TCT
                </span>
                <span className="logo-tagline" style={{ color: '#94A3B8' }}>
                  Chọn điều tốt cho bé
                </span>
              </div>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: 16 }}>
              TCT tuyển chọn quần áo và những sản phẩm thiết yếu cho trẻ em, để mỗi ngày chăm bé trở nên nhẹ nhàng hơn.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Số 88 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Kênh hỗ trợ sẽ được cập nhật</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Mail size={16} style={{ color: 'var(--color-primary)' }} />
                <span>Liên hệ qua biểu mẫu hỗ trợ</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">TCT</h4>
            <div className="footer-links">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }}>Về TCT</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('services'); }}>Dịch vụ</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>Liên hệ</a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Danh Mục Nổi Bật</h4>
            <div className="footer-links">
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products', { ageGroup: '0-12m' }); }}>
                Đồ Sơ Sinh (0 - 12m)
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products', { category: 'quan-ao-thoi-trang-be' }); }}>
                Quần Áo & Thời Trang
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products', { category: 'do-choi-thong-minh-van-dong' }); }}>
                Đồ Chơi Giáo Dục
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products', { category: 'sua-thuc-pham-an-dam' }); }}>
                Sữa & Thực Phẩm Ăn Dặm
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products', { category: 'ta-bim-cham-soc-ve-sinh' }); }}>
                Tã Bỉm & Vệ Sinh
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products', { category: 'xe-day-diu-noi-cui-em-be' }); }}>
                Xe Đẩy & Nôi Cũi
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Hỗ Trợ Khách Hàng</h4>
            <div className="footer-links">
              <a href="#" onClick={(e) => e.preventDefault()}>Chính sách đổi trả trong 7 ngày</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Chính sách giao hàng & kiểm hàng</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Hướng dẫn chọn size cho bé</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Bảo mật thông tin khách hàng</a>
              <a href="#" onClick={(e) => e.preventDefault()}>Cam kết an toàn chất lượng</a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Phương Thức Thanh Toán</h4>
            <p style={{ fontSize: '0.875rem', marginBottom: 12 }}>
              Hỗ trợ thanh toán tiền mặt khi nhận hàng (COD) hoặc quét mã VietQR tự động qua mọi ứng dụng ngân hàng.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="badge badge-neutral" style={{ background: '#1E293B', color: '#FFF' }}>💵 Tiền mặt (COD)</span>
              <span className="badge badge-neutral" style={{ background: '#1E293B', color: '#FFF' }}>📱 VietQR 24/7</span>
              <span className="badge badge-neutral" style={{ background: '#1E293B', color: '#FFF' }}>🛡️ 100% An toàn</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 TCT. Quần áo và sản phẩm thiết yếu cho trẻ em.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Được phát triển với <Heart size={14} color="#FF6B6B" fill="#FF6B6B" /> vì thế hệ tương lai
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
