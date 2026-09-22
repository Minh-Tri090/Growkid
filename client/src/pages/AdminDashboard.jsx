import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchAdminOrders,
  updateOrderStatusApi,
  fetchProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  fetchCategories,
  seedDatabaseApi,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

const fmt = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const STATUS_LABELS = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  shipping: '#8b5cf6',
  delivered: '#10b981',
  cancelled: '#ef4444',
};

const AGE_GROUPS = ['0-12m', '1-3y', '3-6y', '6y+', 'all'];

// ─── Reusable: Stat Card ────────────────────────────────────────────────────
function StatCard({ label, value, color, icon }) {
  return (
    <div className="admin-stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="admin-stat-icon" style={{ color }}>{icon}</div>
      <div>
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-label">{label}</div>
      </div>
    </div>
  );
}

// ─── Orders Tab ─────────────────────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const data = await fetchAdminOrders(params);
      setOrders(data.orders || data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (id, status) => {
    setUpdating(id);
    try {
      await updateOrderStatusApi(id, { status });
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status } : o))
      );
    } catch (e) {
      alert(e.message);
    } finally {
      setUpdating(null);
    }
  };

  const totalRevenue = orders
    .filter((o) => o.status === 'delivered')
    .reduce((s, o) => s + o.totalPrice, 0);

  return (
    <div className="admin-tab-content">
      {/* Stats */}
      <div className="admin-stats-row">
        <StatCard label="Tổng đơn" value={orders.length} color="#3b82f6" icon="📦" />
        <StatCard label="Chờ xác nhận" value={orders.filter((o) => o.status === 'pending').length} color="#f59e0b" icon="⏳" />
        <StatCard label="Đang giao" value={orders.filter((o) => o.status === 'shipping').length} color="#8b5cf6" icon="🚚" />
        <StatCard label="Doanh thu" value={fmt(totalRevenue)} color="#10b981" icon="💰" />
      </div>

      {/* Filter */}
      <div className="admin-filter-row">
        {['all', ...Object.keys(STATUS_LABELS)].map((s) => (
          <button
            key={s}
            className={`admin-filter-btn${filter === s ? ' active' : ''}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'Tất cả' : STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {error && <div className="admin-error">{error}</div>}
      {loading ? (
        <div className="admin-loading">⏳ Đang tải đơn hàng...</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty">Không có đơn hàng nào.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    className="admin-table-row clickable"
                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  >
                    <td>
                      <span className="admin-order-code">#{order.orderCode || order._id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td>
                      <div className="admin-customer-name">{order.shippingAddress?.name || order.user?.name || 'Khách'}</div>
                      <div className="admin-customer-phone">{order.shippingAddress?.phone}</div>
                    </td>
                    <td><strong>{fmt(order.totalPrice)}</strong></td>
                    <td>
                      <span className="admin-badge-method">
                        {order.paymentMethod === 'bank_transfer' ? '🏦 Chuyển khoản' : '💵 COD'}
                      </span>
                    </td>
                    <td>
                      <span
                        className="admin-status-badge"
                        style={{ background: `${STATUS_COLORS[order.status]}22`, color: STATUS_COLORS[order.status] }}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="admin-date">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select
                        className="admin-status-select"
                        value={order.status}
                        disabled={updating === order._id}
                        onChange={(e) => changeStatus(order._id, e.target.value)}
                      >
                        {Object.entries(STATUS_LABELS).map(([val, lbl]) => (
                          <option key={val} value={val}>{lbl}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expanded === order._id && (
                    <tr className="admin-expanded-row">
                      <td colSpan={7}>
                        <div className="admin-order-detail">
                          <div className="admin-order-detail-section">
                            <strong>📍 Địa chỉ giao hàng:</strong>
                            <span>{order.shippingAddress?.address}, {order.shippingAddress?.city}</span>
                          </div>
                          <div className="admin-order-items">
                            {order.orderItems?.map((item, i) => (
                              <div key={i} className="admin-order-item">
                                <img src={item.image} alt={item.name} className="admin-order-item-img" />
                                <span>{item.name}</span>
                                <span>x{item.quantity}</span>
                                <span>{fmt(item.price)}</span>
                              </div>
                            ))}
                          </div>
                          {order.note && (
                            <div className="admin-order-note">📝 Ghi chú: {order.note}</div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Products Tab ────────────────────────────────────────────────────────────
const EMPTY_PRODUCT = {
  name: '', slug: '', category: '', ageGroup: '0-12m',
  price: '', originalPrice: '', countInStock: '', brand: '',
  description: '', images: '',
  isFlashSale: false, flashSalePrice: '', flashSaleEndsAt: '',
};

function ProductsTab() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([fetchProducts({ limit: 200 }), fetchCategories()]);
      setProducts(pRes.products || pRes);
      setCategories(cRes);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setForm(EMPTY_PRODUCT);
    setEditId(null);
    setShowForm(true);
    setError('');
  };

  const openEdit = (p) => {
    setForm({
      name: p.name || '',
      slug: p.slug || '',
      category: p.category?._id || p.category || '',
      ageGroup: p.ageGroup || '0-12m',
      price: p.price || '',
      originalPrice: p.originalPrice || '',
      countInStock: p.countInStock || '',
      brand: p.brand || '',
      description: p.description || '',
      images: (p.images || []).join('\n'),
      isFlashSale: p.isFlashSale || false,
      flashSalePrice: p.flashSalePrice || '',
      flashSaleEndsAt: p.flashSaleEndsAt ? p.flashSaleEndsAt.substring(0, 16) : '',
    });
    setEditId(p._id);
    setShowForm(true);
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice) || undefined,
        countInStock: Number(form.countInStock),
        flashSalePrice: form.isFlashSale ? Number(form.flashSalePrice) : undefined,
        flashSaleEndsAt: form.isFlashSale && form.flashSaleEndsAt ? new Date(form.flashSaleEndsAt).toISOString() : undefined,
        images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      };
      if (editId) {
        await updateProductApi(editId, payload);
      } else {
        await createProductApi(payload);
      }
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Xóa sản phẩm "${name}"?`)) return;
    try {
      await deleteProductApi(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-tab-content">
      {/* Header row */}
      <div className="admin-toolbar">
        <input
          className="admin-search-input"
          placeholder="🔍 Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={openNew}>+ Thêm sản phẩm</button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form className="admin-product-form" onSubmit={handleSave}>
              <div className="admin-form-grid">
                <div className="admin-form-group full">
                  <label>Tên sản phẩm *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Slug (URL)</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="tu-dong-tao-neu-bo-trong" />
                </div>
                <div className="admin-form-group">
                  <label>Thương hiệu</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Danh mục *</label>
                  <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Độ tuổi</label>
                  <select value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value })}>
                    {AGE_GROUPS.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Giá bán (VNĐ) *</label>
                  <input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Giá gốc (VNĐ)</label>
                  <input type="number" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Số lượng tồn kho *</label>
                  <input required type="number" min="0" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} />
                </div>
                <div className="admin-form-group full">
                  <label>URLs ảnh (mỗi dòng 1 link)</label>
                  <textarea rows={3} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="https://..." />
                </div>
                <div className="admin-form-group full">
                  <label>Mô tả</label>
                  <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="admin-form-group full">
                  <label className="admin-checkbox-label">
                    <input
                      type="checkbox"
                      checked={form.isFlashSale}
                      onChange={(e) => setForm({ ...form, isFlashSale: e.target.checked })}
                    />
                    <span>⚡ Flash Sale</span>
                  </label>
                </div>
                {form.isFlashSale && (
                  <>
                    <div className="admin-form-group">
                      <label>Giá Flash Sale (VNĐ)</label>
                      <input type="number" min="0" value={form.flashSalePrice} onChange={(e) => setForm({ ...form, flashSalePrice: e.target.value })} />
                    </div>
                    <div className="admin-form-group">
                      <label>Kết thúc Flash Sale</label>
                      <input type="datetime-local" value={form.flashSaleEndsAt} onChange={(e) => setForm({ ...form, flashSaleEndsAt: e.target.value })} />
                    </div>
                  </>
                )}
              </div>
              {error && <div className="admin-error">{error}</div>}
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Đang lưu...' : editId ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="admin-loading">⏳ Đang tải sản phẩm...</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Độ tuổi</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Flash Sale</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="admin-table-row">
                  <td>
                    <img
                      src={p.images?.[0] || 'https://placehold.co/50x50?text=No+Img'}
                      alt={p.name}
                      className="admin-product-thumb"
                      onError={(e) => { e.target.src = 'https://placehold.co/50x50?text=No+Img'; }}
                    />
                  </td>
                  <td>
                    <div className="admin-product-name">{p.name}</div>
                    <div className="admin-product-brand">{p.brand}</div>
                  </td>
                  <td>{p.category?.name || '—'}</td>
                  <td><span className="admin-age-badge">{p.ageGroup}</span></td>
                  <td>
                    <strong>{fmt(p.price)}</strong>
                    {p.originalPrice > p.price && (
                      <div className="admin-original-price">{fmt(p.originalPrice)}</div>
                    )}
                  </td>
                  <td>
                    <span className={`admin-stock-badge ${p.countInStock === 0 ? 'out' : p.countInStock < 10 ? 'low' : 'ok'}`}>
                      {p.countInStock}
                    </span>
                  </td>
                  <td>{p.isFlashSale ? <span className="admin-flash-badge">⚡ On</span> : '—'}</td>
                  <td>
                    <div className="admin-action-btns">
                      <button className="admin-btn-edit" onClick={() => openEdit(p)}>✏️</button>
                      <button className="admin-btn-delete" onClick={() => handleDelete(p._id, p.name)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="admin-empty">Không tìm thấy sản phẩm nào.</div>}
        </div>
      )}
    </div>
  );
}

