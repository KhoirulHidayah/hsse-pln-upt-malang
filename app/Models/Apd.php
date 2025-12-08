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
        'gambar',
        'bahan',
        'warna',
        'ukuran',
        'kemampuan',
        'fungsi',
        'standar',
        'masa_penggunaan',
        'created_by',
        'updated_by',
    ];

    protected $with = ['jenis', 'createdBy', 'updatedBy'];

    public function jenis()
    {
        return $this->belongsTo(JenisApd::class, 'jenis_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}