# Product Brief — MedSi

## 1. Giới thiệu sản phẩm
**MedSi** là ứng dụng web đặt lịch khám bệnh trực tuyến, kết nối người bệnh với các bác sĩ và dịch vụ khám thuộc nhiều chuyên khoa khác nhau một cách nhanh chóng, minh bạch và chính xác.

---

## 2. Mục tiêu sản phẩm (Product Goals)
- **Đối với Bệnh nhân:** Giảm thiểu thời gian chờ đợi tại phòng khám/bệnh viện, dễ dàng xem thông tin, chuyên môn của bác sĩ và chủ động lựa chọn khung giờ phù hợp.
- **Đối với Bác sĩ & Phòng khám:** Tối ưu hóa việc xếp lịch, quản lý tải khám bệnh theo khung giờ (slot capacity), hạn chế tối đa tình trạng quá tải hoặc trùng lịch khám.
- **Đối với Quản trị viên:** Quản lý dữ liệu tập trung (chuyên khoa, danh sách bác sĩ, lịch phân ca và thống kê booking).

---

## 3. Chân dung người dùng (User Personas)

### 3.1. Người dùng (User)
- **Nhu cầu:** Tìm kiếm bác sĩ theo chuyên khoa (Nhi, Da liễu, Tai Mũi Họng...), xem giá khám, đánh giá và chọn ngày/giờ khám còn trống.
- **Hành vi:** Đăng nhập, tìm kiếm, đặt lịch trong vài bước đơn giản, nhận mã đặt lịch và theo dõi lịch sử khám bệnh.

### 3.2. Quản trị viên (Admin)
- **Nhu cầu:** Thêm/sửa chuyên khoa, quản lý hồ sơ bác sĩ và bệnh viện, cấu hình
  khung giờ làm việc (Slots) và kiểm soát toàn bộ các đơn đặt lịch.

---

## 4. Danh sách tính năng cốt lõi (Core Features)

### 4.1. Phân hệ Xác thực & Người dùng (Authentication & Authorization)
- Đăng ký tài khoản bệnh nhân (Họ tên, Email, Số điện thoại, Mật khẩu).
- Quản lý nhiều hồ sơ người bệnh (`patient_profiles`) thuộc cùng một tài khoản,
  bao gồm họ tên, ngày sinh, giới tính, số điện thoại và quan hệ.
- Đăng nhập hệ thống (nhận Bearer Token qua Laravel Sanctum).
- Phân quyền (Role-based): `patient`, `admin`. Bác sĩ hiện chỉ là hồ sơ chuyên
  môn được quản trị viên quản lý, chưa có tài khoản hoặc role riêng.
- Lấy thông tin cá nhân hiện tại (`/api/auth/me`).

### 4.2. Phân hệ Chuyên khoa & Bác sĩ (Specialties & Doctors)
- Danh sách chuyên khoa kèm biểu tượng/ảnh đại diện.
- Bộ lọc danh sách bác sĩ theo chuyên khoa, từ khóa tìm kiếm.
- Trang chi tiết bác sĩ: tên, mô tả tiểu sử, thành phố, ảnh đại diện và danh sách
  khung giờ khám (Slots) còn trống.
- Tra cứu bệnh viện và các loại dịch vụ xét nghiệm/khám (`exam_types`) mà bệnh
  viện cung cấp, cùng mức giá tương ứng.

### 4.3. Phân hệ Khung giờ & Đặt lịch (Slot & Booking Management)
- **Khung giờ (Slot):** 
  - Mỗi khung giờ gắn đa hình với bác sĩ hoặc bệnh viện qua
    `owner_type`/`owner_id`, cùng ngày làm việc, giờ bắt đầu - kết thúc và sức
    chứa (`capacity`).
  - Trạng thái slot tự động chuyển thành `full` khi `booked_count >= capacity`.
- **Đặt lịch (Booking):**
  - Bệnh nhân chọn hồ sơ người bệnh, loại đặt lịch (`booking_type`), slot còn
    trống và nhập triệu chứng (`symptoms`).
  - Hệ thống thực hiện khóa dòng (`lockForUpdate`) trong database transaction để ngăn chặn tuyệt đối tình trạng đặt trùng (Race Condition / Overbooking).
  - Tự động sinh mã phiếu khám duy nhất (`bookings.code`) và ghi nhận thời hạn
    giữ slot (`slot_hold_expires_at`) nếu quy trình thanh toán yêu cầu.
  - Ghi nhận thanh toán một-một với booking, gồm phí khám, phí dịch vụ, tổng
    tiền, phương thức, trạng thái và mã giao dịch.
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
