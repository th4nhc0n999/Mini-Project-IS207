<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SpecialtyRequest extends FormRequest
{
    /**
     * Admin mới được phép gửi request này.
     */
    public function authorize(): bool
    {
        return true; // Phân quyền sẽ do Middleware CheckRole xử lý
    }

    /**
     * Validation rules cho Thêm / Sửa chuyên khoa.
     */
    public function rules(): array
    {
        $specialtyId = $this->route('specialty'); // null khi tạo mới

        return [
            'name'  => [
                $specialtyId ? 'sometimes' : 'required',
                'string',
                'max:100',
                // Tên chuyên khoa không được trùng (bỏ qua bản ghi đang sửa)
                'unique:specialties,name,' . $specialtyId,
            ],
            'image' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Thông báo lỗi tiếng Việt.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Tên chuyên khoa không được để trống.',
            'name.max'      => 'Tên chuyên khoa tối đa 100 ký tự.',
            'name.unique'   => 'Tên chuyên khoa này đã tồn tại.',
            'image.max'     => 'Đường dẫn ảnh tối đa 255 ký tự.',
        ];
    }
}
