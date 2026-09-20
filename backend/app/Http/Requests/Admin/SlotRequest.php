<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SlotRequest extends FormRequest
{
    /**
     * Admin mới được phép gửi request này.
     */
    public function authorize(): bool
    {
        return true; // Phân quyền sẽ do Middleware CheckRole xử lý
    }

    /**
     * Validation rules cho Tạo / Sửa khung giờ khám.
     */
    public function rules(): array
    {
        $isUpdate = $this->route('slot') !== null;

        return [
            'owner_type' => [
                $isUpdate ? 'sometimes' : 'required',
                Rule::in(['doctor', 'hospital']),
            ],
            'owner_id'   => [
                $isUpdate ? 'sometimes' : 'required',
                'integer',
                'min:1',
            ],
            'work_date'  => [
                $isUpdate ? 'sometimes' : 'required',
                'date',
                'date_format:Y-m-d',
                'after_or_equal:today', // Không tạo slot trong quá khứ
            ],
            'start_time' => [
                $isUpdate ? 'sometimes' : 'required',
                'date_format:H:i',
            ],
            'end_time'   => [
                $isUpdate ? 'sometimes' : 'required',
                'date_format:H:i',
                'after:start_time', // Giờ kết thúc phải sau giờ bắt đầu
            ],
            'capacity'   => [
                'sometimes',
                'integer',
                'min:1',
                'max:50', // Giới hạn sức chứa tối đa 50 bệnh nhân/slot
            ],
            'status'     => [
                'sometimes',
                Rule::in(['available', 'full', 'blocked']),
            ],
        ];
    }

    /**
     * Thông báo lỗi tiếng Việt.
     */
    public function messages(): array
    {
        return [
            'owner_type.required'       => 'Vui lòng chọn loại chủ slot (doctor hoặc hospital).',
            'owner_type.in'             => 'Loại chủ slot phải là "doctor" hoặc "hospital".',
            'owner_id.required'         => 'Vui lòng chọn bác sĩ hoặc bệnh viện.',
            'owner_id.min'              => 'ID không hợp lệ.',
            'work_date.required'        => 'Ngày khám không được để trống.',
            'work_date.date_format'     => 'Ngày khám phải đúng định dạng YYYY-MM-DD.',
            'work_date.after_or_equal'  => 'Không thể tạo khung giờ trong quá khứ.',
            'start_time.required'       => 'Giờ bắt đầu không được để trống.',
            'start_time.date_format'    => 'Giờ bắt đầu phải đúng định dạng HH:mm.',
            'end_time.required'         => 'Giờ kết thúc không được để trống.',
            'end_time.date_format'      => 'Giờ kết thúc phải đúng định dạng HH:mm.',
            'end_time.after'            => 'Giờ kết thúc phải sau giờ bắt đầu.',
            'capacity.integer'          => 'Sức chứa phải là số nguyên.',
            'capacity.min'              => 'Sức chứa tối thiểu là 1.',
            'capacity.max'              => 'Sức chứa tối đa là 50.',
            'status.in'                 => 'Trạng thái phải là "available", "full" hoặc "blocked".',
        ];
    }
}
