<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case PENDING = 'pending';
    case PAID = 'paid';
    case FAILED = 'failed';
    case CANCELLED = 'cancelled';
    case EXPIRED = 'expired';
    case REFUNDED = 'refunded';

    /**
     * Tên hiển thị tiếng Việt của trạng thái thanh toán.
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Chờ thanh toán',
            self::PAID => 'Thanh toán thành công',
            self::FAILED => 'Thanh toán thất bại',
            self::CANCELLED => 'Đã hủy thanh toán',
            self::EXPIRED => 'Thanh toán đã hết hạn',
            self::REFUNDED => 'Đã hoàn tiền',
        };
    }

    /**
     * Mã màu / badge CSS tương ứng.
     */
    public function badgeColor(): string
    {
        return match ($this) {
            self::PENDING => 'amber',
            self::PAID => 'emerald',
            self::FAILED => 'rose',
            self::CANCELLED => 'slate',
            self::EXPIRED => 'orange',
            self::REFUNDED => 'slate',
        };
    }

    /**
     * Kiểm tra một chuyển trạng thái có hợp lệ với vòng đời thanh toán hay không.
     */
    public function canTransitionTo(self $nextStatus): bool
    {
        if ($this === $nextStatus) {
            return true;
        }

        return match ($this) {
            self::PENDING => in_array($nextStatus, [
                self::PAID,
                self::FAILED,
                self::CANCELLED,
                self::EXPIRED,
            ], true),
            self::PAID => $nextStatus === self::REFUNDED,
            self::FAILED, self::CANCELLED, self::EXPIRED => $nextStatus === self::PENDING,
            self::REFUNDED => false,
        };
    }

    /**
     * Trạng thái cuối không được phép quay lại luồng thanh toán thông thường.
     */
    public function isFinal(): bool
    {
        return in_array($this, [self::PAID, self::REFUNDED], true);
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
