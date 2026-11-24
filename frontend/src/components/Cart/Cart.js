import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

/**
 * Component Cart hiển thị giỏ hàng của người dùng.
 * Nó hiển thị danh sách các sản phẩm trong giỏ, cho phép cập nhật số lượng và xóa sản phẩm.
 * Cũng hiển thị tổng giá trị của giỏ hàng và nút để đi đến trang thanh toán.
 */
function Cart({ cart, onUpdateQuantity, onRemoveItem, onClose, totalPrice }) {
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose(); // Đóng giỏ hàng
    navigate('/checkout'); // Điều hướng đến trang thanh toán
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Giỏ hàng của bạn</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Giỏ hàng của bạn đang trống.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} />
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">{item.price.toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <div className="cart-item-actions">
                  <button className="quantity-btn" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span className="quantity">{item.quantity}</span>
                  <button className="quantity-btn" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button className="remove-btn" onClick={() => onRemoveItem(item.id)}>
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Tổng cộng:</span>
              <span>{totalPrice.toLocaleString('vi-VN')} VNĐ</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Thanh toán
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;