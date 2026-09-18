<?php

namespace Database\Seeders;

use App\Models\Doctor;
use App\Models\ExamType;
use App\Models\Hospital;
use App\Models\Slot;
use App\Models\Specialty;
use Illuminate\Database\Seeder;

class ReferenceDataSeeder extends Seeder
{
    public function run(): void
    {
        $internalMedicine = Specialty::create([
            'name' => 'Noi tong quat',
            'image' => null,
        ]);
        $pediatrics = Specialty::create([
            'name' => 'Nhi khoa',
            'image' => null,
        ]);

        $internalMedicineDoctor = Doctor::create([
            'specialty_id' => $internalMedicine->id,
            'name' => 'Dr. Tran Thi Binh',
            'bio' => 'Bac si noi tong quat voi 10 nam kinh nghiem.',
            'city' => 'Ho Chi Minh',
            'address' => '12 Nguyen Hue, Quan 1',
        ]);
        $pediatrician = Doctor::create([
            'specialty_id' => $pediatrics->id,
            'name' => 'Dr. Pham Minh Chau',
            'bio' => 'Bac si nhi khoa voi kinh nghiem cham soc tre em.',
            'city' => 'Ho Chi Minh',
            'address' => '45 Le Thanh Ton, Quan 1',
        ]);

        $hospital = Hospital::create([
            'name' => 'MedSi General Clinic',
            'description' => 'Phong kham da khoa.',
            'address' => '25 Le Loi, Quan 1',
            'city' => 'Ho Chi Minh',
            'hotline' => '0281234567',
        ]);
        $hospitalTwo = Hospital::create([
            'name' => 'MedSi Children Hospital',
            'description' => 'Co so kham va dieu tri chuyen khoa nhi.',
            'address' => '80 Nguyen Trai, Quan 5',
            'city' => 'Ho Chi Minh',
            'hotline' => '0287654321',
        ]);

        ExamType::create([
            'hospital_id' => $hospital->id,
            'name' => 'Kham tong quat',
            'price' => 250000,
        ]);
        ExamType::create([
            'hospital_id' => $hospital->id,
            'name' => 'Xet nghiem mau co ban',
            'price' => 180000,
        ]);
        ExamType::create([
            'hospital_id' => $hospitalTwo->id,
            'name' => 'Kham nhi tong quat',
            'price' => 300000,
        ]);

        Slot::create([
            'owner_type' => 'doctor',
            'owner_id' => $internalMedicineDoctor->id,
            'work_date' => now()->addDay()->toDateString(),
            'start_time' => '08:00',
            'end_time' => '08:30',
            'capacity' => 1,
        ]);
        Slot::create([
            'owner_type' => 'doctor',
            'owner_id' => $internalMedicineDoctor->id,
            'work_date' => now()->addDay()->toDateString(),
            'start_time' => '08:30',
            'end_time' => '09:00',
            'capacity' => 1,
        ]);
        Slot::create([
            'owner_type' => 'doctor',
            'owner_id' => $pediatrician->id,
            'work_date' => now()->addDays(2)->toDateString(),
            'start_time' => '09:00',
            'end_time' => '09:30',
            'capacity' => 2,
        ]);
        Slot::create([
            'owner_type' => 'hospital',
            'owner_id' => $hospital->id,
            'work_date' => now()->addDay()->toDateString(),
            'start_time' => '09:00',
            'end_time' => '10:00',
            'capacity' => 10,
        ]);
        Slot::create([
            'owner_type' => 'hospital',
            'owner_id' => $hospitalTwo->id,
            'work_date' => now()->addDays(2)->toDateString(),
            'start_time' => '10:00',
            'end_time' => '11:00',
            'capacity' => 8,
        ]);
    }
}
