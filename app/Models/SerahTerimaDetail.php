<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SerahTerimaDetail extends Model
{
    protected $table = 't_serah_terima_details';
    protected $primaryKey = 'detail_id';
    
    protected $fillable = [
        'serah_terima_id',
        'item_nama',
        'item_merk',
        'jumlah',
        'keadaan',
        'cek'
    ];

    protected $casts = [
        'cek' => 'boolean',
        'jumlah' => 'string',
    ];

    /**
     * Relasi ke serah terima utama
     */
    public function serahTerima(): BelongsTo
    {
        return $this->belongsTo(SerahTerima::class, 'serah_terima_id', 'serah_terima_id');
    }

    /**
     * Accessor untuk display item lengkap
     */
    public function getItemLengkapAttribute()
    {
        $text = $this->item_nama;
        if ($this->item_merk) {
            $text .= " ({$this->item_merk})";
        }
        return $text;
    }

    /**
     * Scope untuk filter barang yang dicek
     */
    public function scopeCekTrue($query)
    {
        return $query->where('cek', true);
    }

    /**
     * Scope untuk filter berdasarkan keadaan
     */
    public function scopeByKeadaan($query, $keadaan)
    {
        return $query->where('keadaan', $keadaan);
    }
}