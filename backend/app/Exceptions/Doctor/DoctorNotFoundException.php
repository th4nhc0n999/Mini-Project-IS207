<?php

namespace App\Exceptions\Doctor;

use App\Exceptions\BusinessException;

class DoctorNotFoundException extends BusinessException
{
    public function __construct(string $message = 'Không tìm thấy thông tin bác sĩ')
    {
        parent::__construct($message, 404);
    }
}
