<?php

namespace App\Services;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Payment;
use Carbon\Carbon;
use DomainException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;

class PaymentService
{
    private const PAYABLE_BOOKING_STATUS = 'pending_payment';

    /**
     * Tính bảng kê chi phí cho booking bệnh viện thuộc người dùng hiện tại.
     *
     * @return array<string, mixed>
     */
    public function calculateInvoice(int|string|Booking $bookingParam, int $userId): array
    {
        $booking = $this->resolveBooking($bookingParam, $userId);

        return $this->buildInvoice($booking);
    }

    public function getPayment(int $paymentId, int $userId): Payment
    {
        $payment = $this->resolvePayment($paymentId, $userId);

        if (
            $payment->isPending()
            && $payment->booking?->status === self::PAYABLE_BOOKING_STATUS
            && $payment->booking->slot_hold_expires_at !== null
            && Carbon::now()->greaterThanOrEqualTo($payment->booking->slot_hold_expires_at)
        ) {
            return $this->expirePayment($payment, $userId);
        }

        return $this->loadPaymentDetails($payment);
    }

    /**
     * Đồng bộ các payment bị bỏ dở sau khi thời gian giữ slot đã hết.
     * Booking/slot sẽ do module Booking xử lý để tránh cập nhật chồng chéo.
     */
    public function expireOverduePayments(): int
    {
        $expiredCount = 0;

        Payment::query()
            ->where('status', PaymentStatus::PENDING->value)
            ->whereHas('booking', static function ($bookingQuery): void {
                $bookingQuery
                    ->where('status', self::PAYABLE_BOOKING_STATUS)
                    ->whereNotNull('slot_hold_expires_at')
                    ->where('slot_hold_expires_at', '<=', Carbon::now());
            })
            ->select('id')
            ->orderBy('id')
            ->chunkById(100, function ($payments) use (&$expiredCount): void {
                foreach ($payments as $payment) {
                    if ($this->expireOverduePayment((int) $payment->id)) {
                        $expiredCount++;
                    }
                }
            });

        return $expiredCount;
    }

    /**
     * Khởi tạo hoặc làm mới giao dịch chưa hoàn tất trong giới hạn schema hiện tại.
     *
     * Do booking_id đang unique trong database, một booking chỉ có một bản ghi payment.
     * Giao dịch PAID/REFUNDED tuyệt đối không được ghi đè.
     */
    public function createPayment(
        int|string|Booking $bookingParam,
        PaymentMethod|string $methodParam,
        int $userId
    ): Payment {
        return DB::transaction(function () use ($bookingParam, $methodParam, $userId) {
            $booking = $this->resolveBooking($bookingParam, $userId, true);
            $method = $this->resolveMethod($methodParam);
            $invoice = $this->buildInvoice($booking);

            $payment = Payment::query()
                ->where('booking_id', $booking->id)
                ->lockForUpdate()
                ->first();

            if ($payment?->isPaid()) {
                throw new DomainException('Đơn đặt khám này đã được thanh toán thành công.');
            }

            if ($payment?->isRefunded()) {
                throw new DomainException('Giao dịch đã hoàn tiền và không thể sử dụng lại.');
            }

            if ($payment?->isPending()) {
                if ($payment->method === $method) {
                    return $this->loadPaymentDetails($payment);
                }

                throw new DomainException(
                    'Đang có giao dịch chờ thanh toán bằng phương thức khác. Vui lòng hủy giao dịch hiện tại trước khi đổi phương thức.'
                );
            }

            if ($payment !== null && ! $payment->status->canTransitionTo(PaymentStatus::PENDING)) {
                throw new DomainException('Trạng thái giao dịch hiện tại không cho phép thử thanh toán lại.');
            }

            $payment ??= new Payment(['booking_id' => $booking->id]);
            $payment->fill([
                'method' => $method,
                'exam_fee' => $invoice['fees']['exam_fee'],
                'service_fee' => $invoice['fees']['service_fee'],
                'total_amount' => $invoice['fees']['total_amount'],
                'status' => PaymentStatus::PENDING,
                'transaction_code' => $this->generateTransactionCode(),
                'paid_at' => null,
            ]);
            $payment->save();

            return $this->loadPaymentDetails($payment);
        });
    }

