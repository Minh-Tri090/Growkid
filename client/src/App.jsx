import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import AdminDashboard from './pages/AdminDashboard';
import InformationPages from './pages/InformationPages';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { fetchProductById } from './services/api';

// Simple hash-based router
const getRoute = () => {
  const hash = window.location.hash.replace('#', '') || '/';
  return hash || '/';
};

export default function App() {
  const [route, setRoute] = useState(getRoute);
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState({});
  const [orderData, setOrderData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const { toastMessage, isCartOpen } = useCart();
  const { isAuthModalOpen } = useAuth();

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  useEffect(() => {
    if (!route.startsWith('/products/') || route.split('/').length !== 3) {
      setProduct(null);
      return;
    }

    const slug = route.replace('/products/', '');
    setProductLoading(true);
    fetchProductById(slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setProductLoading(false));
  }, [route]);

  const navigate = (path, params = {}) => {
    const routes = {
      home: '/',
      products: '/products',
      cart: '/cart',
      checkout: '/checkout',
      admin: '/admin',
      'order-success': '/order-success',
      about: '/about',
      services: '/services',
      contact: '/contact',
    };
    const target = routes[path] || path;
    if (path === 'checkout') setCheckoutData(params);
    if (path === 'order-success') setOrderData(params);
    if (path === 'products' && params.keyword !== undefined) setSearchQuery(params.keyword);
    const query = path === 'products' ? new URLSearchParams(params).toString() : '';
    window.location.hash = `${target}${query ? `?${query}` : ''}`;
  };

  const selectProduct = (selectedProduct) => {
    window.location.hash = `/products/${selectedProduct.slug || selectedProduct._id}`;
  };

  const queryFilters = route.includes('?')
    ? Object.fromEntries(new URLSearchParams(route.split('?')[1]))
    : {};

  const renderPage = () => {
    if (['/about', '/services', '/contact'].includes(route)) {
      return <InformationPages type={route.slice(1)} onNavigate={navigate} />;
    }
    // /admin
    if (route === '/admin') {
      return <AdminDashboard navigate={navigate} />;
    }

    // /order-success
    if (route === '/order-success' || route.startsWith('/order-success?')) {
      return <OrderSuccessPage orderData={orderData} onNavigate={navigate} />;
    }

    // /checkout
    if (route === '/checkout') {
      return <CheckoutPage onNavigate={navigate} checkoutData={checkoutData} />;
    }

    // /cart
    if (route === '/cart') {
      return <CartPage onNavigate={navigate} />;
    }

    // /products/:id  (detail)
    if (route.startsWith('/products/') && route.split('/').length === 3) {
      if (productLoading) return <div className="container page-state"><div className="spinner" /></div>;
      if (!product) return <div className="container page-state"><h1>Không tìm thấy sản phẩm</h1><button className="btn btn-primary" onClick={() => navigate('products')}>Xem sản phẩm</button></div>;
      return <ProductDetailPage product={product} onBack={() => navigate('products')} onNavigate={navigate} />;
    }

    // /products  (listing)
    if (route === '/products' || route.startsWith('/products?')) {
      return <ProductsPage initialFilters={queryFilters} onSelectProduct={selectProduct} />;
    }

    // home
    return <HomePage onNavigate={navigate} onSelectProduct={selectProduct} />;
  };

  const isAdminRoute = route === '/admin';

  return (
    <div className="app-shell">
      {!isAdminRoute && (
        <Header
          onNavigate={navigate}
          currentView={route.startsWith('/products') ? 'products' : route === '/' ? 'home' : route.slice(1)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={(keyword) => navigate('products', { keyword })}
        />
      )}
      <main className={isAdminRoute ? '' : 'main-content'}>
        {renderPage()}
      </main>
      {!isAdminRoute && <Footer onNavigate={navigate} />}

      {/* Global overlays */}
      <CartDrawer onNavigate={navigate} />
      {isAuthModalOpen && <AuthModal />}
      {toastMessage && (
        <Toast
          message={toastMessage.message}
          type={toastMessage.type}
          key={toastMessage.id}
        />
      )}
    </div>
  );
}
