# Backend API với FastAPI

## Cài đặt

```bash
pip install -r requirements.txt
```

## Chạy server

```bash
uvicorn main:app --reload --port 8000
```

## API Documentation

Sau khi chạy server, truy cập:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Cấu trúc

- `main.py`: FastAPI app và routes
- `models.py`: SQLAlchemy database models
- `schemas.py`: Pydantic schemas cho validation
- `database.py`: Database configuration

