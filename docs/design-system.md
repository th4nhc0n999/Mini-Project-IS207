# MedSi — Design System & Style Guide (Quy chuẩn Font & Mã màu)

Tài liệu này dùng để thống nhất quy chuẩn thiết kế giao diện (**Font chữ, Bảng mã màu, Kích thước**) cho toàn bộ các thành viên trong nhóm phát triển dự án **MedSi** (lấy cảm hứng từ [YouMed](https://youmed.vn/)).

---

## 1. Typography (Font chữ)

- **Font chữ chính thức**: **`Plus Jakarta Sans`** (fallback: `Inter`, `system-ui`, `sans-serif`)
- **Đặc điểm**: Phông chữ hình học hiện đại, nét tròn thân thiện, hiển thị dấu tiếng Việt rất đẹp và rõ ràng, chuẩn phong cách ứng dụng y tế công nghệ.

### Link nhúng Font (HTML `<head>` trong `index.html`):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Quy chuẩn kích thước chữ (Typography Scale):

| Cấp bậc | Tailwind Class | Kích thước | Độ đậm (Weight) | Sử dụng cho |
| :--- | :--- | :--- | :--- | :--- |
| **Heading 1** | `text-3xl lg:text-4xl` | 30px - 36px | `font-bold` (700) | Tiêu đề trang chính, Banner Hero |
| **Heading 2** | `text-2xl` | 24px | `font-bold` (700) | Tiêu đề phân mục (Danh sách bác sĩ, Đặt lịch) |
| **Heading 3** | `text-lg` | 18px | `font-semibold` (600) | Tiêu đề thẻ Card, Tên bác sĩ, Tiêu đề Modal |
| **Body (Chính)** | `text-base` | 16px | `font-normal` (400) | Đoạn văn bản mô tả, nội dung đọc chính |
| **Body (Nhỏ)** | `text-sm` | 14px | `font-normal` (400) | Text trong bảng, ô nhập liệu (Input), thông tin phụ |
| **Caption / Label** | `text-xs` | 12px | `font-medium` (500) | Label form, thời gian khám, tag chuyên khoa, badge |

---

## 2. Bảng mã màu chủ đạo (Color Palette)

### 2.1. Màu thương hiệu chính — Medical Blue (Xanh Y Tế YouMed)
> Đại diện cho sự tin cậy, an toàn, chuyên nghiệp và chuẩn mực y khoa.

| Tên mã màu | Mã HEX | Tailwind Class gợi ý | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Primary 50** | `#f0f9ff` | `bg-sky-50` | Màu nền badge nhẹ, hover dòng danh sách |
| **Primary 100** | `#e0f2fe` | `bg-sky-100` | Nền khung thông tin highlight, icon box nhạt |
| **Primary 500** | `#0088cc` | `bg-[#0088cc]` | **Màu nhận diện YouMed / MedSi chính thức** |
| **Primary 600** | `#0284c7` | `bg-sky-600` | **Màu nút CTA chính** (Đặt khám, Đăng nhập, Xác nhận) |
| **Primary 700** | `#0369a1` | `bg-sky-700` | Trạng thái `hover` của nút bấm chính |
| **Primary 900** | `#0c4a6e` | `text-sky-900` | Tiêu đề thương hiệu, Header đậm nét |

---

### 2.2. Màu phụ trợ — Health Teal & Emerald (Xanh Sức Khỏe)
> Đại diện cho sự hồi phục, sức khỏe lành mạnh, trạng thái thành công.

| Tên mã màu | Mã HEX | Tailwind Class gợi ý | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Health 50** | `#ecfdf5` | `bg-emerald-50` | Nền badge "Còn lịch trống", "Đã duyệt" |
| **Health 500** | `#10b981` | `text-emerald-500` | Biểu tượng xác thực, slot còn nhận bệnh nhân |
| **Health 600** | `#059669` | `bg-emerald-600` | Nút hành động thành công, tag "Hoàn thành" |

---

### 2.3. Màu trạng thái nghiệp vụ (Status & Feedback)

| Trạng thái | Mã HEX | Nền nhạt (Badge) | Tailwind Class | Ngữ cảnh nghiệp vụ |
| :--- | :--- | :--- | :--- | :--- |
| **Pending / Chờ duyệt** | `#f59e0b` | `#fffbeb` | `text-amber-600 bg-amber-50` | Lịch hẹn đang chờ phòng khám duyệt |
| **Confirmed / Đã duyệt** | `#10b981` | `#ecfdf5` | `text-emerald-600 bg-emerald-50` | Lịch hẹn đã được xác nhận |
| **Cancelled / Đầy slot** | `#ef4444` | `#fef2f2` | `text-red-600 bg-red-50` | Slot đã kín chỗ, lịch hẹn bị hủy |
| **Completed / Hoàn thành**| `#0284c7` | `#f0f9ff` | `text-sky-600 bg-sky-50` | Đã khám xong |

---

### 2.4. Màu trung tính & Nền (Neutrals & Backgrounds)

| Loại màu | Mã HEX | Tailwind Class | Sử dụng |
| :--- | :--- | :--- | :--- |
| **App Background** | `#f8fafc` | `bg-slate-50` | Nền toàn trang (tạo cảm giác sạch sẽ, dịu mắt) |
| **Card / Surface** | `#ffffff` | `bg-white` | Nền các thẻ Card, Form, Modal, Navbar |
| **Border viền** | `#e2e8f0` | `border-slate-200` | Viền input, đường kẻ phân cách, viền card |
| **Text Tiêu đề** | `#0f172a` | `text-slate-900` | Tiêu đề chính, văn bản có độ tương phản cao |
| **Text Nội dung** | `#334155` | `text-slate-700` | Nội dung bài viết, thông tin bác sĩ |
| **Text Phụ / Label** | `#64748b` | `text-slate-500` | Ghi chú, placeholder, nhãn phụ, ngày giờ |

---

## 3. Cấu hình sẵn trong `tailwind.config.js` của MedSi

Để các thành viên chỉ cần gọi class theo tên thống nhất:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0088cc', // Tone xanh YouMed nhận diện
          600: '#0284c7', // Nút CTA chính
          700: '#0369a1', // Nút hover
          800: '#075985',
          900: '#0c4a6e',
          DEFAULT: '#0284c7',
          foreground: '#ffffff',
        },
        health: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
        surface: {
          ground: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        }
      },
      boxShadow: {
        'medical': '0 4px 20px -2px rgba(2, 132, 199, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(2, 132, 199, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
```

---

## 4. Ví dụ cách áp dụng vào Component

- **Nút bấm Đặt khám (CTA Button)**:
  ```html
  <button class="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200">
    Đặt lịch khám ngay
  </button>
  ```

- **Thẻ Bác sĩ / Dịch vụ (Medical Card)**:
  ```html
  <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-medical hover:shadow-card-hover transition-all">
    <span class="inline-block px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full mb-3">
      ● Còn khung giờ trống
    </span>
    <h3 class="text-lg font-bold text-slate-900">BS.CKII Nguyễn Văn A</h3>
    <p class="text-sm text-slate-500 mt-1">Chuyên khoa: Da liễu</p>
  </div>
  ```
