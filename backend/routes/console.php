<?php

use App\Services\PaymentService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(static function (): void {
    app(PaymentService::class)->expireOverduePayments();
})
    ->name('expire-overdue-payments')
    ->withoutOverlapping()
    ->everyMinute();
