const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'growkid_super_secret_jwt_key_2026_safe_secure');
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Không tìm thấy thông tin người dùng' });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Mã xác thực không hợp lệ hoặc đã hết hạn' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Vui lòng đăng nhập để thực hiện thao tác này' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Quyền truy cập bị từ chối: Chỉ dành cho Quản trị viên (Admin)' });
  }
};

module.exports = { protect, admin };
