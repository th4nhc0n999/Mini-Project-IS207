<?php

namespace App\Services;

use App\Exceptions\Doctor\DoctorNotFoundException;
use App\Models\Doctor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class DoctorService
{
    /**
     * Tìm kiếm và lọc danh sách bác sĩ theo chuyên khoa, từ khóa hoặc thành phố.
     *
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator
     */
    public function search(array $filters = []): LengthAwarePaginator
    {
        $query = Doctor::query()->with('specialty');

        $specialtyId = $filters['specialty_id'] ?? null;
        if (! empty($specialtyId)) {
            $query->bySpecialty($specialtyId);
        }

        $keyword = $filters['keyword'] ?? $filters['q'] ?? null;
        if (! empty($keyword)) {
            $query->search($keyword);
        }

        $city = $filters['city'] ?? null;
        if (! empty($city)) {
            $query->inCity($city);
        }

        $perPage = (int) ($filters['per_page'] ?? 10);

        return $query->orderBy('name')->paginate($perPage);
    }

    /**
     * Lấy thông tin chi tiết của bác sĩ kèm chuyên khoa và danh sách khung giờ khám còn trống.
     *
     * @param  int  $id
     * @param  string|null  $date
     * @return Doctor
     *
     * @throws DoctorNotFoundException
     */
    public function getDetail(int $id, ?string $date = null): Doctor
    {
        $doctor = Doctor::with([
            'specialty',
            'slots' => function ($query) use ($date) {
                $query->where('status', 'available');

                if (! empty($date)) {
                    $query->whereDate('work_date', $date);
                } else {
                    $query->whereDate('work_date', '>=', now()->toDateString());
                }

                $query->orderBy('work_date')
                      ->orderBy('start_time');
            },
        ])->find($id);

        if (! $doctor) {
            throw new DoctorNotFoundException();
        }

        return $doctor;
    }
}
