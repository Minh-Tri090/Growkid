const API_BASE = '/api';

export const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem('growkid_user') || 'null');
  return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Không thể tải danh mục');
  return res.json();
};

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      query.append(key, val);
    }
  });

  const res = await fetch(`${API_BASE}/products?${query.toString()}`);
  if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
  return res.json();
};

export const fetchProductById = async (idOrSlug) => {
  const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
  if (!res.ok) throw new Error('Không thể tải thông tin sản phẩm');
  return res.json();
};

export const fetchFlashSaleProducts = async () => {
  const res = await fetch(`${API_BASE}/products/special/flash-sale`);
  if (!res.ok) throw new Error('Không thể tải sản phẩm Flash Sale');
  return res.json();
};

export const addProductReview = async (productId, reviewData) => {
  const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(reviewData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi khi gửi đánh giá');
  return data;
};

export const loginApi = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Đăng nhập không thành công');
  return data;
};

export const registerApi = async (userData) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Đăng ký không thành công');
  return data;
};

export const createOrderApi = async (orderData) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi tạo đơn hàng');
  return data;
};

export const fetchOrderById = async (idOrCode) => {
  const res = await fetch(`${API_BASE}/orders/${idOrCode}`);
  if (!res.ok) throw new Error('Không tìm thấy đơn hàng');
  return res.json();
};

export const fetchMyOrders = async () => {
  const res = await fetch(`${API_BASE}/orders/my-orders`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error('Không thể tải đơn hàng của bạn');
  return res.json();
};

export const fetchAdminOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/orders?${query}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error('Lỗi tải danh sách đơn hàng Admin');
  return res.json();
};

export const updateOrderStatusApi = async (id, updateData) => {
  const res = await fetch(`${API_BASE}/orders/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(updateData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật trạng thái đơn hàng');
  return data;
};

export const createProductApi = async (productData) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi thêm sản phẩm');
  return data;
};

export const updateProductApi = async (id, productData) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi cập nhật sản phẩm');
  return data;
};

export const deleteProductApi = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi xóa sản phẩm');
  return data;
};

export const seedDatabaseApi = async () => {
  const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Lỗi seed dữ liệu');
  return data;
};
