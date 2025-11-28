<?php

namespace App\Imports;

use App\Models\MonitoringApd;
use App\Models\Apd;
use App\Models\ApdDetail;
use App\Models\Lokasi;
use App\Models\GarduInduk;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Illuminate\Support\Facades\Log;

class MonitoringApdImport implements ToModel, WithHeadingRow, SkipsEmptyRows, WithBatchInserts, WithChunkReading
{
    private $importedCount = 0;
    private $updatedCount = 0;
    private $skippedCount = 0;
    private $duplicateCount = 0;
    private $errorRows = [];
    private $currentRow = 1; // Start from 1 (header)
    
    public function model(array $row)
    {
        $this->currentRow++;
        
        // Skip jika baris kosong
        if (empty($row['nama_apd']) || trim($row['nama_apd']) === '') {
            $this->skippedCount++;
            Log::info("Baris {$this->currentRow}: Baris kosong - dilewati");
            return null;
        }

        // Konversi tanggal
        $tanggalDistribusi   = $this->convertDate($row['tanggal_distribusi_yyyy_mm_dd'] ?? $row['tanggal_distribusi'] ?? null);
        $tanggalPemeriksaan  = $this->convertDate($row['tanggal_pemeriksaan_yyyy_mm_dd'] ?? $row['tanggal_pemeriksaan'] ?? null);
        $tanggalBerakhir     = $this->convertDate($row['tanggal_berakhir_yyyy_mm_dd'] ?? $row['tanggal_berakhir'] ?? null);

        // Ambil data referensi berdasarkan nama (case insensitive & trim)
        $apd    = Apd::whereRaw('LOWER(TRIM(nama_apd)) = ?', [strtolower(trim($row['nama_apd'] ?? ''))])->first();
        $detail = ApdDetail::whereRaw('LOWER(TRIM(nama_detail)) = ?', [strtolower(trim($row['detail_apd'] ?? ''))])->first();
        $lokasi = Lokasi::whereRaw('LOWER(TRIM(nama_lokasi)) = ?', [strtolower(trim($row['lokasi'] ?? ''))])->first();
        $gardu  = GarduInduk::whereRaw('LOWER(TRIM(nama_gardu_induk)) = ?', [strtolower(trim($row['gardu_induk'] ?? ''))])->first();

        // Validasi dan catat error
        $errors = [];
        if (!$apd) {
            $errors[] = "APD '{$row['nama_apd']}' tidak ditemukan";
        }
        if (!$detail) {
            $errors[] = "Detail APD '{$row['detail_apd']}' tidak ditemukan";
        }
        if (!$lokasi) {
            $errors[] = "Lokasi '{$row['lokasi']}' tidak ditemukan";
        }
        if (!$gardu) {
            $errors[] = "Gardu Induk '{$row['gardu_induk']}' tidak ditemukan";
        }
        if (!$tanggalDistribusi) {
            $errors[] = "Tanggal Distribusi tidak valid";
        }

        // Jika ada error, catat dan skip
        if (!empty($errors)) {
            $this->errorRows[] = [
                'row' => $this->currentRow,
                'errors' => $errors,
                'data' => [
                    'nama_apd' => $row['nama_apd'] ?? '-',
                    'detail_apd' => $row['detail_apd'] ?? '-',
                    'lokasi' => $row['lokasi'] ?? '-',
                    'gardu_induk' => $row['gardu_induk'] ?? '-',
                ]
            ];
            $this->skippedCount++;
            Log::warning("Baris {$this->currentRow}: " . implode(', ', $errors));
            return null;
        }

        // Validasi kondisi
        $kondisiValid = ['Baik', 'Rusak', 'Perlu Diganti'];
        $kondisi = trim($row['kondisi'] ?? 'Baik');
        if (!in_array($kondisi, $kondisiValid)) {
            $kondisi = 'Baik';
        }

        // Data untuk insert/update
        $monitoringData = [
            'apd_id'                  => $apd->id,
            'apd_detail_id'           => $detail->id,
            'lokasi_id'               => $lokasi->lokasi_id,
            'gardu_induk_id'          => $gardu->gardu_induk_id,
            'stok'                    => (int)($row['stok'] ?? 0),
            'tanggal_distribusi'      => $tanggalDistribusi,
            'tanggal_pemeriksaan'     => $tanggalPemeriksaan,
            'tanggal_berakhir'        => $tanggalBerakhir,
            'kondisi'                 => $kondisi,
            'catatan'                 => $row['catatan'] ?? null,
        ];

        // Cek duplikasi berdasarkan kombinasi unik: 
        // apd_detail_id + lokasi_id + gardu_induk_id + tanggal_distribusi
        $existing = MonitoringApd::where('apd_detail_id', $detail->id)
            ->where('lokasi_id', $lokasi->lokasi_id)
            ->where('gardu_induk_id', $gardu->gardu_induk_id)
            ->where('tanggal_distribusi', $tanggalDistribusi)
            ->first();

        if ($existing) {
            // Update data yang sudah ada
            $existing->update($monitoringData);
            $this->updatedCount++;
            Log::info("Baris {$this->currentRow}: Data diperbarui (sudah ada data serupa)");
            return null; // Return null karena sudah di-update manual
        }

        // Jika tidak duplikat, buat record baru
        $this->importedCount++;
        Log::info("Baris {$this->currentRow}: Data baru berhasil ditambahkan");

        return new MonitoringApd($monitoringData);
    }

    private function convertDate($value)
    {
        try {
            if (empty($value)) {
                return null;
            }
            
            // Hapus whitespace
            $value = trim($value);
            
            if (is_numeric($value)) {
                // Excel serial number → format tanggal
                return Date::excelToDateTimeObject($value)->format('Y-m-d');
            } elseif (is_string($value)) {
                // Coba parse berbagai format tanggal
                $timestamp = strtotime($value);
                if ($timestamp !== false) {
                    return date('Y-m-d', $timestamp);
                }
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error('Error converting date: ' . $e->getMessage() . ' | Value: ' . $value);
            return null;
        }
    }
    
    public function batchSize(): int
    {
        return 100;
    }
    
    public function chunkSize(): int
    {
        return 100;
    }
    
    public function getImportedCount()
    {
        return $this->importedCount;
    }
    
    public function getUpdatedCount()
    {
        return $this->updatedCount;
    }
    
    public function getSkippedCount()
    {
        return $this->skippedCount;
    }
    
    public function getDuplicateCount()
    {
        return $this->duplicateCount;
    }
    
    public function getErrorRows()
    {
        return $this->errorRows;
    }
}