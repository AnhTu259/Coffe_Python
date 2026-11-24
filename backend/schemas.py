from pydantic import BaseModel, ConfigDict, EmailStr
from datetime import datetime
from typing import Optional, List, Dict


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: Optional[str] = None
    in_stock: bool = True
    stock_quantity: Optional[int] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    in_stock: Optional[bool] = None
    stock_quantity: Optional[int] = None


class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderItem(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float


class OrderCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    customer_phone: Optional[str] = None
    items: List[OrderItem]
    total_amount: float


class OrderUpdate(BaseModel):
    status: Optional[str] = None


class Order(BaseModel):
    id: int
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    total_amount: float
    status: str
    items: str  # JSON string
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ==================== INVENTORY ====================

class InventoryMovementBase(BaseModel):
    product_id: int
    type: str  # import or export
    quantity_change: int
    note: Optional[str] = None


class InventoryMovementCreate(BaseModel):
    product_id: int
    quantity: int
    note: Optional[str] = None


class InventoryMovement(InventoryMovementBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class InventorySummary(BaseModel):
    product_id: int
    product_name: str
    stock_quantity: int


# ==================== AUTH ====================

class UserBase(BaseModel):
    username: str


class UserCreate(UserBase):
    password: str
    # Registration should never create admin by default
    is_admin: bool = False


class User(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserRoleUpdate(BaseModel):
    is_admin: bool