    /**
     * Xác nhận giao dịch giả lập thành công và cập nhật booking trong cùng transaction.
     */
    public function confirmPayment(
        int|Payment $paymentParam,
        int $userId,
        ?string $otp = null
    ): Payment {
        $wasExpired = false;
        $otpFailed = false;

        $payment = DB::transaction(function () use (
            $paymentParam,
            $userId,
            $otp,
            &$wasExpired,
            &$otpFailed
        ) {
            $payment = $this->resolvePayment($paymentParam, $userId);

            if ($payment->isPaid()) {
                return $this->loadPaymentDetails($payment);
            }

            if (! $payment->status->canTransitionTo(PaymentStatus::PAID)) {
                throw new DomainException('Trạng thái giao dịch hiện tại không cho phép xác nhận thanh toán.');
            }

            if (! $payment->booking) {
                throw new DomainException('Giao dịch không còn liên kết với đơn đặt khám.');
            }

            $booking = Booking::query()
                ->whereKey($payment->booking_id)
                ->where('user_id', $userId)
                ->lockForUpdate()
                ->firstOrFail();

            // Giữ cùng thứ tự khóa với createPayment: booking trước, payment sau.
            $payment = $this->resolvePayment($payment->id, $userId, true);

            $payment->setRelation('booking', $booking);

            // Trạng thái có thể đã đổi trong lúc chờ khóa nên phải kiểm tra lại
            // trên bản ghi đã được lock. Nhánh PAID giúp confirm có tính idempotent.
            if ($payment->isPaid()) {
                return $this->loadPaymentDetails($payment);
            }

            if (! $payment->status->canTransitionTo(PaymentStatus::PAID)) {
                throw new DomainException('Trạng thái giao dịch hiện tại không cho phép xác nhận thanh toán.');
            }

            if ($booking->status !== self::PAYABLE_BOOKING_STATUS) {
                throw new DomainException('Trạng thái đơn đặt khám không cho phép xác nhận thanh toán.');
            }

            if (
                $booking->slot_hold_expires_at === null
                || Carbon::now()->greaterThanOrEqualTo($booking->slot_hold_expires_at)
            ) {
                $payment->status = PaymentStatus::EXPIRED;
                $payment->save();
                $wasExpired = true;

                return $this->loadPaymentDetails($payment);
            }

            if (! $this->isDemoOtpValid($payment, $otp)) {
                $payment->status = PaymentStatus::FAILED;
                $payment->save();
                $otpFailed = true;

                logger()->info('Payment marked as failed.', [
                    'payment_id' => $payment->id,
                    'reason' => 'Sai hoặc hết hạn OTP',
                ]);

                return $this->loadPaymentDetails($payment);
            }

            $payment->status = PaymentStatus::PAID;
            $payment->paid_at = Carbon::now();
            $payment->save();

            $booking->status = 'confirmed';
            $booking->slot_hold_expires_at = null;
            $booking->save();

            return $this->loadPaymentDetails($payment);
        });

        // Ném lỗi sau khi transaction đã commit để trạng thái EXPIRED không bị rollback.
        if ($wasExpired) {
            throw new DomainException('Thời gian giữ slot khám đã hết. Không thể xác nhận thanh toán.');
        }

        // Tương tự EXPIRED, lỗi được trả sau commit để trạng thái FAILED được giữ lại.
        if ($otpFailed) {
            throw new DomainException('Mã xác thực OTP không chính xác hoặc đã hết hạn.');
        }

        return $payment;
    }

