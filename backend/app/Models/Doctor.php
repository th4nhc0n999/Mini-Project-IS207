<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    public function specialty()
    {
        return $this->belongsTo(Specialty::class);
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
