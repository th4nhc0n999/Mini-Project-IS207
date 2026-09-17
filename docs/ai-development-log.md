# AI Development Log — YouMed-Mini

Nhật ký ghi lại các giai đoạn phát triển, quyết định kiến trúc và lưu ý kỹ thuật khi xây dựng hệ thống YouMed-Mini.

---

## 📅 Giai đoạn 1: Thiết lập Kiến trúc & Khởi tạo Cấu trúc Dự án
- **Thời gian:** 2026-09-17
- **Mục tiêu:**
  - Định hình mô hình Client-Server phân tách giữa **Laravel 12 API** và **React + Vite**.
  - Thiết lập toàn bộ cấu trúc thư mục phân tầng cho Backend: Controllers, Form Requests, API Resources, Models, Services, và Custom Exceptions.
  - Phân vùng cấu trúc thư mục Frontend: pages, components, api, context.
- **Quyết định kiến trúc quan trọng:**
  1. **Clean Architecture / Service-Layer Pattern:** Tách rời hoàn toàn nghiệp vụ ra khỏi Controller để đưa vào các `Services` (`AuthService`, `DoctorService`, `BookingService` và các Service dành cho Admin).
  2. **Custom Domain Exceptions:** Định nghĩa các Exceptions độc lập (`SlotUnavailableException`, `BookingAlreadyExistsException`, `DoctorNotFoundException`, `InvalidCredentialsException`) kế thừa từ `BusinessException` để mã nguồn tự sinh thông báo lỗi chuẩn xác và trả mã HTTP tương ứng.
  3. **Concurrency Control:** Sử dụng Database Transactions kết hợp Pessimistic Locking (`lockForUpdate`) trên bảng `slots` để giải quyết triệt để lỗi Overbooking khi nhiều bệnh nhân cùng đặt một slot khám.
  4. **Frontend Tech Stack:** Sử dụng React 19 + Vite, chuẩn bị tích hợp Tailwind CSS và các UI components linh hoạt theo tinh thần shadcn/ui.

---

## 📅 Giai đoạn tiếp theo (Roadmap)
- **Giai đoạn 2 (Database & Models):**
  - Viết migrations cho các bảng: `users`, `specialties`, `doctors`, `slots`, `bookings`.
  - Thiết lập quan hệ Eloquent ORM và Model Factories / Seeders cho dữ liệu mẫu.
- **Giai đoạn 3 (Backend API & Services):**
  - Cài đặt Laravel Sanctum & cấu hình CORS.
  - Viết Form Requests & Business Services.
  - Viết API Controllers và Resource Transformers.
- **Giai đoạn 4 (Frontend UI & Integration):**
  - Cấu hình Tailwind CSS, Axios Client, AuthContext.
  - Xây dựng giao diện trang chủ, tìm kiếm bác sĩ, đặt lịch khám và trang quản trị Admin.
- **Giai đoạn 5 (Testing & Optimization):**
  - Chạy Feature tests kiểm tra Race Condition đặt lịch.
  - Tối ưu hóa UI/UX và responsive.
