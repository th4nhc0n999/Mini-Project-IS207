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
| **BOOK-07** | Đặt lịch vào khung giờ đã qua trong ngày hôm nay | `slot_id` có `work_date = today` nhưng `start_time <= now()` | Ném `SlotUnavailableException`, từ chối tạo booking và thông báo khung giờ khám đã qua | `422 Unprocessable` |

---

## 4. Kiểm thử Phân quyền Quản trị (Admin RBAC)

| ID | Test Case | Dữ liệu đầu vào | Kết quả mong đợi | HTTP Status |
|---|---|---|---|---|
| **ADM-01** | Patient với role `patient` truy cập API Admin | Header kèm token của patient | `CheckRole` middleware chặn lại, trả về lỗi Không có quyền | `403 Forbidden` |
| **ADM-02** | Admin tạo mới chuyên khoa | Dữ liệu chuyên khoa hợp lệ | Tạo chuyên khoa thành công | `201 Created` |
| **ADM-03** | Admin tạo mới slot ca khám | `owner_type`, `owner_id`, `work_date`, `start_time`, `end_time`, `capacity` | Slot được tạo ở trạng thái `available` | `201 Created` |
| **ADM-04** | Admin cập nhật trạng thái booking | `booking_id`, `status = completed` | Trạng thái phiếu khám chuyển sang Đã hoàn thành | `200 OK` |

---

## 5. Báo Cáo Sự Cố & Prompt Khắc Phục (Bug Report & Action Prompt)

> **Mã sự cố:** `BUG-BOOKING-01`  
> **Tiêu đề:** Cho phép đặt lịch vào khung giờ khám đã trôi qua trong ngày hôm nay (`work_date == today` & `start_time <= now()`)  
> **Mức độ ưu tiên:** High (Ảnh hưởng trực tiếp đến tính đúng đắn của dữ liệu lịch khám)  
> **Người phát hiện:** Vũ Trọng Tuấn Anh (Backend Engineer)  
> **Ngày phát hiện:** 21/09/2026  

### 5.1. Hiện tượng (Bug Description)
Khi người dùng truy cập đặt lịch khám (cả Bác sĩ và Bệnh viện) chọn ngày khám là **hôm nay (21/09/2026)** vào khung giờ **08:00 – 09:00**, mặc dù thời điểm đặt lịch thực tế đã qua **10:00**, hệ thống vẫn cho phép chọn khung giờ trên giao diện và tạo thành công bản ghi booking trong Database.

### 5.2. Phân tích nguyên nhân kỹ thuật (Root Cause Analysis)
1. **Frontend (`frontend/src/pages/DoctorDetailPage.jsx`)**:
   - Nút chọn khung giờ chỉ kiểm tra thuộc tính `disabled={isFull}` (khi hết chỗ).
   - Chưa kiểm tra điều kiện: Nếu `selectedDate === today` và thời gian bắt đầu của slot `slot.start_time <= giờ hiện tại`, dẫn đến việc người dùng vẫn click chọn được các ca khám buổi sáng đã qua.
2. **Backend Service (`backend/app/Services/BookingService.php`)**:
   - Trong cả 2 phương thức `createHospitalBooking()` (L149) và `createDoctorBooking()` (L254):
     `if ($slot->work_date && $slot->work_date->isPast() && ! $slot->work_date->isToday())`
   - Điều kiện `! $slot->work_date->isToday()` khiến trường hợp ngày khám là **hôm nay** bị bỏ qua hoàn toàn, chưa kết hợp `work_date` với `start_time` để so sánh với `now()`.
3. **Backend Query Slot (`HospitalService.php` & `DoctorService.php`)**:
   - Câu truy vấn chỉ lọc `whereDate('work_date', '>=', now()->toDateString())` nên vẫn trả về toàn bộ slot sáng nay cho client.

---

### 5.3. Prompt Mẫu Gửi Nhóm / AI Để Xử Lý Đồng Bộ (Copy & Paste)

```markdown
### YÊU CẦU XỬ LÝ BUG: CHẶN ĐẶT LỊCH VÀO KHUNG GIỜ ĐÃ QUA TRONG NGÀY (BUG-BOOKING-01)

Hệ thống MedSi phát hiện lỗi nghiệp vụ: Người dùng vẫn có thể đặt các khung giờ đã trôi qua trong ngày hôm nay (ví dụ hiện tại là 10:30 nhưng vẫn đặt được slot 08:00 - 09:00 ngày hôm nay). Yêu cầu xử lý đồng bộ ở cả Frontend và Backend như sau:

#### 1. Nhiệm vụ Frontend (Dành cho Frontend Dev - Huydz123lata):
- **File cần sửa**: `frontend/src/pages/DoctorDetailPage.jsx` (và `frontend/src/lib/mockData.js` nếu có).
- **Yêu cầu**:
  + Kiểm tra logic render từng slot: Nếu `selectedDate` trùng với ngày hôm nay (`new Date()`), so sánh `slot.start_time` (hoặc `end_time`) với giờ hiện tại.
  + Nếu thời gian khám đã qua (`isPastSlot`), tiến hành:
    - Vô hiệu hóa nút chọn: `disabled={isFull || isPastSlot}`.
    - Đổi trạng thái hiển thị thành nhãn: "Đã qua giờ" (badge màu xám/đỏ nhạt) thay vì hiển thị "Còn X chỗ".
    - Áp dụng đồng bộ cho cả ca sáng (`morningSlots`) và ca chiều (`afternoonSlots`).

#### 2. Nhiệm vụ Backend Bệnh Viện (Dành cho Backend Dev - vuttuananh168):
- **File cần sửa**: `backend/app/Services/BookingService.php` & `backend/app/Services/HospitalService.php`.
- **Yêu cầu**:
  + Trong `BookingService::createHospitalBooking()`:
    - Ghép `work_date` và `start_time` thành đối tượng Carbon: 
      `$slotStartDateTime = $slot->work_date->copy()->setTimeFromTimeString($slot->start_time);`
    - Nếu `$slotStartDateTime->isPast()`, lập tức `throw new SlotUnavailableException('Khung giờ khám đã qua hạn đặt.');`
  + Trong `HospitalService::getDetail()`:
    - Bổ sung điều kiện query slot của ngày hôm nay: chỉ lấy các slot có `start_time > now()->toTimeString()`.
  + Bổ sung Feature Test trong `HospitalBookingTest.php` kiểm tra ném lỗi khi đặt slot cùng ngày nhưng giờ trong quá khứ.

#### 3. Nhiệm vụ Backend Bác Sĩ (Dành cho Backend Dev - baromais-1106):
- **File cần sửa**: `backend/app/Services/BookingService.php` & `backend/app/Services/DoctorService.php`.
- **Yêu cầu**:
  + Cập nhật tương tự trong `BookingService::createDoctorBooking()`: kiểm tra `$slotStartDateTime->isPast()` và ném ngoại lệ `SlotUnavailableException`.
  + Cập nhật trong `DoctorService::getDetail()`: lọc bỏ các slot có giờ bắt đầu đã qua trong ngày hôm nay.
  + Bổ sung Feature Test tương ứng cho luồng Doctor Booking.

#### 4. Tiêu chí nghiệm thu (Acceptance Criteria):
1. Trên giao diện, các khung giờ trước thời điểm hiện tại của ngày hôm nay phải bị disable và hiển thị nhãn "Đã qua giờ".
2. Bất kỳ request API nào gửi `slot_id` có thời gian khám trong quá khứ đều bị trả về HTTP `422 Unprocessable` kèm message rõ ràng.
3. Chạy toàn bộ test `php artisan test` đạt 100% PASS.
```
