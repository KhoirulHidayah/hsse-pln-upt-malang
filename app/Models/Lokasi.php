<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lokasi extends Model
{
    use HasFactory;

    protected $table = 'lokasis';
    protected $primaryKey = 'lokasi_id';

    protected $fillable = [
        'nama_lokasi',
    ];

    /**
     * Relasi: Satu lokasi memiliki banyak gardu induk.
     */
    public function garduInduk()
    {
        return $this->hasMany(GarduInduk::class, 'lokasi_id', 'lokasi_id');
    }

    /**
     * Hitung jumlah gardu induk yang dimiliki lokasi ini.
     */
    public function getJumlahGarduIndukAttribute()
    {
        return $this->garduInduk()->count();
    }
}
