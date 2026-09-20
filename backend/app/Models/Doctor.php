<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Doctor extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'specialty_id',
        'name',
        'bio',
        'city',
        'address',
        'avatar',
    ];

    public function specialty(): BelongsTo
    {
        return $this->belongsTo(Specialty::class);
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
                  ->orWhere('bio', 'like', "%{$keyword}%")
                  ->orWhere('address', 'like', "%{$keyword}%");
            });
        }

        return $query;
    }

    public function scopeBySpecialty(Builder $query, $specialtyId): Builder
    {
        if (!empty($specialtyId)) {
            $query->where('specialty_id', $specialtyId);
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
