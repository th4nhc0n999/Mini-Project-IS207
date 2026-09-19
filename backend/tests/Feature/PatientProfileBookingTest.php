<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Doctor;
use App\Models\PatientProfile;
use App\Models\Slot;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PatientProfileBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_many_patient_profiles_relationship(): void
    {
        /** @var User $user */
        $user = User::factory()->create([
            'name' => 'Lê Thành Hiệu',
            'email' => 'hieu@example.com',
        ]);

        $profile1 = PatientProfile::factory()->create([
            'user_id' => $user->id,
            'full_name' => 'Lê Thành Hiệu',
            'relationship' => 'self',
        ]);

        $profile2 = PatientProfile::factory()->create([
            'user_id' => $user->id,
            'full_name' => 'Nguyễn Thị B',
            'relationship' => 'parent',
        ]);

        // Access relation via $user->patientProfiles
        $patientProfiles = $user->patientProfiles;

        $this->assertCount(2, $patientProfiles);
        $this->assertTrue($patientProfiles->contains($profile1));
        $this->assertTrue($patientProfiles->contains($profile2));
        $this->assertEquals('Lê Thành Hiệu', $patientProfiles->first()->full_name);
    }

    public function test_get_bookings_by_user_id(): void
    {
        /** @var User $user */
        $user = User::factory()->create();

        $patientProfile = PatientProfile::factory()->create([
            'user_id' => $user->id,
        ]);

        $specialty = Specialty::create(['name' => 'Nội tổng quát']);
        $doctor = Doctor::create([
            'specialty_id' => $specialty->id,
            'name' => 'Dr. Nguyễn Văn A',
            'city' => 'Hồ Chí Minh',
            'address' => '123 Đường ABC',
        ]);

        $slot1 = Slot::create([
            'owner_type' => 'doctor',
            'owner_id' => $doctor->id,
            'work_date' => now()->addDay()->toDateString(),
            'start_time' => '08:00',
            'end_time' => '08:30',
            'capacity' => 1,
        ]);

        $slot2 = Slot::create([
            'owner_type' => 'doctor',
            'owner_id' => $doctor->id,
            'work_date' => now()->addDay()->toDateString(),
            'start_time' => '08:30',
            'end_time' => '09:00',
            'capacity' => 1,
        ]);

        $booking1 = Booking::create([
            'user_id' => $user->id,
            'patient_profile_id' => $patientProfile->id,
            'booking_type' => 'doctor',
            'doctor_id' => $doctor->id,
            'slot_id' => $slot1->id,
            'status' => 'pending',
        ]);

        $booking2 = Booking::create([
            'user_id' => $user->id,
            'patient_profile_id' => $patientProfile->id,
            'booking_type' => 'doctor',
            'doctor_id' => $doctor->id,
            'slot_id' => $slot2->id,
            'status' => 'confirmed',
        ]);

        // Method 1: $user->bookings
        $userBookings = $user->bookings;
        $this->assertCount(2, $userBookings);

        // Method 2: Booking::forUser($userId) scope
        $scopedBookings = Booking::forUser($user->id)->get();
        $this->assertCount(2, $scopedBookings);

        // Method 3: Booking::getByUserId($userId) static helper
        $helperBookings = Booking::getByUserId($user->id);
        $this->assertCount(2, $helperBookings);

        $this->assertEquals($booking1->id, $scopedBookings->first()->id);
        $this->assertEquals($booking2->id, $scopedBookings->last()->id);
    }
}
