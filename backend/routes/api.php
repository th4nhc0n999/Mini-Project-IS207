<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PatientProfileController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [ProfileController::class, 'show']);
    Route::match(['put', 'patch'], '/user', [ProfileController::class, 'update']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::apiResource('patient-profiles', PatientProfileController::class);
});

