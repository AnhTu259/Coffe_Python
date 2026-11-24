from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    DateTime,
    Text,
    ForeignKey
)
from datetime import datetime
from database import Base


# ---------------------- PRODUCT ----------------------
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True) # Mã sản phẩm
    name = Column(String, index=True, nullable=False) # Tên sản phẩm
    description = Column(Text, nullable=True) # Mô tả sản phẩm
    price = Column(Float, nullable=False) # Giá sản phẩm
    image_url = Column(String, nullable=True)   # URL hình ảnh sản phẩm
    category = Column(String, nullable=True) # Danh mục sản phẩm
    in_stock = Column(Boolean, default=True) # Còn hàng hay không
    stock_quantity = Column(Integer, default=100) # Số lượng trong kho
    created_at = Column(DateTime, default=datetime.utcnow) # Ngày tạo
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) # Ngày cập nhật


# ---------------------- ORDER ----------------------
class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True) # Mã đơn hàng
    customer_name = Column(String, nullable=False) # Tên khách hàng
    customer_email = Column(String, nullable=False) # Email khách hàng
    customer_phone = Column(String, nullable=True) # Số điện thoại khách hàng
    total_amount = Column(Float, nullable=False) # Tổng tiền đơn hàng
    status = Column(String, default="pending") # Trạng thái đơn hàng
    items = Column(Text, nullable=False) # JSON string lưu chi tiết sản phẩm trong đơn hàng
    created_at = Column(DateTime, default=datetime.utcnow) # Ngày tạo đơn hàng
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow) # Ngày cập nhật đơn hàng


# ---------------------- INVENTORY MOVEMENT ----------------------
class InventoryMovement(Base):
    __tablename__ = "inventory_movements" 

    id = Column(Integer, primary_key=True, index=True) # Mã di chuyển kho
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False) # Mã sản phẩm
    type = Column(String, nullable=False)            # Loại di chuyển: "in" hoặc "out"
    quantity_change = Column(Integer, nullable=False) # Thay đổi số lượng
    note = Column(Text, nullable=True)               # Ghi chú
    created_at = Column(DateTime, default=datetime.utcnow) # Ngày tạo


# ---------------------- USER ----------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True) # Mã người dùng
    username = Column(String, unique=True, index=True, nullable=False)  # Tên đăng nhập
    password_hash = Column(String, nullable=False)  # Mật khẩu đã  dk
    is_admin = Column(Boolean, default=False) # Có phải quản trị viên hay không
    created_at = Column(DateTime, default=datetime.utcnow) # Ngày tạo
