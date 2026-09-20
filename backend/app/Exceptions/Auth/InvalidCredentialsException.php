<?php

namespace App\Exceptions\Auth;

use App\Exceptions\BusinessException;

class InvalidCredentialsException extends BusinessException
{
    /**
     * Khởi tạo ngoại lệ sai thông tin đăng nhập.
     * Mặc định trả mã lỗi HTTP 401 (Unauthorized).
     */
    public function __construct(string $message = 'Thông tin đăng nhập không chính xác.')
    {
        // Gọi constructor của BusinessException: truyền message và mã status 401
        parent::__construct($message, 401);
    }
}
