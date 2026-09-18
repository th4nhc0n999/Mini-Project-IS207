# Test Cases — MedSi

Tài liệu mô tả các kịch bản kiểm thử (Test Scenarios & Test Cases) cho hệ thống MedSi.

---

## 1. Kiểm thử phân hệ Xác thực (Authentication)

| ID | Test Case | Dữ liệu đầu vào | Kết quả mong đợi | HTTP Status |
|---|---|---|---|---|
| **AUTH-01** | Đăng ký tài khoản thành công | Name, Email hợp lệ, Password >= 8 ký tự | Tạo tài khoản mới trong bảng `users`, trả về token và thông tin user | `201 Created` |
| **AUTH-02** | Đăng ký với email đã tồn tại | Email trùng với user đã có | Báo lỗi validation: Email đã được sử dụng | `422 Unprocessable` |
| **AUTH-03** | Đăng nhập đúng thông tin | Email & Password chính xác | Trả về Bearer Token, thông tin user và role | `200 OK` |
| **AUTH-04** | Đăng nhập sai mật khẩu | Mật khẩu không đúng | Ném `InvalidCredentialsException`, báo sai email hoặc mật khẩu | `401 Unauthorized` |
| **AUTH-05** | Đăng xuất | Token hợp lệ | Hủy token hiện tại, trả về thông báo thành công | `200 OK` |
| **AUTH-06** | Gọi API bảo vệ không kèm Token | Header không có `Authorization: Bearer <token>` | Trả về lỗi Chưa xác thực | `401 Unauthorized` |

---

## 2. Kiểm thử Chuyên khoa & Bác sĩ (Specialties & Doctors)

| ID | Test Case | Dữ liệu đầu vào | Kết quả mong đợi | HTTP Status |
|---|---|---|---|---|
| **DOC-01** | Lấy danh sách chuyên khoa | Không yêu cầu auth | Trả về danh sách chuyên khoa (id, name, image) | `200 OK` |
| **DOC-02** | Lọc bác sĩ theo chuyên khoa | `specialty_id` hợp lệ | Chỉ trả về danh sách bác sĩ thuộc chuyên khoa đó | `200 OK` |
| **DOC-03** | Xem chi tiết bác sĩ tồn tại | `id` bác sĩ hợp lệ | Trả về thông tin bác sĩ và danh sách các slot còn trống (`status = available`) | `200 OK` |
| **DOC-04** | Xem chi tiết bác sĩ không tồn tại | `id = 99999` | Ném `DoctorNotFoundException` | `404 Not Found` |

---

## 3. Kiểm thử Đặt lịch khám & Concurrency (Booking & Race Conditions)

| ID | Test Case | Dữ liệu đầu vào | Kết quả mong đợi | HTTP Status |
|---|---|---|---|---|
| **BOOK-01** | Đặt lịch thành công khi slot còn chỗ | `booking_type`, hồ sơ người bệnh, thông tin bác sĩ/bệnh viện, `slot_id` hợp lệ, slot chưa đầy | Tạo booking thành công, tăng `booked_count` của slot, sinh `code` | `201 Created` |
| **BOOK-02** | Đặt lịch khi slot đã đầy | Slot có `booked_count >= capacity` | Ném `SlotUnavailableException`, thông báo slot đã hết chỗ | `422 Unprocessable` |
| **BOOK-03** | Bệnh nhân đặt lại cùng 1 slot đã đặt | User ID đã có booking ở `slot_id` này | Ném `BookingAlreadyExistsException` | `409 Conflict` |
| **BOOK-04** | Kiểm thử đồng thời (Concurrency Test) | 2 yêu cầu đặt cùng lúc cho slot chỉ còn 1 chỗ trống duy nhất | Database Transaction + `lockForUpdate`: 1 request thành công (201), 1 request bị từ chối với lỗi slot đã đầy (422); `booked_count` không vượt `capacity` | `201` & `422` |
| **BOOK-05** | Bệnh nhân hủy phiếu khám | `booking_id` của chính user | Cập nhật `status = cancelled`, giảm `booked_count` của slot tương ứng | `200 OK` |
| **BOOK-06** | Bệnh nhân hủy phiếu khám của người khác | `booking_id` thuộc user khác | Bị từ chối truy cập do không có quyền | `403 Forbidden` |

---

## 4. Kiểm thử Phân quyền Quản trị (Admin RBAC)

| ID | Test Case | Dữ liệu đầu vào | Kết quả mong đợi | HTTP Status |
|---|---|---|---|---|
| **ADM-01** | Patient với role `patient` truy cập API Admin | Header kèm token của patient | `CheckRole` middleware chặn lại, trả về lỗi Không có quyền | `403 Forbidden` |
| **ADM-02** | Admin tạo mới chuyên khoa | Dữ liệu chuyên khoa hợp lệ | Tạo chuyên khoa thành công | `201 Created` |
| **ADM-03** | Admin tạo mới slot ca khám | `owner_type`, `owner_id`, `work_date`, `start_time`, `end_time`, `capacity` | Slot được tạo ở trạng thái `available` | `201 Created` |
| **ADM-04** | Admin cập nhật trạng thái booking | `booking_id`, `status = completed` | Trạng thái phiếu khám chuyển sang Đã hoàn thành | `200 OK` |
