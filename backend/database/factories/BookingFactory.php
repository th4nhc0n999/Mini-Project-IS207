<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Doctor;
use App\Models\PatientProfile;
use App\Models\Slot;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'patient_profile_id' => PatientProfile::factory(),
            'booking_type' => 'doctor',
            'doctor_id' => Doctor::factory(),
            'hospital_id' => null,
            'exam_type_id' => null,
            'slot_id' => Slot::factory(),
            'symptoms' => fake()->sentence(),
            'status' => 'pending',
            'note' => fake()->optional()->sentence(),
        ];
    }
}
