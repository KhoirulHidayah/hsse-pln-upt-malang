<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'email_verified_at',
        'role',
        'gardu_induk_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // ── Relasi ke gardu induk ──
    public function garduInduk()
    {
        return $this->belongsTo(GarduInduk::class, 'gardu_induk_id', 'gardu_induk_id');
    }

    // ── Helper role ──
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isPemeriksa(): bool
    {
        return $this->role === 'pemeriksa';
    }
}
