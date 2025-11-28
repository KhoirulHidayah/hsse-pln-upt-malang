<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMonitoringApdRequest;
use App\Http\Requests\UpdateMonitoringApdRequest;
use App\Imports\MonitoringApdImport;
use App\Models\MonitoringApd;
use App\Models\Apd;
use App\Models\ApdDetail;
use App\Models\Lokasi;
use App\Models\GarduInduk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

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
        $sortField      = $request->input('sortField', 'tanggal_distribusi');
        $sortDirection  = $request->input('sortDirection', 'desc');

        // 🔎 Query data dengan relasi
        $query = MonitoringApd::with(['apd', 'apdDetail', 'lokasi', 'garduInduk'])
            ->when($search, function ($q) use ($search) {
                $q->where('kondisi', 'like', "%{$search}%")
                    ->orWhere('catatan', 'like', "%{$search}%")
                    ->orWhereHas('apd', fn($a) => $a->where('nama_apd', 'like', "%{$search}%"))
                    ->orWhereHas('apdDetail', fn($d) => $d->where('nama_detail', 'like', "%{$search}%"))
                    ->orWhereHas('lokasi', fn($l) => $l->where('nama_lokasi', 'like', "%{$search}%"))
                    ->orWhereHas('garduInduk', fn($g) => $g->where('nama_gardu_induk', 'like', "%{$search}%"));
            })
            ->when($lokasi_id, fn($q) => $q->where('lokasi_id', $lokasi_id))
            ->when($gardu_induk_id, fn($q) => $q->where('gardu_induk_id', $gardu_induk_id))
            ->when($kondisi, fn($q) => $q->where('kondisi', $kondisi))
            ->orderBy($sortField, $sortDirection);

        // 📄 Pagination + ubah format data
        $monitorings = $query->paginate(10)->through(function ($item) {
            return [
                'monitoring_id'              => $item->monitoring_id,
                'apd_nama'                   => optional($item->apd)->nama_apd ?? '-', 
                'apd_detail_nama'            => optional($item->apdDetail)->nama_detail  ?? '-',
                'apd_detail_gambar'          => $item->apdDetail && $item->apdDetail->gambar
                                                ? asset('storage/' . $item->apdDetail->gambar)
                                                : null,
                'lokasi_nama'                => optional($item->lokasi)->nama_lokasi ?? '-',
                'gardu_nama'                 => optional($item->garduInduk)->nama_gardu_induk ?? '-',
                'stok'                       => $item->stok,
                'tanggal_distribusi'         => $item->tanggal_distribusi,
                'tanggal_pemeriksaan'        => $item->tanggal_pemeriksaan,
                'tanggal_berakhir'           => $item->tanggal_berakhir,
                'kondisi'                    => $item->kondisi,
                'status_notifikasi_otomatis' => $item->status_notifikasi_otomatis,
            ];
        })->appends($request->all());

        // 📋 Data dropdown
        $lokasiList = Lokasi::select('lokasi_id', 'nama_lokasi')->get();
        $garduList  = GarduInduk::select('gardu_induk_id', 'nama_gardu_induk')->get();

        // 📤 Kirim data ke React (Inertia)
        return Inertia::render('MonitoringApd/Index', [
            'monitorings' => $monitorings,
            'lokasiList'  => $lokasiList,
            'garduList'   => $garduList,
            'filters'     => [
                'search'         => $search,
                'lokasi_id'      => $lokasi_id,
                'gardu_induk_id' => $gardu_induk_id,
                'kondisi'        => $kondisi,
                'sortField'      => $sortField,
                'sortDirection'  => $sortDirection,
            ],
        ]);
    }

    /**
     * 🆕 Form tambah monitoring.
     */
    public function create()
    {
        return Inertia::render('MonitoringApd/Create', [
            'apds'        => Apd::select('id', 'nama_apd')->get(),
            'apdDetails'  => ApdDetail::select('id', 'nama_detail')->get(),
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
        $monitoring = MonitoringApd::with(['apd', 'apdDetail', 'lokasi', 'garduInduk'])
            ->findOrFail($id);

        return Inertia::render('MonitoringApd/Edit', [
            'monitoring'   => $monitoring,
            'apds'         => Apd::select('id', 'nama_apd')->get(),
            'apdDetails'   => ApdDetail::select('id', 'nama_detail')->get(),
            'lokasiList'   => Lokasi::select('lokasi_id', 'nama_lokasi')->get(),
            'garduList'   => GarduInduk::select('gardu_induk_id', 'lokasi_id', 'nama_gardu_induk')->get(),
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

    public function show($id)
    {
        $monitoring = MonitoringApd::with(['apd', 'apdDetail', 'lokasi', 'garduInduk'])
            ->findOrFail($id);

        return Inertia::render('MonitoringApd/Show', [
            'monitoring' => $monitoring,
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
     * 📦 Import file Excel.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:2048',
        ], [
            'file.required' => 'File Excel wajib dipilih',
            'file.mimes' => 'File harus berformat .xlsx atau .xls',
            'file.max' => 'Ukuran file maksimal 2MB',
        ]);

        try {
            $import = new MonitoringApdImport;
            
            Excel::import($import, $request->file('file'));
            
            $imported = $import->getImportedCount();
            $updated = $import->getUpdatedCount();
            $skipped = $import->getSkippedCount();
            $errorRows = $import->getErrorRows();
            
            // Prepare data untuk session
            $importResults = [
                'imported' => $imported,
                'updated' => $updated,
                'skipped' => $skipped,
                'errors' => $errorRows,
                'total_processed' => $imported + $updated + $skipped,
            ];
            
            // Build success message
            $messages = [];
            
            if ($imported > 0) {
                $messages[] = "✅ {$imported} data baru berhasil ditambahkan";
            }
            
            if ($updated > 0) {
                $messages[] = "🔄 {$updated} data berhasil diperbarui";
            }
            
            if ($skipped > 0) {
                $messages[] = "⚠️ {$skipped} baris gagal diimport";
            }
            
            // Jika ada data yang berhasil (imported atau updated)
            if ($imported > 0 || $updated > 0) {
                $successMessage = implode('. ', $messages);
                
                if (!empty($errorRows)) {
                    // Ada yang berhasil tapi juga ada error
                    return redirect()->route('monitoring-apd.index')
                        ->with('success', $successMessage)
                        ->with('import_results', $importResults)
                        ->with('show_error_details', true);
                }
                
                // Semua berhasil
                return redirect()->route('monitoring-apd.index')
                    ->with('success', $successMessage)
                    ->with('import_results', $importResults);
            }
            
            // Tidak ada yang berhasil - semua error
            return redirect()->route('monitoring-apd.index')
                ->with('error', 'Tidak ada data yang berhasil diimport. Silakan periksa detail error di bawah.')
                ->with('import_results', $importResults)
                ->with('show_error_details', true);
            
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errorMessages = [];
            
            foreach ($failures as $failure) {
                $errorMessages[] = [
                    'row' => $failure->row(),
                    'errors' => $failure->errors(),
                    'data' => $failure->values()
                ];
            }
            
            return redirect()->route('monitoring-apd.index')
                ->with('error', 'Import gagal dengan error validasi')
                ->with('import_results', [
                    'imported' => 0,
                    'updated' => 0,
                    'skipped' => count($errorMessages),
                    'errors' => $errorMessages,
                ])
                ->with('show_error_details', true);
                
        } catch (\Exception $e) {
            Log::error('Import Error: ' . $e->getMessage());
            Log::error('Stack Trace: ' . $e->getTraceAsString());
            
            return redirect()->route('monitoring-apd.index')
                ->with('error', 'Import gagal: ' . $e->getMessage());
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
        $apds = Apd::select('id', 'nama_apd')->get();
        $apdDetails = ApdDetail::select('id', 'nama_detail')->get();
        $lokasis = Lokasi::select('lokasi_id', 'nama_lokasi')->get();
        $gardus = GarduInduk::select('gardu_induk_id', 'nama_gardu_induk')->get();

        $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
        
        // Sheet 1: Template Input
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Import');
        
        // Header dengan instruksi
        $headers = [
            'Nama APD',
            'Detail APD',
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
        
        // Styling header
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11
            ],
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4']
            ],
            'alignment' => [
                'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                    'color' => ['rgb' => '000000']
                ]
            ]
        ];
        
        $sheet->getStyle('A1:J1')->applyFromArray($headerStyle);
        
        // Set column widths
        $sheet->getColumnDimension('A')->setWidth(25);
        $sheet->getColumnDimension('B')->setWidth(30);
        $sheet->getColumnDimension('C')->setWidth(20);
        $sheet->getColumnDimension('D')->setWidth(25);
        $sheet->getColumnDimension('E')->setWidth(10);
        $sheet->getColumnDimension('F')->setWidth(25);
        $sheet->getColumnDimension('G')->setWidth(25);
        $sheet->getColumnDimension('H')->setWidth(25);
        $sheet->getColumnDimension('I')->setWidth(15);
        $sheet->getColumnDimension('J')->setWidth(30);
        
        // Contoh data (row 2)
        $exampleData = [
            'Helm Pengaman',
            'Helm Safety Warna Putih',
            'ULTG Malang',
            'Kantor ULTG Malang',
            '10',
            '2025-01-15',
            '2025-02-01',
            '2026-01-15',
            'Baik',
            'Kondisi baru dari vendor'
        ];
        
        $sheet->fromArray([$exampleData], null, 'A2');
        
        // Styling contoh data
        $exampleStyle = [
            'fill' => [
                'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'E7E6E6']
            ],
            'font' => ['italic' => true, 'color' => ['rgb' => '7F7F7F']]
        ];
        $sheet->getStyle('A2:J2')->applyFromArray($exampleStyle);
        
        // Freeze pane
        $sheet->freezePane('A2');
        
        // Sheet 2: Referensi APD
        $sheetApd = $spreadsheet->createSheet();
        $sheetApd->setTitle('Ref - APD');
        $sheetApd->setCellValue('A1', 'Daftar APD');
        $sheetApd->getStyle('A1')->applyFromArray($headerStyle);
        
        $row = 2;
        foreach ($apds as $apd) {
            $sheetApd->setCellValue('A' . $row, $apd->nama_apd);
            $row++;
        }
        $sheetApd->getColumnDimension('A')->setWidth(30);
        
        // Sheet 3: Referensi APD Detail
        $sheetDetail = $spreadsheet->createSheet();
        $sheetDetail->setTitle('Ref - Detail APD');
        $sheetDetail->setCellValue('A1', 'Daftar Detail APD');
        $sheetDetail->getStyle('A1')->applyFromArray($headerStyle);
        
        $row = 2;
        foreach ($apdDetails as $detail) {
            $sheetDetail->setCellValue('A' . $row, $detail->nama_detail);
            $row++;
        }
        $sheetDetail->getColumnDimension('A')->setWidth(35);
        
        // Sheet 4: Referensi Lokasi
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
        
        // Sheet 5: Referensi Gardu Induk
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
        
        // Sheet 6: Panduan
        $sheetPanduan = $spreadsheet->createSheet();
        $sheetPanduan->setTitle('Panduan');
        
        // bagian panduan di method template() controller:
        $panduan = [
            ['PANDUAN IMPORT DATA MONITORING APD'],
            [''],
            ['1. FORMAT DATA:'],
            ['   - Nama APD: Pilih dari sheet "Ref - APD"'],
            ['   - Detail APD: Pilih dari sheet "Ref - Detail APD"'],
            ['   - Lokasi: Pilih dari sheet "Ref - Lokasi"'],
            ['   - Gardu Induk: Pilih dari sheet "Ref - Gardu Induk"'],
            ['   - Stok: Angka (contoh: 10, 25)'],
            ['   - Tanggal: Format YYYY-MM-DD (contoh: 2025-01-15)'],
            ['   - Kondisi: Pilih salah satu: Baik / Rusak / Perlu Diganti'],
            [''],
            ['2. ATURAN PENTING:'],
            ['   - Semua field wajib diisi kecuali Catatan'],
            ['   - Nama APD, Detail APD, Lokasi, dan Gardu Induk harus sesuai dengan data yang tersedia'],
            ['   - Format tanggal harus YYYY-MM-DD'],
            ['   - Stok harus berupa angka positif'],
            [''],
            ['3. PENCEGAHAN DUPLIKASI:'],
            ['   - Sistem akan otomatis mendeteksi data duplikat berdasarkan kombinasi:'],
            ['     * Detail APD + Lokasi + Gardu Induk + Tanggal Distribusi'],
            ['   - Jika ditemukan duplikat, data yang LAMA akan DIPERBARUI dengan data yang BARU'],
            ['   - Data baru akan ditambahkan jika kombinasi tersebut belum ada'],
            [''],
            ['4. CONTOH DATA:'],
            ['   Lihat baris ke-2 pada sheet "Template Import" untuk contoh pengisian'],
            [''],
            ['5. LANGKAH IMPORT:'],
            ['   - Isi data mulai dari baris ke-3 dan seterusnya pada sheet "Template Import"'],
            ['   - HAPUS baris contoh (baris 2) sebelum import untuk menghindari error'],
            ['   - Simpan file'],
            ['   - Upload file melalui tombol "Import Excel" di halaman Monitoring APD'],
            ['   - Sistem akan menampilkan laporan detail hasil import'],
            [''],
            ['6. LAPORAN IMPORT:'],
            ['   Setelah import, Anda akan melihat:'],
            ['   - Jumlah data baru yang ditambahkan'],
            ['   - Jumlah data yang diperbarui (duplikat)'],
            ['   - Jumlah baris yang dilewati dengan detail error'],
            ['   - Nomor baris yang gagal beserta alasannya'],
            [''],
            ['7. TIPS:'],
            ['   - Periksa sheet referensi untuk memastikan nama yang digunakan sudah benar'],
            ['   - Gunakan copy-paste dari sheet referensi untuk menghindari typo'],
            ['   - Pastikan tidak ada baris kosong di tengah data'],
            ['   - Jika ada error, periksa nomor baris dan perbaiki data sesuai pesan error'],
            ['   - Untuk update data yang sudah ada, gunakan kombinasi yang sama'],
        ];
        
        $sheetPanduan->fromArray($panduan, null, 'A1');
        
        // Styling panduan
        $sheetPanduan->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 14, 'color' => ['rgb' => '4472C4']],
        ]);
        
        $sheetPanduan->getStyle('A3')->applyFromArray(['font' => ['bold' => true]]);
        $sheetPanduan->getStyle('A12')->applyFromArray(['font' => ['bold' => true]]);
        $sheetPanduan->getStyle('A18')->applyFromArray(['font' => ['bold' => true]]);
        $sheetPanduan->getStyle('A24')->applyFromArray(['font' => ['bold' => true]]);
        $sheetPanduan->getStyle('A29')->applyFromArray(['font' => ['bold' => true]]);
        
        $sheetPanduan->getColumnDimension('A')->setWidth(80);
        
        // Set active sheet kembali ke template
        $spreadsheet->setActiveSheetIndex(0);
        
        // Save file
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save($path);

        return response()->download($path, $filename)->deleteFileAfterSend(false);
    }
}
