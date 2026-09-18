<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'patient_profile_id',
        'booking_type',
        'doctor_id',
        'hospital_id',
        'exam_type_id',
        'slot_id',
        'symptoms',
        'status',
        'slot_hold_expires_at',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'slot_hold_expires_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Booking $booking) {
            if ($booking->code) {
                return;
            }

            $prefix = 'BK'.now()->format('Ymd');
            $lastCode = static::where('code', 'like', $prefix.'%')
                ->orderByDesc('code')
                ->value('code');
            $sequence = $lastCode ? ((int) Str::after($lastCode, $prefix)) + 1 : 1;
            $booking->code = $prefix.str_pad((string) $sequence, 3, '0', STR_PAD_LEFT);
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function patientProfile()
    {
        return $this->belongsTo(PatientProfile::class);
    }

    public function doctor()
    {
        return $this->belongsTo(Doctor::class);
    }

    public function hospital()
    {
        return $this->belongsTo(Hospital::class);
    }

    public function examType()
    {
        return $this->belongsTo(ExamType::class);
    }

    public function slot()
    {
        return $this->belongsTo(Slot::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
