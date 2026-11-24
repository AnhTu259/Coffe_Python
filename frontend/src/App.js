import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import ProductList from './components/ProductList/ProductList';
import Review from './components/Review/Review';
import Contact from './components/Contact/Contact';
import Blogs from './components/Blogs/Blogs';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';
import Loader from './components/Loader/Loader';
import CoffeeBeans from './features/coffeeBeans/CoffeeBeans';
import Checkout from './features/checkout/Checkout';
import OrderSuccess from './Order/OrderSuccess';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Profile from './features/profile/Profile';
import { getProducts, createOrder } from './services/api';

/**
 * HomePage component hiển thị trang chủ của ứng dụng.
 * Bao gồm các phần như Hero, About, Menu (danh sách sản phẩm), Review, Contact và Blogs.
 * Nó nhận các props liên quan đến giỏ hàng, tìm kiếm và lọc sản phẩm.
 */
function HomePage({
  cart,
  addToCart,
  removeFromCart,
  updateQuantity,
  getTotalPrice,
  getCartItemsCount,
  handleSearch,
  filteredProducts,
  loading,
  searchTerm,
  selectedCategory,
  setSelectedCategory,
  error
}) {
  const navigate = useNavigate(); // Hook để điều hướng chương trình
  return (
    <>
      {/* Phần Hero: Hiển thị banner chính và nút mua sắm */}
      <Hero onShopClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })} />
      
      {/* Phần About: Giới thiệu về cửa hàng */}
      <About />
      
      {/* Hiển thị thông báo lỗi nếu có */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()}>✕</button>
        </div>
      )}

      {/* Phần Menu: Hiển thị danh sách sản phẩm và bộ lọc */}
      <section id="menu" className="menu-section">
        <div className="menu-container">
          <h2 className="section-title">OUR MENU</h2>
          
          {/* Bộ lọc danh mục sản phẩm */}
          <div className="category-filters">
            <button
              className={`category-filter-btn ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => { setSelectedCategory(null); navigate('/products'); }}
            >
              All
            </button>
            {/* Render các nút lọc theo danh mục */}
            {['Espresso', 'Cappuccino', 'Latte', 'Americano', 'Mocha', 'Frappuccino'].map(cat => (
              <button
                key={cat}
                className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Hiển thị trạng thái tải hoặc danh sách sản phẩm */}
          {loading ? (
            <div className="loading">Đang tải sản phẩm...</div>
          ) : (
            <>
              {/* Hiển thị thông tin kết quả tìm kiếm nếu có searchTerm */}
              {searchTerm && (
                <div className="search-results-info">
                  Tìm thấy {filteredProducts.length} sản phẩm cho "{searchTerm}"
                </div>
              )}
              {/* Danh sách sản phẩm */}
              <ProductList products={filteredProducts} onAddToCart={addToCart} />
              {/* Nút xem thêm sản phẩm, điều hướng đến trang /products */}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <button className="category-filter-btn" onClick={() => navigate('/products')}>
                  Xem thêm
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Phần Review: Đánh giá của khách hàng */}
      <Review />

      {/* Phần Contact: Thông tin liên hệ */}
      <Contact />

      {/* Phần Blogs: Các bài viết blog */}
      <Blogs />
    </>
  );
}

/**
 * Component chính của ứng dụng, quản lý trạng thái toàn cục và định tuyến.
 * Bao gồm Header, Footer và các Route cho các trang khác nhau.
 * Xử lý việc tải sản phẩm, giỏ hàng, tìm kiếm và đặt hàng.
 */
function AppContent() {
  const [products, setProducts] = useState([]); // Danh sách tất cả sản phẩm
  const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách sản phẩm đã lọc/tìm kiếm
  const [cart, setCart] = useState([]); // Giỏ hàng
  const [selectedCategory, setSelectedCategory] = useState(null); // Danh mục sản phẩm được chọn đ�� lọc
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Thông báo lỗi
  const [showCart, setShowCart] = useState(false); // Trạng thái hiển thị giỏ hàng
  const [isPageLoading, setIsPageLoading] = useState(false); // Trạng thái loader khi chuyển trang

  const location = useLocation();

  // Hiển thị loader khi chuyển trang
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Tự động đăng nhập nếu có token trong localStorage
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      localStorage.setItem('is_logged_in', 'true');
    }
  }, []);

  /**
   * Hàm bất đồng bộ để lấy danh sách sản phẩm từ API.
   * Sử dụng useCallback để memoize hàm, tránh tạo lại hàm không cần thiết.
   */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(selectedCategory, true);
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm. Vui lòng kiểm tra backend.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]); // Phụ thuộc vào selectedCategory

  /**
   * Xử lý sự kiện tìm kiếm, cập nhật từ khóa tìm kiếm.
   */
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // useEffect để gọi fetchProducts khi component mount hoặc selectedCategory thay đổi
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // useEffect để lọc sản phẩm khi `products` hoặc `searchTerm` thay đổi
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchTerm]); // Phụ thuộc vào products và searchTerm

  /**
   * Thêm sản phẩm vào giỏ hàng.
   * Nếu sản phẩm đã có, tăng số lượng. Ngược lại, thêm sản phẩm mới vào giỏ.
   */
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  /**
   * Xóa sản phẩm khỏi giỏ hàng dựa trên productId.
   */
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  /**
   * Cập nhật số lượng của một sản phẩm trong giỏ hàng.
   * Nếu số lượng <= 0, sản phẩm sẽ bị xóa khỏi giỏ.
   */
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  /**
   * Tính tổng giá trị của các sản phẩm trong giỏ hàng.
   */
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  /**
   * Đếm tổng số lượng sản phẩm trong giỏ hàng.
   */
  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  /**
   * Xử lý hoàn tất đơn hàng.
   * Tạo đối tượng đơn hàng từ giỏ hàng, gọi API tạo đơn hàng và xóa giỏ hàng sau khi thành công.
   */
  const handleOrderComplete = async (orderData) => {
    try {
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const order = {
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        items: orderItems,
        total_amount: getTotalPrice()
      };

      await createOrder(order);
      setCart([]); // Xóa giỏ hàng sau khi đặt hàng thành công
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  };

  const hideFooter = location.pathname === '/login' || 
                     location.pathname === '/register' || 
                     location.pathname === '/profile' || 
                     location.pathname === '/checkout' || 
                     location.pathname === '/order-success' ||
                     showCart;

  return (
    <div className="App"> {/* Container chính của ứng dụng */}
      {/* Loader khi chuyển trang */}
      {isPageLoading && <Loader />}

      {/* Header của ứng dụng, truyền các props liên quan đến giỏ hàng và tìm kiếm */}
      <Header 
        cartItemsCount={getCartItemsCount()} 
        onCartClick={() => setShowCart(!showCart)}
        onSearch={handleSearch}
      />
      
      {/* Định tuyến các trang khác nhau */}
      <Routes>
        {/* Route cho trang chủ */}
        <Route 
          path="/" 
          element={
            <HomePage
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              getTotalPrice={getTotalPrice}
              getCartItemsCount={getCartItemsCount}
              handleSearch={handleSearch}
              filteredProducts={filteredProducts}
              loading={loading}
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              error={error}
            />
          } 
        />
        {/* Route cho trang đăng nhập */}
        <Route path="/login" element={<Login />} />
        {/* Route cho trang đăng ký */}
        <Route path="/register" element={<Register />} />
        {/* Route cho trang hồ sơ cá nhân */}
        <Route path="/profile" element={<Profile />} />
        {/* Route cho trang sản phẩm (CoffeeBeans) */}
        <Route 
          path="/products" 
          element={<CoffeeBeans onAddToCart={addToCart} />} 
        />
        {/* Route cho trang thanh toán */}
        <Route 
          path="/checkout" 
          element={
            <Checkout
              cart={cart}
              totalPrice={getTotalPrice()}
              onOrderComplete={handleOrderComplete}
            />
          } 
        />
        {/* Route cho trang đặt hàng thành công */}
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>

      {/* Footer của ứng dụng */}
      {!hideFooter && <Footer />}

      {/* Component giỏ hàng, hiển thị khi `showCart` là true */}
      {showCart && (
        <Cart
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClose={() => setShowCart(false)}
          totalPrice={getTotalPrice()}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
