<?php

namespace Database\Factories;

use App\Models\PatientProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PatientProfile>
 */
class PatientProfileFactory extends Factory
{
    protected $model = PatientProfile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'full_name' => fake()->name(),
            'dob' => fake()->date('Y-m-d', '-18 years'),
            'gender' => fake()->randomElement(['male', 'female', 'other']),
            'phone' => fake()->numerify('09########'),
            'relationship' => fake()->randomElement(['self', 'spouse', 'child', 'parent', 'other']),
        ];
    }
}
