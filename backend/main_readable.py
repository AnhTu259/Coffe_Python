from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import os
import models
import schemas
from database import SessionLocal, engine
from passlib.hash import pbkdf2_sha256
import jwt
from datetime import datetime, timedelta

# Tạo database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Coffee Shop API", version="1.0.0", description="API cho website bán cà phê")

# Cấu hình CORS để frontend có thể kết nối
# Cho phép các origin từ frontend (có thể thêm nhiều origin khác nếu cần)
cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://localhost:3002,"
    "http://localhost:5000,http://localhost:4173"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency để lấy database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==================== AUTH HELPERS ====================

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "120"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=JWT_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")


def get_current_admin(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if not user or not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin required")
    return user


# Seed admin user if not exists
def ensure_admin_seed(db: Session):
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
    user = db.query(models.User).filter(models.User.username == admin_username).first()
    if not user:
        user = models.User(
            username=admin_username,
            password_hash=pbkdf2_sha256.hash(admin_password),
            is_admin=True,
        )
        db.add(user)
        db.commit()


with SessionLocal() as _db:
    ensure_admin_seed(_db)


@app.post("/auth/login", response_model=schemas.TokenResponse)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == req.username).first()
    if not user or not pbkdf2_sha256.verify(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "is_admin": user.is_admin})
    return schemas.TokenResponse(access_token=token)


@app.post("/auth/register", response_model=schemas.User)
def register(req: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == req.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    # Always force non-admin on public registration
    user = models.User(
        username=req.username,
        password_hash=pbkdf2_sha256.hash(req.password),
        is_admin=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@app.get("/")
def read_root():
    return {"message": "Welcome to Coffee Shop API", "version": "1.0.0"}


# ==================== PRODUCTS API ====================

@app.get("/api/products", response_model=List[schemas.Product])
def get_products(
    skip: int = 0, 
    limit: int = 100,
    category: Optional[str] = None,
    in_stock: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Lấy danh sách tất cả sản phẩm cà phê"""
    query = db.query(models.Product)
    
    if category:
        query = query.filter(models.Product.category == category)
    if in_stock is not None:
        query = query.filter(models.Product.in_stock == in_stock)
    
    products = query.offset(skip).limit(limit).all()
    return products


@app.get("/api/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Lấy một sản phẩm theo ID"""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/admin/products", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    """Tạo sản phẩm mới (admin)"""
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@app.put("/admin/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    """Cập nhật sản phẩm (admin)"""
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product


@app.delete("/admin/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    """Xóa sản phẩm (admin)"""
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(db_product)
    db.commit()
    return {"message": "Product deleted successfully"}


@app.get("/api/products/category/{category}", response_model=List[schemas.Product])
def get_products_by_category(category: str, db: Session = Depends(get_db)):
    """Lấy sản phẩm theo danh mục"""
    products = db.query(models.Product).filter(models.Product.category == category).all()
    return products


# ==================== ORDERS API ====================

@app.post("/api/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    """Tạo đơn hàng mới"""
    # Convert items to JSON string
    items_json = json.dumps([item.model_dump() for item in order.items])
    
    db_order = models.Order(
        customer_name=order.customer_name,
        customer_email=order.customer_email,
        customer_phone=order.customer_phone,
        total_amount=order.total_amount,
        items=items_json,
        status="pending"
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


# ==================== INVENTORY API ====================

@app.get("/admin/inventory/movements", response_model=List[schemas.InventoryMovement])
def list_inventory_movements(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    movements = db.query(models.InventoryMovement).order_by(models.InventoryMovement.created_at.desc()).offset(skip).limit(limit).all()
    return movements


@app.post("/admin/inventory/import", response_model=schemas.InventoryMovement)
def import_inventory(movement: schemas.InventoryMovementCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    product = db.query(models.Product).filter(models.Product.id == movement.product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    product.stock_quantity = (product.stock_quantity or 0) + movement.quantity
    product.in_stock = product.stock_quantity > 0

    db_movement = models.InventoryMovement(
        product_id=movement.product_id,
        type="import",
        quantity_change=movement.quantity,
        note=movement.note,
    )
    db.add(db_movement)
    db.commit()
    db.refresh(db_movement)
    return db_movement


@app.post("/admin/inventory/export", response_model=schemas.InventoryMovement)
def export_inventory(movement: schemas.InventoryMovementCreate, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    product = db.query(models.Product).filter(models.Product.id == movement.product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    if (product.stock_quantity or 0) < movement.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock to export")

    product.stock_quantity = (product.stock_quantity or 0) - movement.quantity
    product.in_stock = product.stock_quantity > 0

    db_movement = models.InventoryMovement(
        product_id=movement.product_id,
        type="export",
        quantity_change=-movement.quantity,
        note=movement.note,
    )
    db.add(db_movement)
    db.commit()
    db.refresh(db_movement)
    return db_movement


@app.get("/admin/inventory/summary", response_model=List[schemas.InventorySummary])
def inventory_summary(db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    products = db.query(models.Product).all()
    summaries = [
        schemas.InventorySummary(
            product_id=p.id,
            product_name=p.name,
            stock_quantity=p.stock_quantity or 0,
        )
        for p in products
    ]
    return summaries


@app.get("/admin/orders", response_model=List[schemas.Order])
def get_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    """Lấy danh sách đơn hàng (admin)"""
    orders = db.query(models.Order).order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders


@app.get("/api/orders/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Lấy một đơn hàng theo ID"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.put("/admin/orders/{order_id}", response_model=schemas.Order)
def update_order(order_id: int, order: schemas.OrderUpdate, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    """Cập nhật trạng thái đơn hàng"""
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status:
        db_order.status = order.status
    
    db.commit()
    db.refresh(db_order)
    return db_order


# ==================== USERS (ADMIN) ====================

@app.get("/admin/users", response_model=List[schemas.User])
def list_users(db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    return users


@app.put("/admin/users/{user_id}/role", response_model=schemas.User)
def update_user_role(user_id: int, payload: schemas.UserRoleUpdate, db: Session = Depends(get_db), _: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_admin = bool(payload.is_admin)
    db.commit()
    db.refresh(user)
    return user

