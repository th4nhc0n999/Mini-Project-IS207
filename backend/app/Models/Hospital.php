<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    public function examTypes()
    {
        return $this->hasMany(ExamType::class);
    }

    public function slots()
    {
        return $this->morphMany(Slot::class, 'owner');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
