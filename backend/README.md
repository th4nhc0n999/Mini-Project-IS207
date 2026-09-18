# MedSi Backend

Backend API của MedSi được xây dựng bằng Laravel 12, PHP 8.2+ và MySQL.

## Phạm vi

- Cấu hình API và xác thực bằng Laravel Sanctum.
- Migrations cho 9 bảng nghiệp vụ: `users`, `patient_profiles`, `specialties`,
  `doctors`, `hospitals`, `exam_types`, `slots`, `bookings`, `payments`.
- Bảng `migrations` là bảng kỹ thuật của Laravel, không thuộc schema nghiệp vụ.
- Route hiện có: `GET /api/user` với middleware `auth:sanctum`.

## Chạy local

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

Thiết lập `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`,
`DB_USERNAME` và `DB_PASSWORD` trong `.env` trước khi chạy migration.

## Kiểm tra

```bash
php artisan migrate:status
php artisan test
```

Xem tài liệu tổng quan, kiến trúc và schema tại [README.md](../README.md) và
[docs/database-schema.md](../docs/database-schema.md).
