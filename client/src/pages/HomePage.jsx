import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Shirt,
  Gamepad2,
  Utensils,
  HeartHandshake,
  Baby,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import AgeFilterBar from '../components/AgeFilterBar';
import { fetchProducts, fetchCategories, fetchFlashSaleProducts } from '../services/api';

const categoryIcons = {
  Shirt: <Shirt size={26} />,
  Gamepad2: <Gamepad2 size={26} />,
  Utensils: <Utensils size={26} />,
  HeartHandshake: <HeartHandshake size={26} />,
  Baby: <Baby size={26} />,
};

const HomePage = ({ onNavigate, onSelectProduct }) => {
  const [categories, setCategories] = useState([]);
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedAge, setSelectedAge] = useState('all');
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [cats, flashSales, productsRes] = await Promise.all([
          fetchCategories(),
          fetchFlashSaleProducts(),
          fetchProducts({ limit: 8, ageGroup: selectedAge !== 'all' ? selectedAge : undefined }),
        ]);
        setCategories(cats);
        setFlashSaleProducts(flashSales);
        setFeaturedProducts(productsRes.products || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, [selectedAge]);

  return (
    <div className="home-page">
      <div className="container">
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-tag">
              <Sparkles size={14} /> Mừng Năm Học Mới - Giảm Đến 35%
            </span>
            <h1 className="hero-title">
              Nâng niu từng bước phát triển của bé yêu
            </h1>
            <p className="hero-desc">
              Khám phá hơn 1.000+ sản phẩm quần áo organic, đồ chơi phát triển trí tuệ, tã bỉm và đồ dùng cao cấp đạt chứng nhận an toàn quốc tế.
            </p>
            <div className="hero-buttons">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate('products')}
              >
                <span>Mua sắm ngay</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn btn-outline btn-lg"
                onClick={() => onNavigate('products', { isFlashSale: 'true' })}
              >
                🔥 Xem Flash Sale
              </button>
            </div>
          </div>
          <div className="hero-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80"
              alt="Sản phẩm TCT dành cho bé"
              className="hero-image"
            />
          </div>
        </section>

        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Danh Mục Dành Cho Bé</h2>
              <p className="section-subtitle">Phân loại khoa học theo từng nhu cầu phát triển</p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigate('products')}
            >
              <span>Xem tất cả</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="category-card-grid">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="category-card"
                onClick={() => onNavigate('products', { category: cat.slug })}
              >
                <div className="category-icon-box">
                  {categoryIcons[cat.icon] || <Sparkles size={24} />}
                </div>
                <span className="category-name">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {flashSaleProducts.length > 0 && (
          <section
            className="section"
            style={{
              backgroundColor: '#FFF5F5',
              padding: '28px 24px',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid #FFE3E3',
              marginBottom: 40,
            }}
          >
            <div className="section-header" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 24 }}>⚡</span>
                  <h2 className="section-title" style={{ color: '#E11D48' }}>GIỜ VÀNG GIẢM GIÁ</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem' }}>
                  <span className="text-muted">Kết thúc trong:</span>
                  <span
                    style={{
                      backgroundColor: '#E11D48',
                      color: '#FFF',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  :
                  <span
                    style={{
                      backgroundColor: '#E11D48',
                      color: '#FFF',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  :
                  <span
                    style={{
                      backgroundColor: '#E11D48',
                      color: '#FFF',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => onNavigate('products', { isFlashSale: 'true' })}
              >
                <span>Xem tất cả ưu đãi</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="product-grid">
              {flashSaleProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          </section>
        )}

        <section className="section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Chọn Đồ Theo Lứa Tuổi Của Bé</h2>
              <p className="section-subtitle">Mỗi giai đoạn phát triển là một nhu cầu chăm sóc riêng biệt</p>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <AgeFilterBar selectedAge={selectedAge} onSelectAge={setSelectedAge} />
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div className="spinner" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-title">Chưa có sản phẩm cho nhóm tuổi này</p>
            </div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => onNavigate('products', { ageGroup: selectedAge })}
            >
              <span>Xem thêm tất cả sản phẩm ({featuredProducts.length}+)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <div className="trust-grid">
          <div className="trust-item">
            <div className="trust-icon">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="trust-title">100% Chính Hãng</div>
              <div className="trust-desc">Cam kết hoàn tiền 200% nếu phát hiện hàng giả</div>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <RotateCcw size={24} />
            </div>
            <div>
              <div className="trust-title">Đổi Trả Trong 7 Ngày</div>
              <div className="trust-desc">Hỗ trợ đổi size, đổi mẫu tận nhà tiện lợi</div>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <Truck size={24} />
            </div>
            <div>
              <div className="trust-title">Giao Hàng Toàn Quốc</div>
              <div className="trust-desc">Miễn phí vận chuyển cho đơn hàng từ 500k</div>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-icon">
              <Headphones size={24} />
            </div>
            <div>
              <div className="trust-title">Tư Vấn Tận Tâm</div>
              <div className="trust-desc">Đội ngũ chuyên viên tư vấn chăm sóc mẹ và bé</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
