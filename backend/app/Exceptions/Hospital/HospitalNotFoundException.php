<?php

namespace App\Exceptions\Hospital;

use App\Exceptions\BusinessException;

class HospitalNotFoundException extends BusinessException
{
    public function __construct(string $message = 'Không tìm thấy thông tin bệnh viện')
    {
        parent::__construct($message, 404);
    }
}
