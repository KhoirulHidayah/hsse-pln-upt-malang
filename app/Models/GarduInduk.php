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

    /**
     * Relasi: Gardu induk dimiliki oleh satu lokasi.
     */
    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_id', 'lokasi_id');
    }
}
