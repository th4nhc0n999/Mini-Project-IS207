<?php

namespace App\Services;

use App\Exceptions\Booking\BookingAlreadyExistsException;
use App\Exceptions\Booking\ExamTypeMismatchException;
use App\Exceptions\Booking\InvalidSlotException;
use App\Exceptions\Booking\PatientProfileNotFoundException;
use App\Exceptions\Booking\SlotUnavailableException;
use App\Exceptions\Hospital\HospitalNotFoundException;
use App\Models\Booking;
use App\Models\ExamType;
use App\Models\Hospital;
use App\Models\PatientProfile;
use App\Models\Payment;
use App\Models\Slot;
use Illuminate\Support\Facades\DB;

class BookingService
{
    // Constants định danh trạng thái và loại booking
    public const TYPE_HOSPITAL = 'hospital';
    public const TYPE_DOCTOR = 'doctor';

    public const STATUS_PENDING_PAYMENT = 'pending_payment';
    public const STATUS_PENDING = 'pending';
    public const STATUS_CONFIRMED = 'confirmed';
    public const STATUS_CANCELLED = 'cancelled';

    public const SLOT_AVAILABLE = 'available';
    public const SLOT_FULL = 'full';
    public const SLOT_BLOCKED = 'blocked';

    /**
     * Tạo lịch khám tại bệnh viện với Pessimistic Locking, DB Transaction và giữ chỗ thanh toán.
     *
     * @param  int  $userId
     * @param  array<string, mixed>  $data
     * @return Booking
     *
     * @throws PatientProfileNotFoundException
     * @throws HospitalNotFoundException
     * @throws ExamTypeMismatchException
     * @throws InvalidSlotException
     * @throws SlotUnavailableException
     * @throws BookingAlreadyExistsException
     */
    public function createHospitalBooking(int $userId, array $data): Booking
    {
        return DB::transaction(function () use ($userId, $data) {
            // 1. Kiểm tra hồ sơ bệnh nhân phải thuộc tài khoản user hiện tại
            $patientProfile = PatientProfile::where('id', $data['patient_profile_id'])
                ->where('user_id', $userId)
                ->first();

            if (! $patientProfile) {
                throw new PatientProfileNotFoundException();
            }

            // 2. Kiểm tra bệnh viện tồn tại
            $hospital = Hospital::find($data['hospital_id']);
            if (! $hospital) {
                throw new HospitalNotFoundException();
            }

            // 3. Kiểm tra loại hình dịch vụ khám phải thuộc về bệnh viện này
            $examType = ExamType::where('id', $data['exam_type_id'])
                ->where('hospital_id', $hospital->id)
                ->first();

            if (! $examType) {
                throw new ExamTypeMismatchException();
            }

            // 4. Khóa bi quan dòng slot:
            $slot = Slot::where('id', $data['slot_id'])
                ->where('owner_type', self::TYPE_HOSPITAL)
                ->where('owner_id', $data['hospital_id'])
                ->lockForUpdate()
                ->first();

            if (! $slot) {
                throw new InvalidSlotException();
            }

            // Kiểm tra trạng thái và sức chứa của slot
            if ($slot->booked_count >= $slot->capacity || $slot->status !== self::SLOT_AVAILABLE) {
                throw new SlotUnavailableException();
            }

            // Kiểm tra ngày khám không được ở trong quá khứ
            if ($slot->work_date && $slot->work_date->isPast() && ! $slot->work_date->isToday()) {
                throw new SlotUnavailableException('Khung giờ khám đã qua hạn đặt');
            }

            // 5. Xử lý dứt điểm Bug P0 (Re-book an toàn + Chống race condition):
            // Khóa dòng và kiểm tra booking active
            $existingBooking = Booking::where('patient_profile_id', $data['patient_profile_id'])
                ->where('slot_id', $slot->id)
                ->whereNotIn('status', ['cancelled', 'rejected'])
                ->lockForUpdate()
                ->first();

            if ($existingBooking) {
                throw new BookingAlreadyExistsException('Hồ sơ này đã có lịch hẹn active cho khung giờ này.');
            }

            // 6. Tính thời hạn giữ chỗ tạm thời (mặc định 15 phút)
            $holdMinutes = isset($data['hold_minutes']) ? (int) $data['hold_minutes'] : 15;
            $slotHoldExpiresAt = now()->addMinutes($holdMinutes);

            // 7. Tạo bản ghi Booking
            $booking = Booking::create([
                'user_id' => $userId,
                'patient_profile_id' => $patientProfile->id,
                'booking_type' => self::TYPE_HOSPITAL,
                'doctor_id' => null,
                'hospital_id' => $hospital->id,
                'exam_type_id' => $examType->id,
                'slot_id' => $slot->id,
                'symptoms' => $data['symptoms'] ?? null,
                'status' => self::STATUS_PENDING_PAYMENT,
                'slot_hold_expires_at' => $slotHoldExpiresAt,
                'note' => $data['note'] ?? null,
            ]);

            // 8. Tăng $slot->increment('booked_count'), cập nhật full nếu chạm capacity
            $slot->increment('booked_count');
            if ($slot->booked_count >= $slot->capacity) {
                $slot->update(['status' => self::SLOT_FULL]);
            }

            // 9. Tạo Payment: status = 'pending', total_amount bằng giá của examType
            $paymentMethod = $data['payment_method'] ?? 'qr_pay';
            Payment::create([
                'booking_id' => $booking->id,
                'method' => $paymentMethod,
                'exam_fee' => $examType->price,
                'service_fee' => 0,
                'total_amount' => $examType->price,
                'status' => 'pending',
            ]);

            return $booking->load(['patientProfile', 'hospital', 'examType', 'slot', 'payment']);
        });
    }
}
