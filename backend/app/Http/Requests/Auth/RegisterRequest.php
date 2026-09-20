<?php

namespace App\Http\Requests\Auth;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Cho phép ai được gửi request này.
     * Trả về true vì bất kỳ ai (khách vãng lai) cũng có quyền đăng ký tài khoản.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Bộ quy tắc kiểm tra tính hợp lệ của dữ liệu (Validation Rules)
     */
    public function rules(): array
    {
        return [
            'name'     => ['required', 'string', 'max:150'],
            'email'    => ['required', 'string', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone'    => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'      => 'Vui lòng nhập họ và tên.',
            'name.max'           => 'Họ và tên không được vượt quá 150 ký tự.',
            'email.required'     => 'Vui lòng nhập địa chỉ email.',
            'email.email'        => 'Email không đúng định dạng.',
            'email.unique'       => 'Email này đã được sử dụng.',
            'password.required'  => 'Vui lòng nhập mật khẩu.',
            'password.min'       => 'Mật khẩu phải có ít nhất 8 ký tự.',
            'password.confirmed' => 'Mật khẩu xác nhận không khớp.',
            'phone.max'          => 'Số điện thoại không được vượt quá 20 ký tự.',
        ];
    }
}
