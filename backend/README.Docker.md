# Hướng dẫn sử dụng Docker cho Backend

## Yêu cầu
- Docker và Docker Compose đã được cài đặt

## Cách chạy

### 1. Build và chạy với Docker Compose (Khuyến nghị)

```bash
cd backend
docker-compose up -d --build
```

Backend sẽ chạy tại: `http://localhost:8000`

### 2. Chạy với Docker thông thường

```bash
cd backend
docker build -t Dazzycoffee-backend .
docker run -d -p 8000:8000 -v $(pwd)/data:/app/data --name Dazzycoffee-backend Dazzycoffee-backend
```

### 3. Xem logs

```bash
docker-compose logs -f backend
# hoặc
docker logs -f coffee-backend
```

### 4. Dừng container

```bash
docker-compose down
# hoặc
docker stop coffee-backend
docker rm coffee-backend
```

### 5. Kiểm tra health

```bash
curl http://localhost:8000/
```

### 6. Xem API documentation

Mở trình duyệt và truy cập: `http://localhost:8000/docs`

## Lưu ý

- Database SQLite được lưu trong volume `coffee_db_data` hoặc thư mục `./data` để đảm bảo data được persist
- Port mặc định: 8000
- Health check tự động chạy mỗi 30 giây

## Environment Variables

Có thể set các biến môi trường trong `docker-compose.yml`:

```yaml
environment:
  - DATABASE_DIR=/app/data
  - ENVIRONMENT=production
```

