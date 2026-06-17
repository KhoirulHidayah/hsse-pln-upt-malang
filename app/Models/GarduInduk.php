<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GarduInduk extends Model
{
    use HasFactory;

    protected $table = 'gardu_induks';
    protected $primaryKey = 'gardu_induk_id';

    protected $fillable = [
        'lokasi_id',
        'nama_gardu_induk',
        'alamat',
        'deskripsi',
    ];

    // ── Relasi ke lokasi ──
    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_id', 'lokasi_id');
    }

    // ── Relasi ke user pemeriksa (1 gardu = 1 pemeriksa) ──
    public function users()
    {
        return $this->hasMany(User::class, 'gardu_induk_id', 'gardu_induk_id');
    }

    // ── Relasi ke monitoring APD ──
    public function monitoringApds()
    {
        return $this->hasMany(MonitoringApd::class, 'gardu_induk_id', 'gardu_induk_id');
    }
}