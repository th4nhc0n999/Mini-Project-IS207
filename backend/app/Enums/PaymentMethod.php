<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case ATM = 'atm';
    case CREDIT_CARD = 'credit_card';
    case QR_PAY = 'qr_pay';
    case STORE_PAY = 'store_pay';
    case MOMO = 'momo';

    /**
     * Tên hiển thị tiếng Việt của phương thức thanh toán.
     */
    public function label(): string
    {
        return match ($this) {
            self::ATM => 'Thẻ ATM và Tài khoản ngân hàng',
            self::CREDIT_CARD => 'Thẻ thanh toán quốc tế (Visa, Mastercard, JCB, Amex)',
            self::QR_PAY => 'Thanh toán qua mã QR (VietQR, Payoo, Mobile Banking)',
            self::STORE_PAY => 'Thanh toán tại cửa hàng tiện lợi (Circle K, GS25, MiniStop...)',
            self::MOMO => 'Ví điện tử MoMo',
        };
    }

    /**
     * Mô tả chi tiết điều kiện hoặc hướng dẫn phương thức.
     */
    public function description(): string
    {
        return match ($this) {
            self::ATM => 'Thẻ ATM nội địa đã đăng ký dịch vụ thanh toán trực tuyến Internet Banking.',
            self::CREDIT_CARD => 'Hỗ trợ thẻ tín dụng và ghi nợ quốc tế phát hành tại Việt Nam & quốc tế.',
            self::QR_PAY => 'Quét mã QR tức thì bằng ứng dụng Mobile Banking hoặc ví điện tử đối tác.',
            self::STORE_PAY => 'Nhận mã thanh toán và thanh toán tiền mặt tại quầy thu ngân cửa hàng tiện lợi.',
            self::MOMO => 'Quét mã hoặc mở ứng dụng MoMo trên điện thoại để xác nhận thanh toán an toàn.',
        };
    }

    /**
     * Chỉ các phương thức nhập thông tin thẻ mới dùng OTP trong gateway giả lập.
     */
    public function requiresOtp(): bool
    {
        return in_array($this, [self::ATM, self::CREDIT_CARD], true);
    }

    /**
     * Lấy danh sách tất cả các giá trị chuỗi.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
