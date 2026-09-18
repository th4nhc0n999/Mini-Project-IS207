<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@medsi.test'], [
            'name' => 'System Admin',
            'password' => 'password',
            'phone' => '0900000000',
            'role' => 'admin',
        ]);
    }
}
