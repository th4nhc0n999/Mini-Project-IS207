<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class DoctorRequest extends FormRequest
{
    /**
     * Admin mới được phép gửi request này.
     */
    public function authorize(): bool
    {
        return true; // Phân quyền sẽ do Middleware CheckRole xử lý
    }

    /**
     * Validation rules cho Thêm / Sửa bác sĩ.
     */
    public function rules(): array
    {
        $isUpdate = $this->route('doctor') !== null;

        return [
            'specialty_id' => [
                $isUpdate ? 'sometimes' : 'required',
                'integer',
                'exists:specialties,id',
            ],
            'name'    => [
                $isUpdate ? 'sometimes' : 'required',
                'string',
                'max:150',
            ],
            'bio'     => ['nullable', 'string'],
            'city'    => [
                $isUpdate ? 'sometimes' : 'required',
                'string',
                'max:100',
            ],
            'address' => ['nullable', 'string', 'max:255'],
            'avatar'  => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Thông báo lỗi tiếng Việt.
     */
    public function messages(): array
    {
        return [
            'specialty_id.required' => 'Vui lòng chọn chuyên khoa.',
            'specialty_id.exists'   => 'Chuyên khoa không tồn tại.',
            'name.required'         => 'Tên bác sĩ không được để trống.',
            'name.max'              => 'Tên bác sĩ tối đa 150 ký tự.',
            'city.required'         => 'Thành phố không được để trống.',
            'city.max'              => 'Tên thành phố tối đa 100 ký tự.',
            'address.max'           => 'Địa chỉ tối đa 255 ký tự.',
            'avatar.max'            => 'Đường dẫn ảnh tối đa 255 ký tự.',
        ];
    }
}
