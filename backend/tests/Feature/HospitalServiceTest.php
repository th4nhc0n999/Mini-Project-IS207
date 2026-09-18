<?php

namespace Tests\Feature;

use App\Exceptions\Hospital\HospitalNotFoundException;
use App\Models\ExamType;
use App\Models\Hospital;
use App\Models\Slot;
use App\Services\HospitalService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HospitalServiceTest extends TestCase
{
    use RefreshDatabase;

    private HospitalService $hospitalService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->hospitalService = new HospitalService();
    }

    public function test_search_hospitals_returns_paginated_results_and_filters_by_city(): void
    {
        Hospital::create([
            'name' => 'Bệnh viện Quận 1',
            'description' => 'Bệnh viện công lập',
            'address' => '10 Nguyễn Huệ',
            'city' => 'Hồ Chí Minh',
            'hotline' => '028111111',
        ]);

        Hospital::create([
            'name' => 'Bệnh viện Ba Đình',
            'description' => 'Bệnh viện đa khoa',
            'address' => '20 Kim Mã',
            'city' => 'Hà Nội',
            'hotline' => '024222222',
        ]);

        $resultsHcm = $this->hospitalService->search(['city' => 'Hồ Chí Minh']);
        $this->assertEquals(1, $resultsHcm->total());
        $this->assertEquals('Bệnh viện Quận 1', $resultsHcm->first()->name);

        $resultsHn = $this->hospitalService->search(['city' => 'Hà Nội']);
        $this->assertEquals(1, $resultsHn->total());
        $this->assertEquals('Bệnh viện Ba Đình', $resultsHn->first()->name);
    }

    public function test_search_hospitals_filters_by_keyword(): void
    {
        Hospital::create([
            'name' => 'Bệnh viện Nhi Đồng 1',
            'description' => 'Chuyên khoa nhi',
            'address' => 'Sư Vạn Hạnh, Quận 10',
            'city' => 'Hồ Chí Minh',
            'hotline' => '028333333',
        ]);

        Hospital::create([
            'name' => 'Bệnh viện Tai Mũi Họng',
            'description' => 'Chuyên khoa tai mũi họng',
            'address' => 'Trần Quốc Thảo, Quận 3',
            'city' => 'Hồ Chí Minh',
            'hotline' => '028444444',
        ]);

        $results = $this->hospitalService->search(['keyword' => 'Nhi Đồng']);
        $this->assertEquals(1, $results->total());
        $this->assertEquals('Bệnh viện Nhi Đồng 1', $results->first()->name);
    }

    public function test_get_detail_returns_hospital_with_exam_types_and_slots(): void
    {
        $hospital = Hospital::create([
            'name' => 'Bệnh viện Chợ Rẫy',
            'description' => 'Bệnh viện tuyến trung ương',
            'address' => '201B Nguyễn Chí Thanh, Quận 5',
            'city' => 'Hồ Chí Minh',
            'hotline' => '028555555',
        ]);

        $examType = ExamType::create([
            'hospital_id' => $hospital->id,
            'name' => 'Khám tổng quát đặc biệt',
            'price' => 500000,
        ]);

        $slot = Slot::create([
            'owner_type' => 'hospital',
            'owner_id' => $hospital->id,
            'work_date' => now()->addDay()->toDateString(),
            'start_time' => '08:00',
            'end_time' => '09:00',
            'capacity' => 10,
            'booked_count' => 0,
            'status' => 'available',
        ]);

        $detail = $this->hospitalService->getDetail($hospital->id);

        $this->assertNotNull($detail);
        $this->assertEquals($hospital->id, $detail->id);
        $this->assertTrue($detail->relationLoaded('examTypes'));
        $this->assertCount(1, $detail->examTypes);
        $this->assertEquals('Khám tổng quát đặc biệt', $detail->examTypes->first()->name);

        $this->assertTrue($detail->relationLoaded('slots'));
        $this->assertCount(1, $detail->slots);
    }

    public function test_get_detail_throws_hospital_not_found_exception(): void
    {
        $this->expectException(HospitalNotFoundException::class);
        $this->expectExceptionMessage('Không tìm thấy thông tin bệnh viện');

        $this->hospitalService->getDetail(999999);
    }
}
