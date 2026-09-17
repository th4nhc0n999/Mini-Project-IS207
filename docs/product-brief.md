# Product Brief — YouMed-Mini

## 1. Giới thiệu sản phẩm
**YouMed-Mini** là ứng dụng web đặt lịch khám bệnh trực tuyến mô phỏng nền tảng YouMed, kết nối người bệnh với các bác sĩ thuộc nhiều chuyên khoa khác nhau một cách nhanh chóng, minh bạch và chính xác.

---

## 2. Mục tiêu sản phẩm (Product Goals)
- **Đối với Bệnh nhân:** Giảm thiểu thời gian chờ đợi tại phòng khám/bệnh viện, dễ dàng xem thông tin, chuyên môn của bác sĩ và chủ động lựa chọn khung giờ phù hợp.
- **Đối với Bác sĩ & Phòng khám:** Tối ưu hóa việc xếp lịch, quản lý tải khám bệnh theo khung giờ (slot capacity), hạn chế tối đa tình trạng quá tải hoặc trùng lịch khám.
- **Đối với Quản trị viên:** Quản lý dữ liệu tập trung (chuyên khoa, danh sách bác sĩ, lịch phân ca và thống kê booking).

---

## 3. Chân dung người dùng (User Personas)

### 3.1. Bệnh nhân (Patient)
- **Nhu cầu:** Tìm kiếm bác sĩ theo chuyên khoa (Nhi, Da liễu, Tai Mũi Họng...), xem giá khám, đánh giá và chọn ngày/giờ khám còn trống.
- **Hành vi:** Đăng nhập, tìm kiếm, đặt lịch trong vài bước đơn giản, nhận mã đặt lịch và theo dõi lịch sử khám bệnh.

### 3.2. Bác sĩ (Doctor)
- **Nhu cầu:** Nắm được danh sách các ca khám sắp tới trong ngày, thông tin triệu chứng ban đầu của bệnh nhân để chuẩn bị trước.

### 3.3. Quản trị viên (Admin)
- **Nhu cầu:** Thêm/sửa chuyên khoa, cấp tài khoản bác sĩ, cấu hình khung giờ làm việc (Slots) và kiểm soát toàn bộ các đơn đặt lịch.

---

## 4. Danh sách tính năng cốt lõi (Core Features)

### 4.1. Phân hệ Xác thực & Người dùng (Authentication & Authorization)
- Đăng ký tài khoản bệnh nhân (Họ tên, Email, Số điện thoại, Mật khẩu).
- Đăng nhập hệ thống (nhận Bearer Token qua Laravel Sanctum).
- Phân quyền (Role-based): `patient`, `doctor`, `admin`.
- Lấy thông tin cá nhân hiện tại (`/api/auth/me`).

### 4.2. Phân hệ Chuyên khoa & Bác sĩ (Specialties & Doctors)
- Danh sách chuyên khoa kèm biểu tượng/ảnh đại diện.
- Bộ lọc danh sách bác sĩ theo chuyên khoa, từ khóa tìm kiếm.
- Trang chi tiết bác sĩ: Học hàm/học vị, số năm kinh nghiệm, giá khám, mô tả tiểu sử và danh sách khung giờ khám (Slots) còn trống.

### 4.3. Phân hệ Khung giờ & Đặt lịch (Slot & Booking Management)
- **Khung giờ (Slot):** 
  - Mỗi khung giờ gắn với một bác sĩ, ngày khám, giờ bắt đầu - kết thúc, sức chứa tối đa (`max_patients`).
  - Trạng thái slot tự động chuyển thành `full` khi `booked_count >= max_patients`.
- **Đặt lịch (Booking):**
  - Bệnh nhân chọn slot còn trống và nhập ghi chú triệu chứng bệnh.
  - Hệ thống thực hiện khóa dòng (`lockForUpdate`) trong database transaction để ngăn chặn tuyệt đối tình trạng đặt trùng (Race Condition / Overbooking).
  - Tự động sinh mã phiếu khám định dạng chuẩn (ví dụ: `YM-20260917-AB12`).
  - Hủy lịch hẹn: Bệnh nhân có thể hủy phiếu hẹn khám khi lịch hẹn còn ở trạng thái hợp lệ.

### 4.4. Phân hệ Quản trị (Admin Portal)
- Dashboard tóm tắt: Tổng số chuyên khoa, bác sĩ, slot và lượt booking.
- CRUD Chuyên khoa (Specialty Management).
- CRUD Bác sĩ (Doctor Management).
- Khởi tạo Slot hàng loạt theo ngày và ca khám.
- Xem danh sách và lọc toàn bộ lịch hẹn khám bệnh.

---

## 5. Tiêu chuẩn nghiệm thu kỹ thuật (Acceptance Criteria)
- [ ] Toàn bộ API phản hồi đúng chuẩn JSON `{ success, message, data, errors }`.
- [ ] Không có hiện tượng 2 bệnh nhân cùng đặt vượt quá sức chứa của 1 slot khi bấm đồng thời.
- [ ] Mật khẩu được mã hóa an toàn bằng thuật toán Bcrypt / Argon2.
- [ ] Giao diện người dùng chuẩn responsive (Mobile, Tablet, Desktop).
- [ ] Mã nguồn phân tầng sạch sẽ: Controller mỏng, Service đảm nhiệm nghiệp vụ, Form Request đảm nhiệm validate.
