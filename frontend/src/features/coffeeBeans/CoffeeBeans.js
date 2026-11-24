// Trang sản phẩm dùng chung. Hiển thị danh sách sản phẩm và bộ lọc đơn giản.
import React, { useState, useEffect } from 'react';
import './CoffeeBeans.css';
import ProductList from '../../components/ProductList/ProductList';
import { getProducts } from '../../services/api';

// Component chính của trang sản phẩm. Nhận onAddToCart từ App để thêm vào giỏ.
function CoffeeBeans({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const coffeeBeanTypes = [
    'Arabica',
    'Robusta',
    'Liberica',
    'Excelsa',
    'All'
  ];

  // Tải danh sách sản phẩm từ API, chỉ lấy hàng còn bán (in_stock=true)
  useEffect(() => {
    const fetchCoffeeBeans = async () => {
      setLoading(true);
      try {
        const data = await getProducts(null, true);
        // Không giới hạn chỉ "Coffee Beans" nữa để dùng chung toàn bộ sản phẩm
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error fetching coffee beans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoffeeBeans();
  }, []);

  // Lọc theo loại được chọn (ví dụ Arabica/Robusta), nếu không chọn thì hiển thị tất cả
  useEffect(() => {
    if (selectedType && selectedType !== 'All') {
      const filtered = products.filter(p =>
        p.name?.toLowerCase().includes(selectedType.toLowerCase()) ||
        p.description?.toLowerCase().includes(selectedType.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedType, products]);

  // Thêm vào giỏ: ưu tiên callback từ App, nếu không có thì lưu tạm LocalStorage
  const handleAddToCart = (product) => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      // Lưu tạm vào localStorage và phát sự kiện để đồng bộ với App nếu cần
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      // Đồng bộ giỏ hàng cho các thành phần khác (nếu lắng nghe)
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  return (
    <div className="coffee-beans-page">
      {/* Phần hero tối giản tiêu đề trang */}
      <section className="coffee-beans-hero">
        <div className="coffee-beans-hero-content">
          <h1 className="coffee-beans-title">SẢN PHẨM</h1>
          <p className="coffee-beans-subtitle">Khám phá các sản phẩm nổi bật của chúng tôi</p>
        </div>
      </section>

      <section className="coffee-beans-content">
        <div className="coffee-beans-container">
          {/* Bỏ phần thông tin giới thiệu để giao diện gọn gàng hơn */}

          <div className="coffee-beans-products">
            <h2 className="section-title">TẤT CẢ SẢN PHẨM</h2>
            
            <div className="type-filters">
              {coffeeBeanTypes.map(type => (
                <button
                  key={type}
                  className={`type-filter-btn ${selectedType === type || (type === 'All' && !selectedType) ? 'active' : ''}`}
                  onClick={() => setSelectedType(type === 'All' ? null : type)}
                >
                  {type}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="loading">Đang tải sản phẩm...</div>
            ) : (
              <>
                {filteredProducts.length === 0 ? (
                  <div className="empty-state">
                    <p>📦 Chưa có sản phẩm. Vui lòng quay lại sau!</p>
                  </div>
                ) : (
                  <ProductList products={filteredProducts} onAddToCart={handleAddToCart} />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CoffeeBeans;

