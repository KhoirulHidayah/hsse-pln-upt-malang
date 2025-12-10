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
        'catatan',
        'is_read',
    ];

    /**
     * Cast atribut ke tipe data yang sesuai
     */
    protected $casts = [
        'tanggal_distribusi' => 'date',
        'tanggal_pemeriksaan' => 'date',
        'tanggal_berakhir' => 'date',
        'is_read' => 'boolean',
        'stok' => 'integer',
    ];

    /**
     * 🔗 Relasi ke tabel APD utama
     */
    public function apd()
    {
        return $this->belongsTo(Apd::class, 'apd_id', 'id');
    }

    /**
     * 🔗 Relasi ke pengguna (pegawai/pemakai APD)
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * 🔗 Relasi ke lokasi
     */
    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_id', 'lokasi_id');
    }

    /**
     * 🔗 Relasi ke gardu induk
     */
    public function garduInduk()
    {
        return $this->belongsTo(GarduInduk::class, 'gardu_induk_id', 'gardu_induk_id');
    }

    /**
     * 🧮 Atribut tambahan yang akan di-append ke model
     */
    protected $appends = ['status_notifikasi_otomatis', 'status_color'];

    /**
     * 🧮 Kalkulasi status notifikasi otomatis berdasarkan tanggal berakhir
     * ✅ PERBAIKAN: Sesuai dengan aturan baru
     * - < 30 hari = Expired (Merah)
     * - 30-90 hari = Warning (Kuning)
     * - > 90 hari = Active (Hijau)
     */
    public function getStatusNotifikasiOtomatisAttribute()
    {
        if (!$this->tanggal_berakhir) {
            return 'Expired';
        }

        $today = Carbon::now()->startOfDay();
        $expiry = Carbon::parse($this->tanggal_berakhir)->startOfDay();
        $daysLeft = (int) $today->diffInDays($expiry, false);

        // ✅ PERBAIKAN: Logika baru
        if ($daysLeft < 30) {
            return 'Expired';
        } elseif ($daysLeft >= 30 && $daysLeft <= 90) {
            return 'Warning';
        } else {
            return 'Active';
        }
    }

    /**
     * 🎨 Mendapatkan warna badge untuk status notifikasi
     */
    public function getStatusColorAttribute()
    {
        $status = $this->status_notifikasi_otomatis;
        
        return match($status) {
            'Active' => 'success',
            'Warning' => 'warning',
            'Expired' => 'danger',
            default => 'secondary'
        };
    }

    /**
     * 📊 Scope untuk filter berdasarkan status notifikasi DINAMIS
     * ✅ PERBAIKAN: Menggunakan DATEDIFF untuk perhitungan real-time
     */
    public function scopeActive($query)
    {
        return $query->whereNotNull('tanggal_berakhir')
            ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) > 90');
    }

    public function scopeWarning($query)
    {
        return $query->whereNotNull('tanggal_berakhir')
            ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90');
    }

    public function scopeExpired($query)
    {
        return $query->whereNotNull('tanggal_berakhir')
            ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) < 30');
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

    /**
     * 📊 Scope untuk filter notifikasi yang belum dibaca
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * 📊 Scope untuk filter notifikasi yang sudah dibaca
     */
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    /**
     * 🔔 Method untuk menandai notifikasi sebagai sudah dibaca
     */
    public function markAsRead()
    {
        $this->update(['is_read' => true]);
    }

    /**
     * 🔔 Method untuk menandai notifikasi sebagai belum dibaca
     */
    public function markAsUnread()
    {
        $this->update(['is_read' => false]);
    }
}