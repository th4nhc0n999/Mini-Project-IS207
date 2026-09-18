<?php

namespace App\Providers;

use App\Models\Doctor;
use App\Models\Hospital;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Relation::morphMap([
            'doctor' => Doctor::class,
            'hospital' => Hospital::class,
        ]);
    }
}
