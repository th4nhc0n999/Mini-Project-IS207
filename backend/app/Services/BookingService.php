<?php

namespace App\Services;

use App\Models\Booking;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BookingService
{
    /**
     * Lấy danh sách lịch sử booking của một user có phân trang và bộ lọc.
     *
     * @param  int  $userId
     * @param  array<string, mixed>  $filters
     * @return LengthAwarePaginator
     */
    public function getUserBookings(int $userId, array $filters = []): LengthAwarePaginator
    {
        $query = Booking::query()
            ->forUser($userId)
            ->with([
                'patientProfile',
                'doctor.specialty',
                'hospital',
                'examType',
                'slot',
                'payment',
            ]);

        // Lọc theo trạng thái booking
        $status = $filters['status'] ?? null;
        if (! empty($status)) {
            $query->where('status', $status);
        }

        // Lọc theo từ khóa (mã booking, tên bệnh nhân, tên bác sĩ, tên bệnh viện)
        $keyword = $filters['keyword'] ?? $filters['q'] ?? null;
        if (! empty($keyword)) {
            $query->where(function ($q) use ($keyword) {
                $q->where('code', 'like', "%{$keyword}%")
                    ->orWhereHas('patientProfile', function ($pQuery) use ($keyword) {
                        $pQuery->where('full_name', 'like', "%{$keyword}%");
                    })
                    ->orWhereHas('doctor', function ($dQuery) use ($keyword) {
                        $dQuery->where('name', 'like', "%{$keyword}%");
                    })
                    ->orWhereHas('hospital', function ($hQuery) use ($keyword) {
                        $hQuery->where('name', 'like', "%{$keyword}%");
                    });
            });
        }

        $perPage = (int) ($filters['per_page'] ?? 10);

        return $query->orderByDesc('created_at')->paginate($perPage);
    }
}
