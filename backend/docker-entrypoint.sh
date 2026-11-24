#!/bin/bash
# Entrypoint script cho Docker container

# Chờ database sẵn sàng (nếu cần cho PostgreSQL/MySQL)
# Hiện tại SQLite không cần chờ

# Set database directory
export DATABASE_DIR="/app/data"

# Chạy seed data nếu chưa có
if [ ! -f /app/data/DazzyCoffee.db ] || [ ! -s /app/data/DazzyCoffee.db ]; then
    echo "Khởi tạo database và seed data..."
    python seed_data.py
fi

# Chạy uvicorn server với auto-reload trong development
if [ "$ENVIRONMENT" = "development" ]; then
    exec uvicorn main:app --host 0.0.0.0 --port 5000 --reload
else
    exec uvicorn main:app --host 0.0.0.0 --port 5000
fi

