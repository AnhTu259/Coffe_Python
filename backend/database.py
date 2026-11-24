import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Cho phép override đường dẫn DB qua biến môi trường.
# Ưu tiên DATABASE_PATH (đã được set trong docker-compose), nếu không thì dùng DATABASE_DIR.
# Mặc định lưu dưới backend/data (cùng thư mục file này) để tránh tạo DB rải rác ở root.
BASE_DIR = Path(__file__).resolve().parent
custom_path = os.getenv("DATABASE_PATH")
custom_dir = os.getenv("DATABASE_DIR")

if custom_path:
    db_path = Path(custom_path)
else:
    db_dir = Path(custom_dir) if custom_dir else (BASE_DIR / "data")
    db_dir.mkdir(parents=True, exist_ok=True)
    db_path = db_dir / "DazzyCoffee.db"

db_path.parent.mkdir(parents=True, exist_ok=True)
SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
