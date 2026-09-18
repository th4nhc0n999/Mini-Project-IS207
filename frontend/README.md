# MedSi Frontend

Frontend của MedSi sử dụng React 19 và Vite. Frontend gọi backend Laravel qua
HTTP API và dùng biến môi trường `VITE_API_BASE_URL` để cấu hình địa chỉ API.

## Chạy local

```bash
cd frontend
npm install
```

Tạo file `.env`:

```ini
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Khởi động development server:

```bash
npm run dev
```

## Kiểm tra và build

```bash
npm run lint
npm run build
```

Xem kiến trúc chung và tài liệu database tại [README.md](../README.md) và
[docs/database-schema.md](../docs/database-schema.md).
