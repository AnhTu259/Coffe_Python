import React from 'react';
import './ProductCard.css';

/**
 * Component ProductCard hiển thị thông tin chi tiết của một sản phẩm.
 * Bao gồm hình ảnh, tên, giá, xếp hạng, và các nút hành động.
 */
function ProductCard({ product, onAddToCart }) {
  // Giả sử sản phẩm có các thuộc tính này, nếu không có thì dùng giá trị mặc định
  const {
    name,
    image_url,
    price,
    old_price, // Giá cũ để hiển thị khi có giảm giá
    rating = 4.5, // Xếp hạng sao, mặc định là 4.5
    stock = 10 // Số lượng tồn kho, mặc định là 10
  } = product;

  const isOutOfStock = stock === 0;
  const isOnSale = old_price && old_price > price;

  // Hàm tạo các ngôi sao xếp hạng
  const renderRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star"></i>); // Sao đầy
      } else if (i - 0.5 <= rating) {
        stars.push(<i key={i} className="fas fa-star-half-alt"></i>); // Nửa sao
      } else {
        stars.push(<i key={i} className="far fa-star"></i>); // Sao rỗng
      }
    }
    return stars;
  };

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="product-image">
        <img src={image_url} alt={name} />
        {/* Các nút hành động (xem nhanh, thêm vào yêu thích) */}
        <div className="product-actions">
          <div className="action-icon" title="Xem nhanh">
            <i className="fas fa-eye"></i>
          </div>
          <div className="action-icon" title="Thêm vào yêu thích">
            <i className="fas fa-heart"></i>
          </div>
        </div>
        {/* Huy hiệu hết hàng */}
        {isOutOfStock && <div className="out-of-stock-badge">Hết hàng</div>}
        {/* Huy hiệu giảm giá */}
        {isOnSale && !isOutOfStock && <div className="sale-badge">Sale</div>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        {/* Xếp hạng sao */}
        <div className="product-rating">{renderRating()}</div>
        {/* Giá sản phẩm */}
        <div className="product-price-container">
          <p className="product-price">{price.toLocaleString('vi-VN')} VNĐ</p>
          {isOnSale && <p className="product-price-old">{old_price.toLocaleString('vi-VN')} VNĐ</p>}
        </div>
        {/* Nút thêm vào giỏ hàng */}
        <button
          className="add-to-cart-btn"
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;