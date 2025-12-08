<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMonitoringApdRequest;
use App\Http\Requests\UpdateMonitoringApdRequest;
use App\Imports\MonitoringApdImport;
use App\Models\MonitoringApd;
use App\Models\Apd;
use App\Models\Lokasi;
use App\Models\GarduInduk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class MonitoringApdController extends Controller
{
    /**
     * 📋 Tampilkan daftar Monitoring APD (tanpa user).
     */
    public function index(Request $request)
    {
        // 🔍 Ambil parameter filter & sorting dari React
        $search         = $request->input('search');
        $lokasi_id      = $request->input('lokasi_id');
        $gardu_induk_id = $request->input('gardu_induk_id');
        $kondisi        = $request->input('kondisi');
        $status_notifikasi = $request->input('status_notifikasi');
        $sortField      = $request->input('sortField', 'tanggal_distribusi');
        $sortDirection  = $request->input('sortDirection', 'desc');

        // 🔎 Query data dengan relasi (TANPA apdDetail)
        $query = MonitoringApd::with(['apd', 'lokasi', 'garduInduk'])
            ->when($search, function ($q) use ($search) {
                $q->where('kondisi', 'like', "%{$search}%")
                    ->orWhere('catatan', 'like', "%{$search}%")
                    ->orWhere('stok', 'like', "%{$search}%")
                    ->orWhereHas('apd', fn($a) => $a->where('nama_apd', 'like', "%{$search}%"))
                    ->orWhereHas('lokasi', fn($l) => $l->where('nama_lokasi', 'like', "%{$search}%"))
                    ->orWhereHas('garduInduk', fn($g) => $g->where('nama_gardu_induk', 'like', "%{$search}%"));
            })
            ->when($lokasi_id, fn($q) => $q->where('lokasi_id', $lokasi_id))
            ->when($gardu_induk_id, fn($q) => $q->where('gardu_induk_id', $gardu_induk_id))
            ->when($kondisi, fn($q) => $q->where('kondisi', $kondisi))
            ->when($status_notifikasi, fn($q) => $q->where('status_notifikasi', $status_notifikasi))
            ->orderBy($sortField, $sortDirection);

        // 📄 Pagination + ubah format data
        $monitorings = $query->paginate(10)->through(function ($item) {
            return [
                'monitoring_id'              => $item->monitoring_id,
                'apd_id'                     => $item->apd_id,
                'apd_nama'                   => optional($item->apd)->nama_apd ?? '-',
                'apd_kode'                   => optional($item->apd)->kode_apd ?? '-',
                'apd_gambar'                 => $item->apd && $item->apd->gambar
                                                ? asset('storage/' . $item->apd->gambar)
                                                : null,
                'lokasi_id'                  => $item->lokasi_id,
                'lokasi_nama'                => optional($item->lokasi)->nama_lokasi ?? '-',
                'gardu_induk_id'             => $item->gardu_induk_id,
                'gardu_nama'                 => optional($item->garduInduk)->nama_gardu_induk ?? '-',
                'stok'                       => $item->stok,
                'tanggal_distribusi'         => $item->tanggal_distribusi,
                'tanggal_pemeriksaan'        => $item->tanggal_pemeriksaan,
                'tanggal_berakhir'           => $item->tanggal_berakhir,
                'kondisi'                    => $item->kondisi,
                'status_notifikasi'          => $item->status_notifikasi,
                'status_notifikasi_otomatis' => $item->status_notifikasi_otomatis,
                'catatan'                    => $item->catatan,
            ];
        })->appends($request->all());

        // 📋 Data dropdown
        $lokasiList = Lokasi::select('lokasi_id', 'nama_lokasi')->get();
        $garduList  = GarduInduk::select('gardu_induk_id', 'nama_gardu_induk', 'lokasi_id')->get();

        // 📤 Kirim data ke React (Inertia)
        return Inertia::render('MonitoringApd/Index', [
            'monitorings' => $monitorings,
            'lokasiList'  => $lokasiList,
            'garduList'   => $garduList,
            'filters'     => [
                'search'            => $search,
                'lokasi_id'         => $lokasi_id,
                'gardu_induk_id'    => $gardu_induk_id,
                'kondisi'           => $kondisi,
                'status_notifikasi' => $status_notifikasi,
                'sortField'         => $sortField,
                'sortDirection'     => $sortDirection,
            ],
        ]);
    }

    /**
     * 🆕 Form tambah monitoring.
     */
    public function create()
    {
        return Inertia::render('MonitoringApd/Create', [
            'apds'        => Apd::select('id', 'nama_apd', 'kode_apd', 'gambar')->get(),
            'lokasiList'  => Lokasi::select('lokasi_id', 'nama_lokasi')->get(),
            'garduList'   => GarduInduk::select('gardu_induk_id', 'lokasi_id', 'nama_gardu_induk')->get(),
        ]);
    }

    /**
     * 💾 Simpan data baru.
     */
    public function store(StoreMonitoringApdRequest $request)
    {
        $data = $request->validated();
        MonitoringApd::create($data);

        return redirect()->route('monitoring-apd.index')
            ->with('success', 'Data monitoring APD berhasil ditambahkan.');
    }

    /**
     * ✏️ Form edit monitoring.
     */
    public function edit($id)
    {
        $monitoring = MonitoringApd::with(['apd', 'lokasi', 'garduInduk'])
            ->findOrFail($id);

        return Inertia::render('MonitoringApd/Edit', [
            'monitoring'   => $monitoring,
            'apds'         => Apd::select('id', 'nama_apd', 'kode_apd', 'gambar')->get(),
            'lokasiList'   => Lokasi::select('lokasi_id', 'nama_lokasi')->get(),
            'garduList'    => GarduInduk::select('gardu_induk_id', 'lokasi_id', 'nama_gardu_induk')->get(),
        ]);
    }

    /**
     * 🔄 Update data monitoring.
     */
    public function update(UpdateMonitoringApdRequest $request, $id)
    {
        $monitoring = MonitoringApd::findOrFail($id);
        $monitoring->update($request->validated());

        return redirect()->route('monitoring-apd.index')
            ->with('success', 'Data Monitoring APD berhasil diperbarui.');
    }

    /**
     * 👁️ Detail monitoring APD
     */
    public function show($id)
    {
        $monitoring = MonitoringApd::with(['apd', 'lokasi', 'garduInduk', 'user'])
            ->findOrFail($id);

        return Inertia::render('MonitoringApd/Show', [
            'monitoring' => [
                'monitoring_id'              => $monitoring->monitoring_id,
                'apd'                        => $monitoring->apd,
                'lokasi'                     => $monitoring->lokasi,
                'gardu_induk'                => $monitoring->garduInduk,
                'user'                       => $monitoring->user,
                'stok'                       => $monitoring->stok,
                'tanggal_distribusi'         => $monitoring->tanggal_distribusi,
                'tanggal_pemeriksaan'        => $monitoring->tanggal_pemeriksaan,
                'tanggal_berakhir'           => $monitoring->tanggal_berakhir,
                'kondisi'                    => $monitoring->kondisi,
                'status_notifikasi'          => $monitoring->status_notifikasi,
                'status_notifikasi_otomatis' => $monitoring->status_notifikasi_otomatis,
                'catatan'                    => $monitoring->catatan,
                'created_at'                 => $monitoring->created_at,
                'updated_at'                 => $monitoring->updated_at,
            ],
        ]);
    }

    /**
     * 🗑️ Hapus data monitoring.
     */
    public function destroy($id)
    {
        MonitoringApd::findOrFail($id)->delete();

        return redirect()->back()->with('success', 'Data Monitoring APD berhasil dihapus.');
    }

    /**
     * Import data Monitoring APD dari file Excel.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv'],
        ]);

        $file = $request->file('file');
        $import = new MonitoringApdImport();

        try {
            Excel::import($import, $file);

            $imported = $import->getImportedCount();
            $updated  = $import->getUpdatedCount();
            $skipped  = $import->getSkippedCount();
            $errors   = $import->getErrorRows();
            $totalProcessed = $imported + $updated;

            // Pesan sukses utama
            $message = "Import selesai. Berhasil diproses: **{$totalProcessed} data** (Ditambahkan: {$imported}, Diperbarui: {$updated}).";
            
            if ($skipped > 0) {
                // Menambahkan informasi baris yang diskip (kosong/gagal validasi)
                $message .= " Ditemukan **{$skipped} baris** yang dilewati karena gagal validasi atau kosong.";
            }

            $flashData = [
                'success' => $message,
                // Mengirim array error rows ke frontend
                'importErrors' => empty($errors) ? [] : $errors,
                // Menambahkan hitungan error agar komponen React tahu ada pesan peringatan
                'errorCount' => count($errors)
            ];

            return redirect()->route('monitoring-apd.index')->with($flashData);

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            Log::error("Validation Excel Error: " . $e->getMessage());
            return redirect()->back()->with('error', 'Import Gagal Total: Terjadi kesalahan validasi format file.');
            
        } catch (\Throwable $e) {
            Log::error("Import Fatal Error: " . $e->getMessage());
            return redirect()->back()->with('error', 'Import Gagal Total: File tidak dapat diproses atau terjadi kesalahan fatal. Cek log server.');
        }
    }

    /**
     * 📋 Unduh template Excel untuk import.
     */
    public function template()
    {
        $filename = 'template_monitoring_apd.xlsx';
        $path = storage_path('app/public/' . $filename);

        // Data untuk dropdown helper
        $apds = Apd::select('id', 'nama_apd', 'kode_apd')->get();
        $lokasis = Lokasi::select('lokasi_id', 'nama_lokasi')->get();
        $gardus = GarduInduk::select('gardu_induk_id', 'nama_gardu_induk')->get();

        $spreadsheet = new Spreadsheet();
        
        // Sheet 1: Template Input
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Import');
        
        // 1. Header Kolom
        // ==========================
        $headers = [
            'Nama APD',
            'Lokasi',
            'Gardu Induk',
            'Stok',
            'Tanggal Distribusi (YYYY-MM-DD)',
            'Tanggal Pemeriksaan (YYYY-MM-DD)',
            'Tanggal Berakhir (YYYY-MM-DD)',
            'Kondisi',
            'Catatan'
        ];
        
        $sheet->fromArray([$headers], null, 'A1');
        
        // Styling header... (tetap sama)
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000']
                ]
            ]
        ];
        
        $sheet->getStyle('A1:I1')->applyFromArray($headerStyle);
        
        // Set column widths... (tetap sama)
        $sheet->getColumnDimension('A')->setWidth(35);
        $sheet->getColumnDimension('B')->setWidth(20);
        $sheet->getColumnDimension('C')->setWidth(25);
        $sheet->getColumnDimension('D')->setWidth(10);
        $sheet->getColumnDimension('E')->setWidth(25);
        $sheet->getColumnDimension('F')->setWidth(25);
        $sheet->getColumnDimension('G')->setWidth(25);
        $sheet->getColumnDimension('H')->setWidth(15);
        $sheet->getColumnDimension('I')->setWidth(30);
        
        // 2. Contoh Data (Baris 2) - BISA LANGSUNG DIISI/DI-IMPORT
        // ==========================
        $exampleData = [
            'Helm Safety Warna Putih (Manajemen, Engineer, dan Visitor)',
            'ULTG Malang',
            'Kantor ULTG Malang',
            '10',
            '2025-01-15',
            '2025-02-01',
            '2029-01-15',
            'Baik',
            'Kondisi baru dari vendor'
        ];
        
        $sheet->fromArray([$exampleData], null, 'A2');
        
        // Freeze pane
        $sheet->freezePane('A2');

        // 3. Keterangan/Panduan di Sheet Template Import
        // ===============================================
        $keteranganRow = 20; // <--- BARIS KETERANGAN DIMULAI JAUH LEBIH BAWAH (BARIS 20)

        // Judul Keterangan
        $sheet->setCellValue('A' . $keteranganRow, 'KETENTUAN PENGISIAN DATA:');
        $sheet->mergeCells('A' . $keteranganRow . ':I' . $keteranganRow);
        $sheet->getStyle('A' . $keteranganRow)->getFont()->setBold(true);
        $keteranganRow++; // Naik 1 baris
        
        $keterangan = [
            'Nama APD: Wajib diisi. Harus PERSIS sesuai dengan data di sheet "Ref - APD".',
            'Lokasi: Wajib diisi. Harus PERSIS sesuai dengan data di sheet "Ref - Lokasi".',
            'Gardu Induk: Wajib diisi. Harus PERSIS sesuai dengan data di sheet "Ref - Gardu Induk".',
            'Stok: Wajib diisi, harus berupa angka positif (contoh: 1, 10).',
            'Tanggal Distribusi, Pemeriksaan, Berakhir: Wajib diisi. Format tanggal harus YYYY-MM-DD (contoh: 2025-01-15).',
            'Kondisi: Wajib diisi. Pilih salah satu: Baik / Rusak / Perlu Diganti.',
            'Catatan: Tidak wajib diisi. Maksimal 255 karakter.',
            '',
            'PENCEGAHAN DUPLIKASI:',
            'Sistem akan mendeteksi duplikat berdasarkan kombinasi: APD + Lokasi + Gardu Induk + Tanggal Distribusi.',
            'Jika duplikat terdeteksi, data yang LAMA akan DIPERBARUI (Update) dengan data yang BARU.',
        ];

        foreach ($keterangan as $k) {
            if (!empty($k)) {
                
                // Styling khusus untuk sub-judul 'PENCEGAHAN DUPLIKASI'
                if (strpos($k, ':') !== false && !str_starts_with(trim($k), 'Nama APD') && !str_starts_with(trim($k), 'Lokasi') && !str_starts_with(trim($k), 'Gardu Induk') && !str_starts_with(trim($k), 'Stok') && !str_starts_with(trim($k), 'Tanggal Distribusi') && !str_starts_with(trim($k), 'Kondisi') && !str_starts_with(trim($k), 'Catatan')) {
                    $sheet->setCellValue('A' . $keteranganRow, $k); // Tanpa bullet
                    $sheet->getStyle('A' . $keteranganRow)->getFont()->setBold(true)->setSize(11)->getColor()->setRGB('4472C4');
                } else {
                    $sheet->setCellValue('A' . $keteranganRow, '• ' . $k);
                    $sheet->getStyle('A' . $keteranganRow)->getFont()->setSize(10);
                }

            }
            $sheet->mergeCells('A' . $keteranganRow . ':I' . $keteranganRow);
            $sheet->getStyle('A' . $keteranganRow)->getAlignment()->setWrapText(true);
            $keteranganRow++;
        }
        
        // 4. Sheet Referensi 
        // ===============================================

        // Sheet 2: Referensi APD
        $sheetApd = $spreadsheet->createSheet();
        $sheetApd->setTitle('Ref - APD');
        $sheetApd->setCellValue('A1', 'Kode APD');
        $sheetApd->setCellValue('B1', 'Nama APD');
        $sheetApd->getStyle('A1:B1')->applyFromArray($headerStyle);
        
        $row = 2;
        foreach ($apds as $apd) {
            $sheetApd->setCellValue('A' . $row, $apd->kode_apd);
            $sheetApd->setCellValue('B' . $row, $apd->nama_apd);
            $row++;
        }
        $sheetApd->getColumnDimension('A')->setWidth(20);
        $sheetApd->getColumnDimension('B')->setWidth(50);
        
        // Sheet 3: Referensi Lokasi
        $sheetLokasi = $spreadsheet->createSheet();
        $sheetLokasi->setTitle('Ref - Lokasi');
        $sheetLokasi->setCellValue('A1', 'Daftar Lokasi');
        $sheetLokasi->getStyle('A1')->applyFromArray($headerStyle);
        
        $row = 2;
        foreach ($lokasis as $lokasi) {
            $sheetLokasi->setCellValue('A' . $row, $lokasi->nama_lokasi);
            $row++;
        }
        $sheetLokasi->getColumnDimension('A')->setWidth(25);
        
        // Sheet 4: Referensi Gardu Induk
        $sheetGardu = $spreadsheet->createSheet();
        $sheetGardu->setTitle('Ref - Gardu Induk');
        $sheetGardu->setCellValue('A1', 'Daftar Gardu Induk');
        $sheetGardu->getStyle('A1')->applyFromArray($headerStyle);
        
        $row = 2;
        foreach ($gardus as $gardu) {
            $sheetGardu->setCellValue('A' . $row, $gardu->nama_gardu_induk);
            $row++;
        }
        $sheetGardu->getColumnDimension('A')->setWidth(30);

        // Set active sheet kembali ke template
        $spreadsheet->setActiveSheetIndex(0);
        
        // Save file
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save($path);

        return response()->download($path, $filename)->deleteFileAfterSend(false);
    }
}