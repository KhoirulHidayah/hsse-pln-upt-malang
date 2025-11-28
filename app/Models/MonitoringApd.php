<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class MonitoringApd extends Model
{
    use HasFactory;

    protected $table = 'monitoring_apds';
    protected $primaryKey = 'monitoring_id';

    protected $fillable = [
        'apd_id',
        'apd_detail_id',
        'user_id',
        'lokasi_id',
        'gardu_induk_id',
        'stok',
        'tanggal_distribusi',
        'tanggal_pemeriksaan',
        'tanggal_berakhir',
        'kondisi',
        'catatan',
    ];

    /**
     * 🔗 Relasi ke tabel APD utama.
     */
    public function apd()
    {
        return $this->belongsTo(Apd::class, 'apd_id', 'id');
    }

    /**
     * 🔗 Relasi ke detail APD (tipe, ukuran, standar, dsb).
     */
    public function apdDetail()
    {
        return $this->belongsTo(ApdDetail::class, 'apd_detail_id', 'id');
    }

    /**
     * 🔗 Relasi ke pengguna (pegawai/pemakai APD).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * 🔗 Relasi ke lokasi (contoh: ULTG Krian).
     */
    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_id', 'lokasi_id');
    }

    /**
     * 🔗 Relasi ke gardu induk.
     */
    public function garduInduk()
    {
        return $this->belongsTo(GarduInduk::class, 'gardu_induk_id', 'gardu_induk_id');
    }

    /**
     * 🧮 Atribut tambahan: status notifikasi otomatis berdasarkan tanggal berakhir.
     */
    protected $appends = ['status_notifikasi_otomatis'];

    public function getStatusNotifikasiOtomatisAttribute()
    {
        if (!$this->tanggal_berakhir) {
            return 'Expired';
        }

        $selisih = Carbon::now()->diffInDays(Carbon::parse($this->tanggal_berakhir), false);

        if ($selisih > 90) {
            return 'Active';
        } elseif ($selisih >= 30 && $selisih <= 90) {
            return 'Warning';
        } else {
            return 'Expired';
        }
    }
}
