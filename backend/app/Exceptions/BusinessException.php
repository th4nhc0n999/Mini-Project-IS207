<?php

namespace App\Exceptions;

use Exception;

abstract class BusinessException extends Exception
{
    protected int $statusCode = 400;

    public function __construct(string $message = '', int $statusCode = 400, ?Exception $previous = null)
    {
        $this->statusCode = $statusCode;
        parent::__construct($message, $statusCode, $previous);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }
}