// ─── Settings / Seed Tab ─────────────────────────────────────────────────────
function SettingsTab() {
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  const handleSeed = async () => {
    if (!window.confirm('Xóa toàn bộ dữ liệu và nạp lại dữ liệu mẫu?')) return;
    setSeeding(true);
    setSeedMsg('');
    try {
      const res = await seedDatabaseApi();
      setSeedMsg(`✅ ${res.message || 'Đã nạp dữ liệu mẫu thành công!'}`);
    } catch (e) {
      setSeedMsg(`❌ ${e.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="admin-tab-content">
      <div className="admin-settings-card">
        <h3>🌱 Nạp dữ liệu mẫu (Seed Database)</h3>
        <p>Thao tác này sẽ xóa toàn bộ sản phẩm, danh mục hiện có và nạp lại bộ dữ liệu mẫu chuẩn gồm 20+ sản phẩm thực tế.</p>
        <button className="btn btn-danger" onClick={handleSeed} disabled={seeding}>
          {seeding ? '⏳ Đang nạp dữ liệu...' : '🚀 Bắt đầu Seed Database'}
        </button>
        {seedMsg && <div className="admin-seed-msg">{seedMsg}</div>}
      </div>

      <div className="admin-settings-card">
        <h3>📊 Thông tin hệ thống</h3>
        <div className="admin-info-list">
          <div><span>Frontend:</span> <strong>React 18 + Vite</strong></div>
          <div><span>Backend:</span> <strong>Node.js + Express</strong></div>
          <div><span>Database:</span> <strong>MongoDB (Mongoose)</strong></div>
          <div><span>Auth:</span> <strong>JWT (30 ngày)</strong></div>
          <div><span>Payment:</span> <strong>COD + VietQR Bank Transfer</strong></div>
        </div>
      </div>
    </div>
  );
}

// ─── Main AdminDashboard ─────────────────────────────────────────────────────
export default function AdminDashboard({ navigate }) {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  // Guard: only admins
  if (!user) {
    return (
      <div className="admin-guard">
        <div className="admin-guard-box">
          <div className="admin-guard-icon">🔒</div>
          <h2>Yêu cầu đăng nhập</h2>
          <p>Bạn cần đăng nhập với tài khoản admin để truy cập trang này.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>← Về trang chủ</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-guard">
        <div className="admin-guard-box">
          <div className="admin-guard-icon">🚫</div>
          <h2>Không có quyền truy cập</h2>
          <p>Tài khoản của bạn không có quyền Admin.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>← Về trang chủ</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: '📦 Đơn hàng' },
    { id: 'products', label: '🛍️ Sản phẩm' },
    { id: 'settings', label: '⚙️ Cài đặt' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-icon">🧸</span>
          <div>
            <div className="admin-logo-name">GrowKid</div>
            <div className="admin-logo-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`admin-nav-item${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">
              {user.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className="admin-user-name">{user.name}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <div className="admin-sidebar-actions">
            <button className="admin-nav-item" onClick={() => navigate('/')}>🏠 Trang chủ</button>
            <button className="admin-nav-item danger" onClick={logout}>🚪 Đăng xuất</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-header">
          <h1 className="admin-page-title">
            {tabs.find((t) => t.id === activeTab)?.label}
          </h1>
          <div className="admin-header-meta">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="admin-body">
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'products' && <ProductsTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}
