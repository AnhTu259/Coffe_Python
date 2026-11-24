# 🐳 Hướng dẫn chạy Backend với Docker

## Yêu cầu
- Docker Engine 20.10+
- Docker Compose 2.0+

## Cách chạy

### 1. Build và chạy với Docker Compose

```bash
# Từ thư mục root của project
docker compose down
docker system prune -af   # tùy chọn – nếu muốn sạch 100%
docker compose build --no-cache
docker compose up -d

```

Lệnh này sẽ:
- Build Docker image cho backend
- Tạo và chạy container
- Tự động seed data nếu database chưa có
- Expose backend tại port 8000

### 2. Kiểm tra logs

```bash
# Xem logs của backend
docker-compose logs -f backend
```

### 3. Truy cập API

- API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- API Redoc: http://localhost:8000/redoc

### 4. Dừng container

```bash
# Dừng container
docker-compose down

# Dừng và xóa volumes (xóa database)
docker-compose down -v
```

## Các lệnh hữu ích

```bash
# Rebuild container sau khi thay đổi code
docker-compose up -d --build

# Restart container
docker-compose restart backend

# Xem logs real-time
docker-compose logs -f backend

# Vào trong container
docker-compose exec backend bash

# Chạy seed data thủ công trong container
docker-compose exec backend python seed_data.py
```

## Environment Variables

Bạn có thể tùy chỉnh bằng cách thêm vào `docker-compose.yml`:

```yaml
environment:
  - DATABASE_PATH=/app/DazzyCoffee.db
  - CORS_ORIGINS=http://localhost:3000,http://localhost:5000
```

## Volume Mounts

- `./backend/coffee_shop.db:/app/DazzyCoffee.db` - Database file được persist
- `./backend:/app` - Code được mount để development (hot reload)

## Troubleshooting

**Lỗi: Port 8000 đã được sử dụng**
- Đổi port trong `docker-compose.yml`: `"8001:5000"`

**Lỗi: Permission denied**
- Trên Linux/Mac, có thể cần: `sudo docker-compose up`

**Lỗi: Database không persist**
- Kiểm tra volume mount trong `docker-compose.yml`
- Đảm bảo file `DazzyCoffee.db` có quyền write

**Lỗi: CORS từ frontend**
- Thêm URL frontend vào `CORS_ORIGINS` environment variable

