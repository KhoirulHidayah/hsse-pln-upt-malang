<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JenisApd extends Model
{
    use HasFactory;

    protected $table = 'jenis_apds';

    protected $fillable = [
        'nama_jenis',
        'deskripsi',
    ];

    /**
     * Relasi ke tabel APD
     * Satu jenis APD bisa memiliki banyak data APD
     */
    public function apds()
    {
        return $this->hasMany(Apd::class, 'jenis_id');
    }
}
