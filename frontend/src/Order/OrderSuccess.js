import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

/**
 * Component OrderSuccess hiển thị trang xác nhận sau khi đặt hàng thành công.
 * Nó hiển thị chi tiết đơn hàng và thông tin khách hàng.
 */
function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu từ state được truyền qua navigate
  const { orderData, cart, totalPrice } = location.state || {};

  // Nếu không có dữ liệu, điều hướng về trang chủ
  if (!orderData || !cart) {
    navigate('/');
    return null;
  }

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1 className="success-title">Đặt hàng thành công!</h1>
        <p className="success-subtitle">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.</p>
        
        <div className="order-details-summary">
          <h2>Chi tiết đơn hàng</h2>
          <div className="customer-info">
            <h3>Thông tin khách hàng</h3>
            <p><strong>Họ tên:</strong> {orderData.customer_name}</p>
            <p><strong>Email:</strong> {orderData.customer_email}</p>
            <p><strong>Số điện thoại:</strong> {orderData.customer_phone}</p>
            <p><strong>Địa chỉ:</strong> {orderData.address}</p>
          </div>
          
          <div className="ordered-items">
            <h3>Sản phẩm đã đặt</h3>
            {cart.map(item => (
              <div key={item.id} className="ordered-item">
                <span>{item.name} (x{item.quantity})</span>
                <span>{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
              </div>
            ))}
          </div>
          
          <div className="total-summary">
            <h3>Tổng cộng</h3>
            <p>{totalPrice.toLocaleString('vi-VN')} VNĐ</p>
          </div>
        </div>
        
        <button onClick={() => navigate('/')} className="back-home-btn">
          Quay về trang chủ
        </button>
      </div>
    </div>
  );
}

export default OrderSuccess;
