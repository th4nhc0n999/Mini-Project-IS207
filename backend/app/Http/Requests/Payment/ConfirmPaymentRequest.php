<?php

namespace App\Http\Requests\Payment;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class ConfirmPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'payment_id' => ['required', 'integer', 'min:1'],
            'otp' => ['nullable', 'string', 'digits:6'],
        ];
    }

    public function messages(): array
    {
        return [
            'payment_id.required' => 'Mã định danh giao dịch thanh toán là bắt buộc.',
            'payment_id.min' => 'Mã định danh giao dịch thanh toán không hợp lệ.',
            'otp.digits' => 'Mã OTP phải gồm đúng 6 chữ số.',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Dữ liệu xác nhận không hợp lệ.',
            'data' => null,
            'errors' => $validator->errors(),
        ], 422));
    }
}
