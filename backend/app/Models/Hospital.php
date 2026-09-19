<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Hospital extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'address',
        'city',
        'hotline',
        'image',
    ];

    public function examTypes(): HasMany
    {
        return $this->hasMany(ExamType::class);
    }

    public function slots(): MorphMany
    {
        return $this->morphMany(Slot::class, 'owner');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function scopeSearch(Builder $query, ?string $keyword): Builder
    {
        if (!empty($keyword)) {
            $query->where(function (Builder $q) use ($keyword) {
                $q->where('name', 'like', "%{$keyword}%")
                  ->orWhere('address', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%");
            });
        }

        return $query;
    }

    public function scopeInCity(Builder $query, ?string $city): Builder
    {
        if (!empty($city)) {
            $query->where('city', $city);
        }

        return $query;
    }
}
