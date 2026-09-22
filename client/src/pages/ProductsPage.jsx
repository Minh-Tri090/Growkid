import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories } from '../services/api';

const PRICE_RANGES = [
  { label: 'Tất cả mức giá', min: undefined, max: undefined },
  { label: 'Dưới 200.000 đ', min: undefined, max: 200000 },
  { label: '200.000 đ - 500.000 đ', min: 200000, max: 500000 },
  { label: '500.000 đ - 1.000.000 đ', min: 500000, max: 1000000 },
  { label: 'Trên 1.000.000 đ', min: 1000000, max: undefined },
];

const AGE_OPTIONS = [
  { id: 'all', label: 'Tất cả lứa tuổi' },
  { id: '0-12m', label: 'Sơ sinh (0 - 12 tháng)' },
  { id: '1-3y', label: 'Tập đi (1 - 3 tuổi)' },
  { id: '3-6y', label: 'Mẫu giáo (3 - 6 tuổi)' },
  { id: '6y+', label: 'Tiểu học (Trên 6 tuổi)' },
];

const ProductsPage = ({ initialFilters = {}, onSelectProduct }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category || '');
  const [selectedAge, setSelectedAge] = useState(initialFilters.ageGroup || 'all');
  const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [keyword, setKeyword] = useState(initialFilters.keyword || '');
  const [isFlashSale, setIsFlashSale] = useState(initialFilters.isFlashSale === 'true');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (initialFilters.category !== undefined) setSelectedCategory(initialFilters.category);
    if (initialFilters.ageGroup !== undefined) setSelectedAge(initialFilters.ageGroup);
    if (initialFilters.keyword !== undefined) setKeyword(initialFilters.keyword);
    if (initialFilters.isFlashSale !== undefined) setIsFlashSale(initialFilters.isFlashSale === 'true');
  }, [initialFilters]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const priceConfig = PRICE_RANGES[selectedPriceIndex];
        const res = await fetchProducts({
          category: selectedCategory || undefined,
          ageGroup: selectedAge !== 'all' ? selectedAge : undefined,
          minPrice: priceConfig.min,
          maxPrice: priceConfig.max,
          sortBy,
          keyword: keyword || undefined,
          isFlashSale: isFlashSale ? 'true' : undefined,
        });
        setProducts(res.products || []);
        setTotalCount(res.total || 0);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [selectedCategory, selectedAge, selectedPriceIndex, sortBy, keyword, isFlashSale]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedAge('all');
    setSelectedPriceIndex(0);
    setSortBy('newest');
    setKeyword('');
    setIsFlashSale(false);
  };

  return (
    <div className="products-page" style={{ padding: '24px 0 60px' }}>
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: 6 }}>Danh Sách Sản Phẩm Cho Bé</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Tìm thấy <strong>{totalCount}</strong> sản phẩm phù hợp
            {isFlashSale && <span className="badge badge-sale" style={{ marginLeft: 8 }}>🔥 Đang lọc Flash Sale</span>}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 28, alignItems: 'start' }}>
          <aside
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              padding: 20,
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                paddingBottom: 12,
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1rem' }}>
                <Filter size={18} color="var(--color-primary)" />
                <span>Bộ lọc tìm kiếm</span>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleResetFilters}
                style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                title="Xóa tất cả bộ lọc"
              >
                <RotateCcw size={13} />
                <span>Đặt lại</span>
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 12 }}>
                Danh mục sản phẩm
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                  />
                  <span>Tất cả danh mục</span>
                </label>
                {categories.map((cat) => (
                  <label
                    key={cat._id}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.slug}
                      onChange={() => setSelectedCategory(cat.slug)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 12 }}>
                Độ tuổi của bé
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {AGE_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name="age"
                      checked={selectedAge === opt.id}
                      onChange={() => setSelectedAge(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 12 }}>
                Mức giá
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PRICE_RANGES.map((range, idx) => (
                  <label
                    key={idx}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceIndex === idx}
                      onChange={() => setSelectedPriceIndex(idx)}
                    />
                    <span>{range.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'var(--bg-card)',
                padding: '12px 18px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                marginBottom: 20,
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                <SlidersHorizontal size={16} color="var(--text-muted)" />
                <span className="text-muted">Sắp xếp theo:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  <option value="newest">Hàng mới nhất</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="popular">Bán chạy nhất</option>
                </select>
              </div>

              {keyword && (
                <div style={{ fontSize: '0.875rem' }}>
                  Từ khóa: <strong>"{keyword}"</strong>
                  <button
                    onClick={() => setKeyword('')}
                    style={{ marginLeft: 8, color: 'var(--color-primary)', fontWeight: 600 }}
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                <div className="spinner" />
              </div>
            ) : products.length === 0 ? (
              <div
                className="empty-state"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  padding: '60px 20px',
                }}
              >
                <div className="empty-state-icon">🔍</div>
                <h3 className="empty-state-title">Không tìm thấy sản phẩm nào</h3>
                <p className="empty-state-desc">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác để tìm sản phẩm mong muốn cho bé.
                </p>
                <button className="btn btn-primary btn-sm" onClick={handleResetFilters}>
                  Xóa bộ lọc để xem tất cả
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
