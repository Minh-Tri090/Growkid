import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User,
  ShieldCheck,
  PhoneCall,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = ({ onNavigate, currentView, searchQuery, setSearchQuery, onSearchSubmit }) => {
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const { itemsCount, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (onSearchSubmit) onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="site-header">
      <div className="top-banner">
        <div className="container top-banner-content">
          <div className="top-banner-left">
              <span>Chăm chút từng lựa chọn cho bé <strong>và sự an tâm của cha mẹ</strong></span>
          </div>
          <div className="top-banner-right">
            <span className="top-banner-item">
              <ShieldCheck size={14} /> 100% Chính Hãng
            </span>
            <span className="top-banner-item">
              <PhoneCall size={14} /> Hỗ trợ mua hàng
            </span>
          </div>
        </div>
      </div>

      <div className="main-nav">
        <div className="container main-nav-content">
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div
            className="logo-container"
            onClick={() => onNavigate('home')}
            style={{ cursor: 'pointer' }}
          >
            <div className="logo-icon">
              <span>T</span>
            </div>
            <div className="logo-text">
              <span className="logo-title">TCT</span>
              <span className="logo-tagline">Chọn điều tốt cho bé</span>
            </div>
          </div>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Tìm quần áo sơ sinh, đồ chơi, tã sữa cho bé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="search-input"
            />
            <button
              className="search-button"
              onClick={() => onSearchSubmit && onSearchSubmit(searchQuery)}
              aria-label="Tìm kiếm"
            >
              <Search size={18} />
            </button>
          </div>

          <div className="nav-actions">
            {isAdmin && (
              <button
                className={`btn btn-sm ${currentView === 'admin' ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => onNavigate('admin')}
              >
                <LayoutDashboard size={16} />
                <span className="nav-action-text">Quản trị</span>
              </button>
            )}

            <div className="user-action-wrapper" style={{ position: 'relative' }}>
              {user ? (
                <button
                  className="btn btn-ghost user-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="avatar-circle">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="nav-action-text">{user.name.split(' ').slice(-1)[0]}</span>
                </button>
              ) : (
                <button className="btn btn-ghost" onClick={openAuthModal}>
                  <User size={20} />
                  <span className="nav-action-text">Tài khoản</span>
                </button>
              )}

              {userDropdownOpen && user && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-user-info">
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                    <span className="badge badge-neutral" style={{ marginTop: 4 }}>
                      {user.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '8px 0' }} />
                  {isAdmin && (
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        onNavigate('admin');
                        setUserDropdownOpen(false);
                      }}
                    >
                      <LayoutDashboard size={16} /> Bảng điều khiển Admin
                    </button>
                  )}
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>

            <button className="btn btn-primary cart-trigger-btn" onClick={openCart}>
              <div className="cart-icon-wrap">
                <ShoppingBag size={20} />
                {itemsCount > 0 && <span className="cart-badge">{itemsCount}</span>}
              </div>
              <span className="nav-action-text cart-text">Giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>

      <nav className="sub-nav">
        <div className="container sub-nav-content">
          <button
            className={`sub-nav-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => onNavigate('home')}
          >
            Trang chủ
          </button>
          <button
            className={`sub-nav-item ${currentView === 'products' ? 'active' : ''}`}
            onClick={() => onNavigate('products')}
          >
            Tất cả sản phẩm
          </button>
          <button
            className="sub-nav-item highlight-item"
            onClick={() => onNavigate('products', { isFlashSale: 'true' })}
          >
            <Sparkles size={16} /> Giảm giá sốc
          </button>
          <button
            className="sub-nav-item"
            onClick={() => onNavigate('products', { ageGroup: '0-12m' })}
          >
            Đồ sơ sinh (0 - 12m)
          </button>
          <button
            className="sub-nav-item"
            onClick={() => onNavigate('products', { ageGroup: '1-3y' })}
          >
            Bé 1 - 3 tuổi
          </button>
          <button
            className="sub-nav-item"
            onClick={() => onNavigate('products', { ageGroup: '3-6y' })}
          >
            Bé 3 - 6 tuổi
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <span className="logo-title">TCT</span>
              <button onClick={() => setMobileMenuOpen(false)}><X size={20} /></button>
            </div>
            <div className="mobile-menu-links">
              <button
                className="mobile-link"
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              >
                Trang chủ
              </button>
              <button
                className="mobile-link"
                onClick={() => { onNavigate('products'); setMobileMenuOpen(false); }}
              >
                Tất cả sản phẩm
              </button>
              <button
                className="mobile-link"
                onClick={() => { onNavigate('products', { isFlashSale: 'true' }); setMobileMenuOpen(false); }}
              >
                🔥 Giảm giá sốc
              </button>
              <button
                className="mobile-link"
                onClick={() => { onNavigate('products', { ageGroup: '0-12m' }); setMobileMenuOpen(false); }}
              >
                Đồ sơ sinh (0 - 12 tháng)
              </button>
              <button
                className="mobile-link"
                onClick={() => { onNavigate('products', { ageGroup: '1-3y' }); setMobileMenuOpen(false); }}
              >
                Bé tập đi (1 - 3 tuổi)
              </button>
              <button
                className="mobile-link"
                onClick={() => { onNavigate('products', { ageGroup: '3-6y' }); setMobileMenuOpen(false); }}
              >
                Bé mẫu giáo (3 - 6 tuổi)
              </button>
              {isAdmin && (
                <button
                  className="mobile-link"
                  style={{ color: 'var(--color-secondary)', fontWeight: 'bold' }}
                  onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                >
                  Bảng điều khiển Admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
