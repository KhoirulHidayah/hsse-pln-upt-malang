<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SerahTerima extends Model
{
    protected $table = 't_serah_terimas';
    protected $primaryKey = 'serah_terima_id';

    protected $fillable = [
        'no_seri',
        'no_dokumen',
        'status_dokumen',
        'copy_no',
        'nomor_revisi',
        'nomor_edisi',
        'tanggal_efektif',
        'tanggal',
        'nama_penerima',
        'jabatan_pengirim',
        'nama_pengirim',
        'lokasi',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'tanggal_efektif' => 'date',
    ];

    // Relasi ke detail
    public function details()
    {
        return $this->hasMany(SerahTerimaDetail::class, 'serah_terima_id', 'serah_terima_id');
    }

    // Accessor untuk menampilkan status dokumen dengan format yang lebih baik
    public function getStatusDokumenDisplayAttribute()
    {
        if (!$this->status_dokumen) {
            return '-';
        }
        
        $display = $this->status_dokumen;
        
        if ($this->status_dokumen === 'COPY' && $this->copy_no) {
            $display .= ' - ' . $this->copy_no;
        }
        
        return $display;
    }

    // Accessor untuk no_dokumen (ambil dari config jika null)
    public function getNoDocumentAttribute()
    {
        return $this->no_dokumen ?? DokumenConfig::getValue('no_dokumen_default');
    }

    // Accessor untuk nomor_revisi (ambil dari config jika null)
    public function getNomorRevisiDisplayAttribute()
    {
        return $this->nomor_revisi ?? DokumenConfig::getValue('nomor_revisi_default');
    }

    // Accessor untuk nomor_edisi (ambil dari config jika null)
    public function getNomorEdisiDisplayAttribute()
    {
        return $this->nomor_edisi ?? DokumenConfig::getValue('nomor_edisi_default');
    }

    /**
     * Generate nomor seri otomatis dengan format: ST/YYYYMMDD/XXXX
     * Contoh: ST/20251205/0001
     * 
     * @param string|null $tanggal - Tanggal transaksi (Y-m-d format), default hari ini
     * @return string
     */
    public static function generateNoSeri($tanggal = null)
    {
        // Gunakan tanggal hari ini jika tidak ada parameter
        $date = $tanggal ? date('Ymd', strtotime($tanggal)) : date('Ymd');
        
        // Cari nomor terakhir pada tanggal yang sama
        $lastRecord = self::where('no_seri', 'LIKE', "ST/{$date}/%")
            ->orderBy('no_seri', 'desc')
            ->first();

        if ($lastRecord) {
            // Ambil nomor urut dari no_seri terakhir
            $parts = explode('/', $lastRecord->no_seri);
            $lastNumber = isset($parts[2]) ? (int) $parts[2] : 0;
            $newNumber = $lastNumber + 1;
        } else {
            // Jika belum ada transaksi di tanggal ini, mulai dari 1
            $newNumber = 1;
        }

        // Format: ST/YYYYMMDD/XXXX (4 digit dengan leading zero)
        return sprintf('ST/%s/%04d', $date, $newNumber);
    }

    /**
     * Generate nomor seri berdasarkan tahun dan bulan: ST/YYYYMM/XXXX
     * Contoh: ST/202512/0001
     * 
     * @param string|null $tanggal
     * @return string
     */
    public static function generateNoSeriMonthly($tanggal = null)
    {
        // Gunakan bulan tahun ini jika tidak ada parameter
        $yearMonth = $tanggal ? date('Ym', strtotime($tanggal)) : date('Ym');
        
        // Cari nomor terakhir pada bulan yang sama
        $lastRecord = self::where('no_seri', 'LIKE', "ST/{$yearMonth}/%")
            ->orderBy('no_seri', 'desc')
            ->first();

        if ($lastRecord) {
            $parts = explode('/', $lastRecord->no_seri);
            $lastNumber = isset($parts[2]) ? (int) $parts[2] : 0;
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        // Format: ST/YYYYMM/XXXX
        return sprintf('ST/%s/%04d', $yearMonth, $newNumber);
    }

    /**
     * Generate nomor seri berdasarkan tahun saja: ST/YYYY/XXXX
     * Contoh: ST/2025/0001
     * 
     * @return string
     */
    public static function generateNoSeriYearly()
    {
        $year = date('Y');
        
        // Cari nomor terakhir pada tahun yang sama
        $lastRecord = self::where('no_seri', 'LIKE', "ST/{$year}/%")
            ->orderBy('no_seri', 'desc')
            ->first();

        if ($lastRecord) {
            $parts = explode('/', $lastRecord->no_seri);
            $lastNumber = isset($parts[2]) ? (int) $parts[2] : 0;
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        // Format: ST/YYYY/XXXX
        return sprintf('ST/%s/%04d', $year, $newNumber);
    }
}