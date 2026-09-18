<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Doctor;
use App\Models\ExamType;
use App\Models\Hospital;
use App\Models\PatientProfile;
use App\Models\Payment;
use App\Models\Slot;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $patient = User::factory()->create([
            'name' => 'Nguyen Van An',
            'email' => 'patient@example.com',
            'phone' => '0901234567',
        ]);

        User::factory()->create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        $profile = PatientProfile::create([
            'user_id' => $patient->id,
            'full_name' => 'Nguyen Van An',
            'dob' => '1998-05-20',
            'gender' => 'male',
            'phone' => '0901234567',
            'relationship' => 'Khac',
        ]);

        $specialty = Specialty::create([
            'name' => 'Noi tong quat',
            'image' => null,
        ]);

        $doctor = Doctor::create([
            'specialty_id' => $specialty->id,
            'name' => 'Dr. Tran Thi Binh',
            'bio' => 'Bac si noi tong quat voi 10 nam kinh nghiem.',
            'city' => 'Ho Chi Minh',
            'address' => '12 Nguyen Hue, Quan 1',
        ]);

        $hospital = Hospital::create([
            'name' => 'YouMed Clinic',
            'description' => 'Phong kham da khoa.',
            'address' => '25 Le Loi, Quan 1',
            'city' => 'Ho Chi Minh',
            'hotline' => '0281234567',
        ]);

        $examType = ExamType::create([
            'hospital_id' => $hospital->id,
            'name' => 'Kham tong quat',
            'price' => 250000,
        ]);

        $doctorSlot = Slot::create([
            'owner_type' => 'doctor',
            'owner_id' => $doctor->id,
            'work_date' => now()->addDay()->toDateString(),
            'start_time' => '08:00',
            'end_time' => '08:30',
            'capacity' => 1,
        ]);

        $hospitalSlot = Slot::create([
            'owner_type' => 'hospital',
            'owner_id' => $hospital->id,
            'work_date' => now()->addDay()->toDateString(),
            'start_time' => '09:00',
            'end_time' => '10:00',
            'capacity' => 10,
        ]);

        Booking::create([
            'user_id' => $patient->id,
            'patient_profile_id' => $profile->id,
            'booking_type' => 'doctor',
            'doctor_id' => $doctor->id,
            'slot_id' => $doctorSlot->id,
            'symptoms' => 'Dau dau nhe.',
            'status' => 'confirmed',
        ]);
        $doctorSlot->update(['booked_count' => 1, 'status' => 'full']);

        $hospitalBooking = Booking::create([
            'user_id' => $patient->id,
            'patient_profile_id' => $profile->id,
            'booking_type' => 'hospital',
            'hospital_id' => $hospital->id,
            'exam_type_id' => $examType->id,
            'slot_id' => $hospitalSlot->id,
            'status' => 'confirmed',
        ]);
        $hospitalSlot->increment('booked_count');
        Payment::create([
            'booking_id' => $hospitalBooking->id,
            'method' => 'qr_pay',
            'exam_fee' => 250000,
            'service_fee' => 10000,
            'total_amount' => 260000,
            'status' => 'paid',
            'transaction_code' => 'DEMO-0001',
            'paid_at' => now(),
        ]);
    }
}