    /**
     * Ghi nhận giao dịch thất bại từ gateway hoặc quá trình xác thực.
     */
    public function markAsFailed(
        int|Payment $paymentParam,
        int $userId,
        ?string $reason = null
    ): Payment {
        return DB::transaction(function () use ($paymentParam, $userId, $reason) {
            $payment = $this->resolvePayment($paymentParam, $userId, true);

            if ($payment->isFailed()) {
                return $this->loadPaymentDetails($payment);
            }

            if (! $payment->canBeMarkedAsFailed()) {
                throw new DomainException('Giao dịch đã hoàn tất và không thể đánh dấu thất bại.');
            }

            $payment->status = PaymentStatus::FAILED;
            $payment->save();

            if ($reason !== null && $reason !== '') {
                logger()->info('Payment marked as failed.', [
                    'payment_id' => $payment->id,
                    'reason' => $reason,
                ]);
            }

            return $this->loadPaymentDetails($payment);
        });
    }

    /**
     * Hủy một giao dịch đang chờ theo yêu cầu của người dùng.
     */
    public function cancelPayment(int|Payment $paymentParam, int $userId): Payment
    {
        return DB::transaction(function () use ($paymentParam, $userId) {
            $payment = $this->resolvePayment($paymentParam, $userId, true);

            if ($payment->isCancelled()) {
                return $this->loadPaymentDetails($payment);
            }

            if (! $payment->canBeCancelled()) {
                throw new DomainException('Chỉ có thể hủy giao dịch đang chờ thanh toán.');
            }

            $payment->status = PaymentStatus::CANCELLED;
            $payment->save();

            return $this->loadPaymentDetails($payment);
        });
    }

    /**
     * Đánh dấu một giao dịch chờ thanh toán đã hết hạn.
     * Có thể được gọi bởi scheduled job khi bổ sung cơ chế quét giao dịch sau này.
     */
    public function expirePayment(int|Payment $paymentParam, int $userId): Payment
    {
        return DB::transaction(function () use ($paymentParam, $userId) {
            $payment = $this->resolvePayment($paymentParam, $userId);

            if ($payment->isExpired()) {
                return $this->loadPaymentDetails($payment);
            }

            if (! $payment->booking) {
                throw new DomainException('Giao dịch không còn liên kết với đơn đặt khám.');
            }

            // Giữ thứ tự khóa thống nhất: booking trước, payment sau.
            $booking = Booking::query()
                ->whereKey($payment->booking_id)
                ->where('user_id', $userId)
                ->lockForUpdate()
                ->firstOrFail();

            $payment = $this->resolvePayment($payment->id, $userId, true);

            if ($payment->isExpired()) {
                return $this->loadPaymentDetails($payment);
            }

            if ($booking->status !== self::PAYABLE_BOOKING_STATUS) {
                throw new DomainException('Trạng thái đơn đặt khám không cho phép đánh dấu thanh toán hết hạn.');
            }

            if (! $payment->canBeExpired()) {
                throw new DomainException('Chỉ có thể đánh dấu hết hạn giao dịch đang chờ thanh toán.');
            }

            if (
                $booking->slot_hold_expires_at !== null
                && Carbon::now()->lessThan($booking->slot_hold_expires_at)
            ) {
                throw new DomainException('Giao dịch vẫn còn trong thời gian thanh toán.');
            }

            $payment->status = PaymentStatus::EXPIRED;
            $payment->save();

            return $this->loadPaymentDetails($payment);
        });
    }

