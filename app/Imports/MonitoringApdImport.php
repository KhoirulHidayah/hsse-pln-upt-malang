<?php

namespace App\Imports;

use App\Models\MonitoringApd;
use App\Models\Apd;
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
    private $skippedCount = 0; // Hanya untuk GAGAL VALIDASI
    private $errorRows = [];
    private $currentRow = 1; // Start from 1 (header)
    
    public function model(array $row)
    {
        $this->currentRow++;

        // 🛑 VALIDASI BARIS KOSONG SANGAT KETAT
        $apdData = $this->getSafeRowValue($row, 'nama_apd', 'Nama APD');
        $lokasiData = $this->getSafeRowValue($row, 'lokasi', 'Lokasi');
        $garduData = $this->getSafeRowValue($row, 'gardu_induk', 'Gardu Induk');
        $stok = $this->getSafeRowValue($row, 'stok', 'Stok');
        $tanggalDist = $this->getSafeRowValue($row, 'tanggal_distribusi_yyyy_mm_dd', 'tanggal_distribusi', 'Tanggal Distribusi (YYYY-MM-DD)');
        
        // Jika semua field penting kosong, skip
        $allEmpty = empty(trim($apdData ?? '')) && 
                    empty(trim($lokasiData ?? '')) && 
                    empty(trim($garduData ?? '')) && 
                    empty(trim($stok ?? '')) &&
                    empty(trim($tanggalDist ?? ''));
        
        if ($allEmpty) {
            return null; // Skip baris kosong total
        }

        // 🛡️ Konversi Tanggal
        $tanggalDistribusi = $this->convertDate($this->getSafeRowValue($row, 'tanggal_distribusi_yyyy_mm_dd', 'tanggal_distribusi', 'Tanggal Distribusi (YYYY-MM-DD)'));
        $tanggalPemeriksaan = $this->convertDate($this->getSafeRowValue($row, 'tanggal_pemeriksaan_yyyy_mm_dd', 'tanggal_pemeriksaan', 'Tanggal Pemeriksaan (YYYY-MM-DD)'));
        $tanggalBerakhir = $this->convertDate($this->getSafeRowValue($row, 'tanggal_berakhir_yyyy_mm_dd', 'tanggal_berakhir', 'Tanggal Berakhir (YYYY-MM-DD)'));

        // Ambil Data Referensi
        $apd = Apd::whereRaw('LOWER(TRIM(nama_apd)) = ?', [strtolower(trim($apdData ?? ''))])->first();
        $lokasi = Lokasi::whereRaw('LOWER(TRIM(nama_lokasi)) = ?', [strtolower(trim($lokasiData ?? ''))])->first();
        $gardu = GarduInduk::whereRaw('LOWER(TRIM(nama_gardu_induk)) = ?', [strtolower(trim($garduData ?? ''))])->first();

        // 📋 VALIDASI DETAIL (untuk mencatat atribut yang gagal)
        $failedValidations = []; 

        // 1. Validasi Nama APD
        if (empty(trim($apdData ?? ''))) {
            $failedValidations[] = ['attribute' => 'Nama APD', 'errors' => ["Nama APD wajib diisi"]];
        } elseif (!$apd) {
            $failedValidations[] = ['attribute' => 'Nama APD', 'errors' => ["APD '{$apdData}' tidak ditemukan di database. Cek sheet 'Ref - APD'"]];
        }
        
        // 2. Validasi Lokasi
        if (empty(trim($lokasiData ?? ''))) {
            $failedValidations[] = ['attribute' => 'Lokasi', 'errors' => ["Lokasi wajib diisi"]];
        } elseif (!$lokasi) {
            $failedValidations[] = ['attribute' => 'Lokasi', 'errors' => ["Lokasi '{$lokasiData}' tidak ditemukan. Cek sheet 'Ref - Lokasi'"]];
        }
        
        // 3. Validasi Gardu Induk
        if (empty(trim($garduData ?? ''))) {
            $failedValidations[] = ['attribute' => 'Gardu Induk', 'errors' => ["Gardu Induk wajib diisi"]];
        } elseif (!$gardu) {
            $failedValidations[] = ['attribute' => 'Gardu Induk', 'errors' => ["Gardu Induk '{$garduData}' tidak ditemukan. Cek sheet 'Ref - Gardu Induk'"]];
        }
        
        // 4. Validasi Stok
        $stokTrimmed = trim($stok ?? '');
        if (empty($stokTrimmed)) {
            $failedValidations[] = ['attribute' => 'Stok', 'errors' => ["Stok wajib diisi"]];
        } elseif (!is_numeric($stokTrimmed) || (int)$stokTrimmed < 0) {
            $failedValidations[] = ['attribute' => 'Stok', 'errors' => ["Stok harus berupa angka positif"]];
        }
        
        // 5. Validasi Tanggal Distribusi
        if (!$tanggalDistribusi) {
            $failedValidations[] = ['attribute' => 'Tanggal Distribusi', 'errors' => ["Tanggal Distribusi tidak valid. Format harus YYYY-MM-DD"]];
        }
        
        // ⚠️ Catat GAGAL VALIDASI dan SKIP
        if (!empty($failedValidations)) {
            $this->skippedCount++; 

            // Format error sesuai kebutuhan frontend
            $errorMessages = [];
            foreach ($failedValidations as $validation) {
                $errorMessages = array_merge($errorMessages, $validation['errors']);
            }

            $this->errorRows[] = [
                'row' => $this->currentRow,
                'attribute' => implode(', ', array_column($failedValidations, 'attribute')),
                'errors' => $errorMessages,
                'data' => [ 
                    'nama_apd' => $apdData ?? '-',
                    'lokasi' => $lokasiData ?? '-',
                    'gardu_induk' => $garduData ?? '-',
                    'stok' => $stok ?? '-',
                ]
            ];
            
            Log::warning("Baris {$this->currentRow} gagal validasi: " . implode('; ', $errorMessages));
            return null; // Skip baris ini
        }

        // --- Proses Insert/Update ---

        // Validasi kondisi (defaulting jika tidak valid)
        $kondisiValid = ['Baik', 'Rusak', 'Perlu Diganti'];
        $kondisi = trim($this->getSafeRowValue($row, 'kondisi', 'Kondisi') ?? 'Baik');
        if (!in_array($kondisi, $kondisiValid)) {
            $kondisi = 'Baik';
        }

        // Data untuk insert/update
        $monitoringData = [
            'apd_id' => $apd->id,
            'lokasi_id' => $lokasi->lokasi_id,
            'gardu_induk_id' => $gardu->gardu_induk_id,
            'stok' => (int)($stok ?? 0),
            'tanggal_distribusi' => $tanggalDistribusi,
            'tanggal_pemeriksaan' => $tanggalPemeriksaan,
            'tanggal_berakhir' => $tanggalBerakhir,
            'kondisi' => $kondisi,
            'catatan' => $this->getSafeRowValue($row, 'catatan', 'Catatan') ?? null,
        ];

        // Cek duplikasi (UpdateOrCreate logic)
        $existing = MonitoringApd::where('apd_id', $apd->id)
            ->where('lokasi_id', $lokasi->lokasi_id)
            ->where('gardu_induk_id', $gardu->gardu_induk_id)
            ->where('tanggal_distribusi', $tanggalDistribusi)
            ->first();

        if ($existing) {
            $existing->update($monitoringData);
            $this->updatedCount++;
            return null; 
        }

        // Buat record baru
        $this->importedCount++;
        return new MonitoringApd($monitoringData);
    }

    /**
     * Helper untuk mengambil nilai dari array row dengan aman.
     */
    private function getSafeRowValue(array $row, string ...$keys)
    {
        foreach ($keys as $key) {
            $normalizedKeys = array_map(fn($k) => strtolower(trim(str_replace([' ', '_', '(', ')', '-'], '', $k))), array_keys($row));
            $normalizedSearchKey = strtolower(trim(str_replace([' ', '_', '(', ')', '-'], '', $key)));
            
            $matchedIndex = array_search($normalizedSearchKey, $normalizedKeys);
            
            if ($matchedIndex !== false) {
                $originalKey = array_keys($row)[$matchedIndex];
                $value = $row[$originalKey];
                return is_string($value) ? trim($value) : $value;
            }
        }
        return null;
    }
    
    /**
     * Konversi berbagai format tanggal ke Y-m-d
     */
    private function convertDate($value)
    {
        try {
            if (empty($value)) return null;
            $value = trim($value);
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) return $value; // Y-m-d
            if (is_numeric($value)) return Date::excelToDateTimeObject($value)->format('Y-m-d'); // Excel Serial
            if (is_string($value)) {
                // Handle d/m/Y, d-m-Y, atau d.m.Y
                if (preg_match('/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/', $value, $matches)) {
                    return sprintf('%04d-%02d-%02d', $matches[3], $matches[2], $matches[1]); 
                }
                $timestamp = strtotime($value);
                if ($timestamp !== false) return date('Y-m-d', $timestamp); // Other formats
            }
            return null;
        } catch (\Exception $e) {
            Log::error('Error converting date: ' . $e->getMessage());
            return null;
        }
    }
    
    // --- Konfigurasi dan Getter ---
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
    
    public function getErrorRows()
    {
        return $this->errorRows;
    }

    public function getTotalProcessed()
    {
        return $this->importedCount + $this->updatedCount + $this->skippedCount;
    }
}