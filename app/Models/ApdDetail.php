<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApdDetail extends Model
{
    use HasFactory;

    protected $table = 'apd_details';
    protected $primaryKey = 'id'; // default-nya juga 'id', tapi biar eksplisit
    protected $fillable = [
        'apd_id',
        'nama_detail',
        'kode_detail',
        'standar',
        'bahan',
        'warna',
        'ukuran',
        'kemampuan',
        'masa_penggunaan',
        'fungsi',
        'keterangan',
        'gambar',
    ];

    public function apd()
    {
        return $this->belongsTo(Apd::class, 'apd_id');
    }
}
