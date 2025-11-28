<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Apd extends Model
{
    use HasFactory;

    protected $table = 'apds';

    protected $fillable = [
        'jenis_id',
        'nama_apd',
        'kode_apd',
        'deskripsi',
        'created_by',
        'updated_by',
    ];

    protected $with = ['jenis', 'createdBy', 'updatedBy'];

    /**
     * Relasi ke jenis APD
     */
    public function jenis()
    {
        return $this->belongsTo(JenisApd::class, 'jenis_id');
    }

    /**
     * Relasi ke user pembuat
     */
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relasi ke user pengubah terakhir
     */
    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    /**
     * Relasi ke detail APD (apd_details)
     */
    public function details()
    {
        return $this->hasMany(ApdDetail::class, 'apd_id');
    }
}