    /**
     * @return array<string, mixed>
     */
    private function buildInvoice(Booking $booking): array
    {
        $this->ensureBookingCanBePaid($booking);

        $examFee = $this->toVndAmount($booking->examType->price, 'Giá khám');
        $serviceFee = $this->toVndAmount(config('payment.service_fee', 10000), 'Phí dịch vụ');
        $totalAmount = $examFee + $serviceFee;

        return [
            'booking_id' => $booking->id,
            'booking_code' => $booking->code,
            'booking_type' => $booking->booking_type,
            'booking_status' => $booking->status,
            'patient' => [
                'id' => $booking->patientProfile->id,
                'full_name' => $booking->patientProfile->full_name,
                'phone' => $booking->patientProfile->phone,
                'gender' => $booking->patientProfile->gender,
                'dob' => $booking->patientProfile->dob?->format('d/m/Y'),
            ],
            'hospital' => [
                'id' => $booking->hospital->id,
                'name' => $booking->hospital->name,
                'address' => $booking->hospital->address,
                'city' => $booking->hospital->city,
                'hotline' => $booking->hospital->hotline,
            ],
            'exam_type' => [
                'id' => $booking->examType->id,
                'name' => $booking->examType->name,
                'price' => $examFee,
            ],
            'schedule' => [
                'work_date' => $booking->slot->work_date?->format('d/m/Y'),
                'time_slot' => substr((string) $booking->slot->start_time, 0, 5)
                    .' - '.substr((string) $booking->slot->end_time, 0, 5),
            ],
            'fees' => [
                'exam_fee' => $examFee,
                'service_fee' => $serviceFee,
                'total_amount' => $totalAmount,
                'currency' => 'VND',
                'formatted' => [
                    'exam_fee' => $this->formatVnd($examFee),
                    'service_fee' => $this->formatVnd($serviceFee),
                    'total_amount' => $this->formatVnd($totalAmount),
                ],
            ],
            'slot_hold_expires_at' => $booking->slot_hold_expires_at?->toIso8601String(),
            'is_hold_expired' => false,
            'available_methods' => array_map(
                static fn (PaymentMethod $method): array => [
                    'id' => $method->value,
                    'name' => $method->label(),
                    'description' => $method->description(),
                ],
                PaymentMethod::cases()
            ),
        ];
    }

    private function ensureBookingCanBePaid(Booking $booking): void
    {
        if ($booking->booking_type !== 'hospital') {
            throw new InvalidArgumentException('Chỉ đơn đặt khám bệnh viện mới hỗ trợ thanh toán trực tuyến.');
        }

        if ($booking->status !== self::PAYABLE_BOOKING_STATUS) {
            throw new DomainException('Trạng thái đơn đặt khám hiện tại không cho phép thanh toán.');
        }

        if ($booking->slot_hold_expires_at === null) {
            throw new DomainException('Đơn đặt khám không có thời hạn giữ chỗ hợp lệ.');
        }

        if (Carbon::now()->greaterThanOrEqualTo($booking->slot_hold_expires_at)) {
            throw new DomainException('Thời gian giữ slot khám đã hết. Vui lòng chọn lại khung giờ.');
        }

        if (! $booking->patientProfile) {
            throw new DomainException('Không tìm thấy hồ sơ bệnh nhân của đơn đặt khám.');
        }

        if (! $booking->hospital) {
            throw new DomainException('Không tìm thấy cơ sở khám của đơn đặt khám.');
        }

        if (! $booking->examType) {
            throw new DomainException('Không tìm thấy loại hình khám hoặc giá khám.');
        }

        if (! $booking->slot) {
            throw new DomainException('Không tìm thấy khung giờ khám của đơn đặt khám.');
        }

        if ((int) $booking->examType->hospital_id !== (int) $booking->hospital_id) {
            throw new DomainException('Loại hình khám không thuộc cơ sở khám đã chọn.');
        }

        if (
            $booking->slot->owner_type !== 'hospital'
            || (int) $booking->slot->owner_id !== (int) $booking->hospital_id
        ) {
            throw new DomainException('Khung giờ khám không thuộc cơ sở khám đã chọn.');
        }
    }

    private function resolveMethod(PaymentMethod|string $method): PaymentMethod
    {
        if ($method instanceof PaymentMethod) {
            return $method;
        }

        return PaymentMethod::tryFrom($method)
            ?? throw new InvalidArgumentException('Phương thức thanh toán không hợp lệ.');
    }

