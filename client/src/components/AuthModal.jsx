import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login, register } = useAuth();
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, phone });
      }
      closeAuthModal();
    } catch (err) {
      setError(err.message || 'Thao tác không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setError(null);
    setLoading(true);
    try {
      await login(demoEmail, demoPassword);
      closeAuthModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              style={{
                fontSize: '1.125rem',
                fontWeight: tab === 'login' ? 700 : 500,
                color: tab === 'login' ? 'var(--color-primary)' : 'var(--text-secondary)',
                borderBottom: tab === 'login' ? '2px solid var(--color-primary)' : 'none',
                paddingBottom: 4,
              }}
              onClick={() => { setTab('login'); setError(null); }}
            >
              Đăng nhập
            </button>
            <button
              style={{
                fontSize: '1.125rem',
                fontWeight: tab === 'register' ? 700 : 500,
                color: tab === 'register' ? 'var(--color-primary)' : 'var(--text-secondary)',
                borderBottom: tab === 'register' ? '2px solid var(--color-primary)' : 'none',
                paddingBottom: 4,
              }}
              onClick={() => { setTab('register'); setError(null); }}
            >
              Đăng ký tài khoản
            </button>
          </div>
          <button className="modal-close-btn" onClick={closeAuthModal}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 'var(--radius-md)',
                color: '#DC2626',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 16,
              }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    Họ và tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ví dụ: Nguyễn Thị Hoa"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Ví dụ: 0987654321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">
                Địa chỉ Email <span className="required">*</span>
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="ten@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Mật khẩu <span className="required">*</span>
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Tối thiểu 6 ký tự"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: 16 }}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : tab === 'login' ? 'Đăng nhập ngay' : 'Tạo tài khoản'}
            </button>
          </form>

          <div
            style={{
              marginTop: 24,
              padding: 16,
              backgroundColor: '#F8FAFC',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-color)',
            }}
          >
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              💡 Thử nghiệm nhanh (Demo Accounts):
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => handleQuickLogin('admin@growkid.vn', 'admin123@GrowKid')}
                disabled={loading}
              >
                <span>🔑 <strong>Admin:</strong> admin@growkid.vn</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ justifyContent: 'flex-start' }}
                onClick={() => handleQuickLogin('lananh@gmail.com', 'user123@GrowKid')}
                disabled={loading}
              >
                <span>🍼 <strong>Khách hàng:</strong> lananh@gmail.com</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
