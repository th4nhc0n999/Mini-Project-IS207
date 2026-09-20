<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    /**
     * Bảng tương ứng trong cơ sở dữ liệu.
     *
     * @var string
     */
    protected $table = 'payments';

    /**
     * Các trường được phép gán giá trị hàng loạt.
     *
     * @var list<string>
     */
    protected $fillable = [
        'booking_id',
        'method',
        'exam_fee',
        'service_fee',
        'total_amount',
        'status',
        'transaction_code',
        'paid_at',
    ];

    /**
     * Khai báo kiểu dữ liệu chuyển đổi (Casts).
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'method' => PaymentMethod::class,
            'status' => PaymentStatus::class,
            'exam_fee' => 'decimal:2',
            'service_fee' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * Quan hệ: Bản ghi thanh toán thuộc về một đơn đặt khám (Booking).
     */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    /**
     * Kiểm tra thanh toán đã thành công hay chưa.
     */
    public function isPaid(): bool
    {
        return $this->status === PaymentStatus::PAID;
    }

    /**
     * Kiểm tra thanh toán đang ở trạng thái chờ hay không.
     */
    public function isPending(): bool
    {
        return $this->status === PaymentStatus::PENDING;
    }

    public function isFailed(): bool
    {
        return $this->status === PaymentStatus::FAILED;
    }

    public function isRefunded(): bool
    {
        return $this->status === PaymentStatus::REFUNDED;
    }

    public function isCancelled(): bool
    {
        return $this->status === PaymentStatus::CANCELLED;
    }

    public function isExpired(): bool
    {
        return $this->status === PaymentStatus::EXPIRED;
    }

    /**
     * Với schema hiện tại, giao dịch thất bại được phép dùng lại cho một lần thử mới.
     */
    public function canBeRetried(): bool
    {
        return in_array($this->status, [
            PaymentStatus::FAILED,
            PaymentStatus::CANCELLED,
            PaymentStatus::EXPIRED,
        ], true);
    }

    public function canBeMarkedAsFailed(): bool
    {
        return $this->status->canTransitionTo(PaymentStatus::FAILED);
    }

    public function canBeCancelled(): bool
    {
        return $this->status->canTransitionTo(PaymentStatus::CANCELLED);
    }

    public function canBeExpired(): bool
    {
        return $this->status->canTransitionTo(PaymentStatus::EXPIRED);
    }

    /**
     * Scope lọc các thanh toán thành công.
     */
    public function scopePaid(Builder $query): Builder
    {
        return $query->where('status', PaymentStatus::PAID->value);
    }

    /**
     * Scope lọc các thanh toán đang chờ xử lý.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', PaymentStatus::PENDING->value);
    }

    public function scopeFailed(Builder $query): Builder
    {
        return $query->where('status', PaymentStatus::FAILED->value);
    }

    public function scopeCancelled(Builder $query): Builder
    {
        return $query->where('status', PaymentStatus::CANCELLED->value);
    }

    public function scopeExpired(Builder $query): Builder
    {
        return $query->where('status', PaymentStatus::EXPIRED->value);
    }
}
