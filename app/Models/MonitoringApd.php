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
        'user_id',
        'lokasi_id',
        'gardu_induk_id',
        'stok',
        'tanggal_distribusi',
        'tanggal_pemeriksaan',
        'tanggal_berakhir',
        'kondisi',
        'status_notifikasi',
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
     * Ini akan menghitung ulang status secara dinamis.
     */
    protected $appends = ['status_notifikasi_otomatis'];

    public function getStatusNotifikasiOtomatisAttribute()
    {
        if (!$this->tanggal_berakhir) {
            return 'Expired';
        }

        $selisih = Carbon::now()->diffInDays(Carbon::parse($this->tanggal_berakhir), false);

        // Jika selisih negatif, artinya sudah lewat masa berlaku
        if ($selisih < 0) {
            return 'Expired';
        }

        // Jika masa berlaku > 3 bulan (90 hari)
        if ($selisih > 90) {
            return 'Active';
        }
        
        // Jika masa berlaku 0-3 bulan
        if ($selisih >= 0 && $selisih <= 90) {
            return 'Warning';
        }

        return 'Expired';
    }

    /**
     * 🎨 Mendapatkan warna badge untuk status notifikasi
     */
    public function getStatusColorAttribute()
    {
        $status = $this->status_notifikasi ?? $this->status_notifikasi_otomatis;
        
        return match($status) {
            'Active' => 'success',
            'Warning' => 'warning',
            'Expired' => 'danger',
            default => 'secondary'
        };
    }

    /**
     * 📅 Auto-update status_notifikasi sebelum save
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            // Auto-set status_notifikasi berdasarkan tanggal_berakhir
            if ($model->tanggal_berakhir) {
                $selisih = Carbon::now()->diffInDays(Carbon::parse($model->tanggal_berakhir), false);
                
                if ($selisih < 0) {
                    $model->status_notifikasi = 'Expired';
                } elseif ($selisih > 180) {
                    $model->status_notifikasi = 'Active';
                } else {
                    $model->status_notifikasi = 'Warning';
                }
            } else {
                $model->status_notifikasi = 'Expired';
            }
        });
    }

    /**
     * 📊 Scope untuk filter berdasarkan status notifikasi
     */
    public function scopeActive($query)
    {
        return $query->where('status_notifikasi', 'Active');
    }

    public function scopeWarning($query)
    {
        return $query->where('status_notifikasi', 'Warning');
    }

    public function scopeExpired($query)
    {
        return $query->where('status_notifikasi', 'Expired');
    }

    /**
     * 📊 Scope untuk filter berdasarkan kondisi APD
     */
    public function scopeKondisiBaik($query)
    {
        return $query->where('kondisi', 'Baik');
    }

    public function scopeKondisiRusak($query)
    {
        return $query->where('kondisi', 'Rusak');
    }

    public function scopePerluDiganti($query)
    {
        return $query->where('kondisi', 'Perlu Diganti');
    }
}