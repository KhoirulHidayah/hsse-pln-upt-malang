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
use Carbon\Carbon;

class MonitoringApdController extends Controller
{
    /**
     * 📋 Tampilkan daftar Monitoring APD
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

        // 🔎 Query data dengan relasi
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
            ->when($kondisi, fn($q) => $q->where('kondisi', $kondisi));

        // ✅ PERBAIKAN: Filter status notifikasi DINAMIS
        if ($status_notifikasi) {
            if ($status_notifikasi === 'Expired') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) < 30');
            } elseif ($status_notifikasi === 'Warning') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90');
            } elseif ($status_notifikasi === 'Active') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) > 90');
            }
        }

        // Sorting
        $query->orderBy($sortField, $sortDirection);

        // 🔄 Pagination + format data
        $monitorings = $query->paginate(10)->through(function ($item) {
            // ✅ Hitung status dinamis
            $today = Carbon::now()->startOfDay();
            $tanggalBerakhir = $item->tanggal_berakhir 
                ? Carbon::parse($item->tanggal_berakhir)->startOfDay() 
                : null;
            
            $selisih = $tanggalBerakhir 
                ? (int) $today->diffInDays($tanggalBerakhir, false) 
                : null;
            
            $statusNotifikasi = 'Active';
            if ($selisih !== null) {
                if ($selisih < 30) {
                    $statusNotifikasi = 'Expired';
                } elseif ($selisih >= 30 && $selisih <= 90) {
                    $statusNotifikasi = 'Warning';
                } else {
                    $statusNotifikasi = 'Active';
                }
            }

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
                'tanggal_distribusi'         => optional($item->tanggal_distribusi)->format('Y-m-d') ?? '-',
                'tanggal_pemeriksaan'        => optional($item->tanggal_pemeriksaan)->format('Y-m-d') ?? '-',
                'tanggal_berakhir'           => optional($item->tanggal_berakhir)->format('Y-m-d') ?? '-',
                'kondisi'                    => $item->kondisi,
                'status_notifikasi_otomatis' => $statusNotifikasi, // ✅ Dinamis
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
            'apds'        => Apd::select('id', 'nama_apd', 'kode_apd','masa_penggunaan', 'gambar', 'standar')->get(),
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
            'monitoring'   => [
                'monitoring_id'         => $monitoring->monitoring_id,
                'apd_id'                => $monitoring->apd_id,
                'lokasi_id'             => $monitoring->lokasi_id,
                'gardu_induk_id'        => $monitoring->gardu_induk_id,
                'stok'                  => $monitoring->stok,
                // ✅ Format tanggal ke YYYY-MM-DD untuk input type="date"
                'tanggal_distribusi'    => $monitoring->tanggal_distribusi 
                                        ? $monitoring->tanggal_distribusi->format('Y-m-d') 
                                        : '',
                'tanggal_pemeriksaan'   => $monitoring->tanggal_pemeriksaan 
                                        ? $monitoring->tanggal_pemeriksaan->format('Y-m-d') 
                                        : '',
                'tanggal_berakhir'      => $monitoring->tanggal_berakhir 
                                        ? $monitoring->tanggal_berakhir->format('Y-m-d') 
                                        : '',
                'kondisi'               => $monitoring->kondisi,
                'catatan'               => $monitoring->catatan,
            ],
            'apds'         => Apd::select('id', 'nama_apd', 'kode_apd', 'gambar', 'masa_penggunaan', 'standar')->get(),
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

            $message = "Import selesai. Berhasil diproses: **{$totalProcessed} data** (Ditambahkan: {$imported}, Diperbarui: {$updated}).";
            
            if ($skipped > 0) {
                $message .= " Ditemukan **{$skipped} baris** yang dilewati karena gagal validasi atau kosong.";
            }

            $flashData = [
                'success' => $message,
                'importErrors' => empty($errors) ? [] : $errors,
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

        $apds = Apd::select('id', 'nama_apd', 'kode_apd')->get();
        $lokasis = Lokasi::select('lokasi_id', 'nama_lokasi')->get();
        $gardus = GarduInduk::select('gardu_induk_id', 'nama_gardu_induk')->get();

        $spreadsheet = new Spreadsheet();
        
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Import');
        
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
        
        $sheet->getColumnDimension('A')->setWidth(35);
        $sheet->getColumnDimension('B')->setWidth(20);
        $sheet->getColumnDimension('C')->setWidth(25);
        $sheet->getColumnDimension('D')->setWidth(10);
        $sheet->getColumnDimension('E')->setWidth(25);
        $sheet->getColumnDimension('F')->setWidth(25);
        $sheet->getColumnDimension('G')->setWidth(25);
        $sheet->getColumnDimension('H')->setWidth(15);
        $sheet->getColumnDimension('I')->setWidth(30);
        
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
        $sheet->freezePane('A2');

        $keteranganRow = 20;
        $sheet->setCellValue('A' . $keteranganRow, 'KETENTUAN PENGISIAN DATA:');
        $sheet->mergeCells('A' . $keteranganRow . ':I' . $keteranganRow);
        $sheet->getStyle('A' . $keteranganRow)->getFont()->setBold(true);
        $keteranganRow++;
        
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
                if (strpos($k, ':') !== false && !str_starts_with(trim($k), 'Nama APD') && !str_starts_with(trim($k), 'Lokasi') && !str_starts_with(trim($k), 'Gardu Induk') && !str_starts_with(trim($k), 'Stok') && !str_starts_with(trim($k), 'Tanggal Distribusi') && !str_starts_with(trim($k), 'Kondisi') && !str_starts_with(trim($k), 'Catatan')) {
                    $sheet->setCellValue('A' . $keteranganRow, $k);
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

        $spreadsheet->setActiveSheetIndex(0);
        
        $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
        $writer->save($path);

        return response()->download($path, $filename)->deleteFileAfterSend(false);
    }

        
    /**
     * 📊 Tampilkan halaman laporan masa pakai APD
     */
    public function laporan(Request $request)
    {
        // 🔍 Ambil parameter filter
        $lokasi_id = $request->input('lokasi_id');
        $gardu_induk_id = $request->input('gardu_induk_id');
        $kondisi = $request->input('kondisi');
        $status_notifikasi = $request->input('status_notifikasi');

        // 📊 Query data
        $query = MonitoringApd::with(['apd', 'lokasi', 'garduInduk'])
            ->when($lokasi_id, fn($q) => $q->where('lokasi_id', $lokasi_id))
            ->when($gardu_induk_id, fn($q) => $q->where('gardu_induk_id', $gardu_induk_id))
            ->when($kondisi, fn($q) => $q->where('kondisi', $kondisi));

        // Filter status notifikasi DINAMIS
        if ($status_notifikasi) {
            if ($status_notifikasi === 'Expired') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) < 30');
            } elseif ($status_notifikasi === 'Warning') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90');
            } elseif ($status_notifikasi === 'Active') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) > 90');
            }
        }

        $query->orderBy('tanggal_berakhir', 'asc');

        // 📋 Format data untuk laporan
        $monitorings = $query->get()->map(function ($item) {
            $today = Carbon::now()->startOfDay();
            $tanggalBerakhir = $item->tanggal_berakhir 
                ? Carbon::parse($item->tanggal_berakhir)->startOfDay() 
                : null;
            
            $selisih = $tanggalBerakhir 
                ? (int) $today->diffInDays($tanggalBerakhir, false) 
                : null;
            
            $statusNotifikasi = 'Active';
            if ($selisih !== null) {
                if ($selisih < 30) {
                    $statusNotifikasi = 'Expired';
                } elseif ($selisih >= 30 && $selisih <= 90) {
                    $statusNotifikasi = 'Warning';
                } else {
                    $statusNotifikasi = 'Active';
                }
            }

            // Hitung masa pakai (dari distribusi ke berakhir)
            $masaPakai = null;
            if ($item->tanggal_distribusi && $item->tanggal_berakhir) {
                $distribusi = Carbon::parse($item->tanggal_distribusi);
                $berakhir = Carbon::parse($item->tanggal_berakhir);
                $masaPakai = $distribusi->diffInDays($berakhir);
            }

            // Hitung sisa masa pakai
            $sisaMasaPakai = $selisih;

            return [
                'monitoring_id' => $item->monitoring_id,
                'apd_nama' => optional($item->apd)->nama_apd ?? '-',
                'apd_kode' => optional($item->apd)->kode_apd ?? '-',
                'lokasi_nama' => optional($item->lokasi)->nama_lokasi ?? '-',
                'gardu_nama' => optional($item->garduInduk)->nama_gardu_induk ?? '-',
                'stok' => $item->stok,
                'tanggal_distribusi' => optional($item->tanggal_distribusi)->format('Y-m-d') ?? '-',
                'tanggal_pemeriksaan' => optional($item->tanggal_pemeriksaan)->format('Y-m-d') ?? '-',
                'tanggal_berakhir' => optional($item->tanggal_berakhir)->format('Y-m-d') ?? '-',
                'kondisi' => $item->kondisi,
                'status_notifikasi' => $statusNotifikasi,
                'masa_pakai_hari' => $masaPakai,
                'sisa_masa_pakai_hari' => $sisaMasaPakai,
                'catatan' => $item->catatan,
            ];
        });

        // 📊 Statistik
        $stats = [
            'total' => $monitorings->count(),
            'active' => $monitorings->where('status_notifikasi', 'Active')->count(),
            'warning' => $monitorings->where('status_notifikasi', 'Warning')->count(),
            'expired' => $monitorings->where('status_notifikasi', 'Expired')->count(),
            'baik' => $monitorings->where('kondisi', 'Baik')->count(),
            'rusak' => $monitorings->where('kondisi', 'Rusak')->count(),
            'perlu_diganti' => $monitorings->where('kondisi', 'Perlu Diganti')->count(),
        ];

        // 📋 Data dropdown
        $lokasiList = Lokasi::select('lokasi_id', 'nama_lokasi')->get();
        $garduList = GarduInduk::select('gardu_induk_id', 'nama_gardu_induk', 'lokasi_id')->get();

        return Inertia::render('MonitoringApd/Laporan', [
            'monitorings' => $monitorings,
            'lokasiList' => $lokasiList,
            'garduList' => $garduList,
            'stats' => $stats,
            'filters' => [
                'lokasi_id' => $lokasi_id,
                'gardu_induk_id' => $gardu_induk_id,
                'kondisi' => $kondisi,
                'status_notifikasi' => $status_notifikasi,
            ],
        ]);
    }

    /**
     * 📥 Export laporan ke Excel
     */
    public function exportLaporan(Request $request)
    {
        $lokasi_id = $request->input('lokasi_id');
        $gardu_induk_id = $request->input('gardu_induk_id');
        $kondisi = $request->input('kondisi');
        $status_notifikasi = $request->input('status_notifikasi');

        // Query data dengan filter yang sama
        $query = MonitoringApd::with(['apd', 'lokasi', 'garduInduk'])
            ->when($lokasi_id, fn($q) => $q->where('lokasi_id', $lokasi_id))
            ->when($gardu_induk_id, fn($q) => $q->where('gardu_induk_id', $gardu_induk_id))
            ->when($kondisi, fn($q) => $q->where('kondisi', $kondisi));

        if ($status_notifikasi) {
            if ($status_notifikasi === 'Expired') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) < 30');
            } elseif ($status_notifikasi === 'Warning') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90');
            } elseif ($status_notifikasi === 'Active') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) > 90');
            }
        }

        $monitorings = $query->orderBy('tanggal_berakhir', 'asc')->get();

        // Buat spreadsheet
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Laporan Masa Pakai APD');

        // Header laporan
        $sheet->setCellValue('A1', 'LAPORAN MASA PAKAI APD');
        $sheet->mergeCells('A1:N1');
        $sheet->getStyle('A1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 16, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '4472C4']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
        ]);
        $sheet->getRowDimension('1')->setRowHeight(30);

        // Info filter
        $row = 2;
        $sheet->setCellValue('A' . $row, 'Tanggal Cetak: ' . Carbon::now()->format('d/m/Y H:i'));
        $sheet->mergeCells('A' . $row . ':N' . $row);
        $row++;

        if ($lokasi_id) {
            $lokasi = Lokasi::find($lokasi_id);
            $sheet->setCellValue('A' . $row, 'Filter Lokasi: ' . ($lokasi->nama_lokasi ?? '-'));
            $sheet->mergeCells('A' . $row . ':N' . $row);
            $row++;
        }

        if ($gardu_induk_id) {
            $gardu = GarduInduk::find($gardu_induk_id);
            $sheet->setCellValue('A' . $row, 'Filter Gardu Induk: ' . ($gardu->nama_gardu_induk ?? '-'));
            $sheet->mergeCells('A' . $row . ':N' . $row);
            $row++;
        }

        if ($kondisi) {
            $sheet->setCellValue('A' . $row, 'Filter Kondisi: ' . $kondisi);
            $sheet->mergeCells('A' . $row . ':N' . $row);
            $row++;
        }

        if ($status_notifikasi) {
            $sheet->setCellValue('A' . $row, 'Filter Status: ' . $status_notifikasi);
            $sheet->mergeCells('A' . $row . ':N' . $row);
            $row++;
        }

        $row++; // Baris kosong

        // Header tabel
        $headers = [
            'No', 'Kode APD', 'Nama APD', 'Lokasi', 'Gardu Induk', 'Stok',
            'Tanggal Distribusi', 'Tanggal Pemeriksaan', 'Tanggal Berakhir',
            'Masa Pakai (Hari)', 'Sisa Hari', 'Kondisi', 'Status', 'Catatan'
        ];

        $sheet->fromArray([$headers], null, 'A' . $row);
        
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '0070C0']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN]],
        ];
        
        $sheet->getStyle('A' . $row . ':N' . $row)->applyFromArray($headerStyle);
        $row++;

        // Data
        $no = 1;
        foreach ($monitorings as $item) {
            $today = Carbon::now()->startOfDay();
            $tanggalBerakhir = $item->tanggal_berakhir 
                ? Carbon::parse($item->tanggal_berakhir)->startOfDay() 
                : null;
            
            $selisih = $tanggalBerakhir 
                ? (int) $today->diffInDays($tanggalBerakhir, false) 
                : null;
            
            $statusNotifikasi = 'Active';
            if ($selisih !== null) {
                if ($selisih < 30) {
                    $statusNotifikasi = 'Expired';
                } elseif ($selisih >= 30 && $selisih <= 90) {
                    $statusNotifikasi = 'Warning';
                } else {
                    $statusNotifikasi = 'Active';
                }
            }

            $masaPakai = null;
            if ($item->tanggal_distribusi && $item->tanggal_berakhir) {
                $distribusi = Carbon::parse($item->tanggal_distribusi);
                $berakhir = Carbon::parse($item->tanggal_berakhir);
                $masaPakai = $distribusi->diffInDays($berakhir);
            }

            $data = [
                $no++,
                $item->apd->kode_apd ?? '-',
                $item->apd->nama_apd ?? '-',
                $item->lokasi->nama_lokasi ?? '-',
                $item->garduInduk->nama_gardu_induk ?? '-',
                $item->stok,
                $item->tanggal_distribusi ? $item->tanggal_distribusi->format('d/m/Y') : '-',
                $item->tanggal_pemeriksaan ? $item->tanggal_pemeriksaan->format('d/m/Y') : '-',
                $item->tanggal_berakhir ? $item->tanggal_berakhir->format('d/m/Y') : '-',
                $masaPakai ?? '-',
                $selisih ?? '-',
                $item->kondisi,
                $statusNotifikasi,
                $item->catatan ?? '-',
            ];

            $sheet->fromArray([$data], null, 'A' . $row);
            
            // Style berdasarkan status
            $statusColor = match($statusNotifikasi) {
                'Active' => 'C6EFCE',
                'Warning' => 'FFEB9C',
                'Expired' => 'FFC7CE',
                default => 'FFFFFF'
            };
            
            $sheet->getStyle('M' . $row)->applyFromArray([
                'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => $statusColor]]
            ]);

            $row++;
        }

        // Border untuk semua data
        $lastRow = $row - 1;
        $sheet->getStyle('A6:N' . $lastRow)->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => '000000']]]
        ]);

        // Auto width
        foreach (range('A', 'N') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Output
        $filename = 'Laporan_Masa_Pakai_APD_' . Carbon::now()->format('Y-m-d_His') . '.xlsx';
        $writer = new Xlsx($spreadsheet);
        
        $temp_file = tempnam(sys_get_temp_dir(), $filename);
        $writer->save($temp_file);

        return response()->download($temp_file, $filename)->deleteFileAfterSend(true);
    }
}