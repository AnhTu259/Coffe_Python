# Sử dụng Python 3.11 slim image
FROM python:3.11-slim

# Đặt working directory
WORKDIR /app

# Cài đặt system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file trước để tận dụng Docker cache
COPY requirements.txt .

# Cài đặt Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ code backend
COPY . .

# Copy entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Tạo thư mục data để lưu database
RUN mkdir -p /app/data

# Expose port 8000
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1

# Sử dụng entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]

