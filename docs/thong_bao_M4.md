# THÔNG BÁO ĐỒNG BỘ NGHỆP VỤ BOOKING CHO THÀNH VIÊN M4

> **Gửi:** Thành viên M4 (Phụ trách Phân hệ Booking & Concurrency)  
> **Dự án:** MedSi (YouMed Mini)  
> **Nội dung:** Cấu trúc đã khởi tạo cho `BookingService` & Hướng dẫn tích hợp tiếp theo.

---

## 📌 1. Các phần đã được khởi tạo (Đã đồng bộ vào codebase)

Để phục vụ tính năng **"Lấy lịch sử booking của user"**, các thành phần thuộc Domain Booking đã được tạo sẵn theo cấu trúc chuẩn Clean Architecture / Service-Layer Pattern:

1. **`app/Services/BookingService.php`**
   - Đã cài đặt method `getUserBookings(int $userId, array $filters = [])`:
     - Tự động scoped query theo `user_id`.
     - Eager loading quan hệ tránh N+1: `patientProfile`, `doctor.specialty`, `hospital`, `examType`, `slot`, `payment`.
     - Hỗ trợ lọc theo `status` (`pending`, `confirmed`, `completed`, `cancelled`).
     - Hỗ trợ tìm kiếm từ khóa `q` / `keyword` (mã `code`, tên bệnh nhân, tên bác sĩ, tên bệnh viện).
     - Phân trang `paginate($perPage)`.

2. **`app/Http/Controllers/Api/BookingController.php`**
   - Đã cài đặt method `index(Request $request)` phục vụ endpoint `GET /api/bookings`.

3. **`routes/api.php`**
   - Đã đăng ký route bảo vệ Sanctum:
     ```php
     Route::middleware('auth:sanctum')->group(function () {
         Route::get('/bookings', [BookingController::class, 'index']);
     });
     ```

4. **`tests/Feature/BookingHistoryTest.php`**
   - Đã có bộ test cases kiểm tra cho Service và API endpoint.

---

## 🚀 2. Nhiệm vụ của M4 tiếp theo

M4 vui lòng **viết tiếp các phương thức nghiệp vụ đặt/hủy lịch vào trực tiếp 2 file đã dựng sẵn** (`BookingService.php` và `BookingController.php`) theo danh sách dưới đây:

### 🔹 Task 2.1: Viết method Đặt lịch khám (`createBooking`)
- **Trong `BookingService.php`:** Viết method `createBooking(array $data, int $userId): Booking`
  - Sử dụng `DB::transaction()` và khóa dòng slot bằng `Slot::lockForUpdate()` để chống lỗi Overbooking khi nhiều người cùng bấm đặt.
  - Kiểm tra điều kiện `booked_count < capacity` (nếu đầy -> ném `SlotUnavailableException`).
  - Kiểm tra trùng lặp `(patient_profile_id, slot_id)` (nếu trùng -> ném `BookingAlreadyExistsException`).
  - Tạo record `Booking` (Mã phiếu khám `code` tự động sinh dạng `BK2026...` theo quy tắc boot của Model).
  - Tăng `booked_count` của slot tương ứng.
  - Khởi tạo record `payments` mặc định (nếu có).
- **Trong `BookingController.php`:** Viết method `store(CreateBookingRequest $request)`
  - Endpoint: `POST /api/bookings`

---

### 🔹 Task 2.2: Viết method Hủy lịch khám (`cancelBooking`)
- **Trong `BookingService.php`:** Viết method `cancelBooking(int $bookingId, int $userId, ?string $reason = null): Booking`
  - Kiểm tra xem booking có đúng thuộc về `user_id = $userId` không (nếu không -> trả 403 / Forbidden).
  - Chỉ cho phép hủy khi trạng thái lịch hiện tại là `pending` (nếu là `confirmed`, `completed`, `cancelled` -> trả lỗi 422).
  - Cập nhật status sang `cancelled`, lưu lý do `cancel_reason`.
  - Giảm `booked_count` của slot tương ứng trong `DB::transaction()`.
- **Trong `BookingController.php`:** Viết method `cancel(int $id, CancelBookingRequest $request)`
  - Endpoint: `PATCH /api/bookings/{id}/cancel`

---

### 🔹 Task 2.3: Viết method Xem chi tiết lịch khám (`getBookingDetail`)
- **Trong `BookingService.php`:** Viết method `getBookingDetail(int $bookingId, int $userId): Booking`
  - Scoped query theo `user_id` và eager load đầy đủ quan hệ.
- **Trong `BookingController.php`:** Viết method `show(int $id)`
  - Endpoint: `GET /api/bookings/{id}`

---

## 🛠️ 3. Danh sách Endpoints chuẩn của Booking Module

| HTTP Method | Route Endpoint | Action Controller | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/bookings` | `BookingController@index` | *(Đã làm)* Lấy danh sách lịch khám của user |
| `POST` | `/api/bookings` | `BookingController@store` | *(M4 làm tiếp)* Đặt lịch khám mới |
| `GET` | `/api/bookings/{id}` | `BookingController@show` | *(M4 làm tiếp)* Xem chi tiết lịch khám |
| `PATCH` | `/api/bookings/{id}/cancel` | `BookingController@cancel` | *(M4 làm tiếp)* Hủy lịch khám |

---

## 💡 Note lưu ý về Code Conventions:
- Tránh viết logic database trong Controller, giữ Controller mỏng và gọi Service.
- Ném Custom Exceptions khi vi phạm business rules (kế thừa từ `BusinessException.php`).
- Mọi API Response trả về đồng nhất cấu trúc:
  ```json
  {
    "success": true,
    "message": "Thông báo thành công",
    "data": { ... }
  }
  ```