    private function isDemoOtpValid(Payment $payment, ?string $otp): bool
    {
        if (! $payment->method->requiresOtp()) {
            return true;
        }

        if (! config('payment.demo_gateway.enabled', false)) {
            throw new DomainException('Gateway giả lập chưa được bật để xác nhận thanh toán thẻ.');
        }

        $expectedOtp = (string) config('payment.demo_gateway.otp', '');

        return $otp !== null
            && $expectedOtp !== ''
            && hash_equals($expectedOtp, $otp);
    }

    private function expireOverduePayment(int $paymentId): bool
    {
        return DB::transaction(function () use ($paymentId): bool {
            $payment = Payment::query()->find($paymentId);

            if (! $payment) {
                return false;
            }

            $booking = Booking::query()
                ->whereKey($payment->booking_id)
                ->lockForUpdate()
                ->first();

            if (! $booking) {
                return false;
            }

            $payment = Payment::query()
                ->whereKey($paymentId)
                ->lockForUpdate()
                ->first();

            if (
                ! $payment
                || ! $payment->isPending()
                || $booking->status !== self::PAYABLE_BOOKING_STATUS
                || $booking->slot_hold_expires_at === null
                || Carbon::now()->lessThan($booking->slot_hold_expires_at)
            ) {
                return false;
            }

            $payment->status = PaymentStatus::EXPIRED;
            $payment->save();

            return true;
        });
    }

    private function resolveBooking(
        int|string|Booking $bookingParam,
        int $userId,
        bool $lockForUpdate = false
    ): Booking {
        if ($bookingParam instanceof Booking) {
            if ((int) $bookingParam->user_id !== $userId) {
                throw new AuthorizationException('Bạn không có quyền truy cập đơn đặt khám này.');
            }

            if (! $lockForUpdate) {
                return $bookingParam->loadMissing(['hospital', 'examType', 'patientProfile', 'slot']);
            }

            // Re-query bên trong transaction để lock thực sự có hiệu lực cả khi
            // tầng gọi truyền vào một model Booking đã được load từ trước.
            $bookingParam = $bookingParam->getKey();
        }

        $query = Booking::query()
            ->with(['hospital', 'examType', 'patientProfile', 'slot'])
            ->where('user_id', $userId);

        if ($lockForUpdate) {
            $query->lockForUpdate();
        }

        if (is_numeric($bookingParam)) {
            return $query->findOrFail((int) $bookingParam);
        }

        return $query->where('code', (string) $bookingParam)->firstOrFail();
    }

    private function resolvePayment(
        int|Payment $paymentParam,
        int $userId,
        bool $lockForUpdate = false
    ): Payment {
        $paymentId = $paymentParam instanceof Payment ? $paymentParam->getKey() : $paymentParam;
        $query = Payment::query()
            ->with('booking')
            ->whereHas('booking', static fn ($bookingQuery) => $bookingQuery->where('user_id', $userId));

        if ($lockForUpdate) {
            $query->lockForUpdate();
        }

        return $query->findOrFail($paymentId);
    }

    private function loadPaymentDetails(Payment $payment): Payment
    {
        $payment->refresh();
        $payment->load(['booking.hospital', 'booking.patientProfile', 'booking.examType']);

        return $payment;
    }

    private function toVndAmount(mixed $value, string $field): int
    {
        if (! is_numeric($value)) {
            throw new DomainException("{$field} không hợp lệ.");
        }

        $amount = (float) $value;
        if ($amount < 0 || abs($amount - round($amount)) > 0.00001) {
            throw new DomainException("{$field} phải là số nguyên VNĐ không âm.");
        }

        return (int) round($amount);
    }

    private function formatVnd(int $amount): string
    {
        return number_format($amount, 0, ',', '.').' đ';
    }

    private function generateTransactionCode(): string
    {
        return Str::upper('TXN'.now()->format('YmdHisv').Str::random(6));
    }
}
