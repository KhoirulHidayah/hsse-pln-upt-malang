<?php

namespace App\Http\Controllers;

use App\Models\MonitoringApd;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class NotifikasiController extends Controller
{
    /**
     * 📋 Tampilkan halaman notifikasi dengan statistik dan daftar APD
     */
    public function index(Request $request)
    {
        // 🔍 Ambil parameter filter dari React
        $search = $request->input('search');
        $status = $request->input('status', 'Semua'); // Semua, Merah, Kuning, Hijau

        // 📊 Hitung statistik berdasarkan status_notifikasi_otomatis
        $today = Carbon::now();
        
        $allMonitoring = MonitoringApd::with(['apd', 'apdDetail', 'lokasi', 'garduInduk'])
            ->whereNotNull('tanggal_berakhir')
            ->get();

        // Hitung statistik
        $expired = 0;
        $warning = 0;
        $active = 0;

        foreach ($allMonitoring as $item) {
            $tanggalBerakhir = Carbon::parse($item->tanggal_berakhir)->startOfDay();
            $selisih = (int) $today->startOfDay()->diffInDays($tanggalBerakhir, false);
            
            if ($selisih < 30) {
                $expired++;
            } elseif ($selisih >= 30 && $selisih <= 90) {
                $warning++;
            } else {
                $active++;
            }
        }

        // 🔎 Query data dengan filter
        $query = MonitoringApd::with(['apd', 'apdDetail', 'lokasi', 'garduInduk'])
            ->whereNotNull('tanggal_berakhir')
            ->when($search, function ($q) use ($search) {
                $q->where(function($query) use ($search) {
                    $query->where('kondisi', 'like', "%{$search}%")
                        ->orWhere('catatan', 'like', "%{$search}%")
                        ->orWhereHas('apd', fn($a) => $a->where('nama_apd', 'like', "%{$search}%"))
                        ->orWhereHas('apdDetail', fn($d) => $d->where('nama_detail', 'like', "%{$search}%"))
                        ->orWhereHas('lokasi', fn($l) => $l->where('nama_lokasi', 'like', "%{$search}%"))
                        ->orWhereHas('garduInduk', fn($g) => $g->where('nama_gardu_induk', 'like', "%{$search}%"));
                });
            });

        // Filter berdasarkan status
        if ($status !== 'Semua') {
            $query->where(function($q) use ($status, $today) {
                $monitoringIds = MonitoringApd::whereNotNull('tanggal_berakhir')
                    ->get()
                    ->filter(function($item) use ($status, $today) {
                        $tanggalBerakhir = Carbon::parse($item->tanggal_berakhir)->startOfDay();
                        $selisih = (int) Carbon::now()->startOfDay()->diffInDays($tanggalBerakhir, false);
                        
                        if ($status === 'Merah' && $selisih < 30) {
                            return true;
                        } elseif ($status === 'Kuning' && $selisih >= 30 && $selisih <= 90) {
                            return true;
                        } elseif ($status === 'Hijau' && $selisih > 90) {
                            return true;
                        }
                        return false;
                    })
                    ->pluck('monitoring_id')
                    ->toArray();
                
                $q->whereIn('monitoring_id', $monitoringIds);
            });
        }

        // 📄 Pagination
        $notifications = $query->orderBy('tanggal_berakhir', 'asc')
            ->paginate(10)
            ->through(function ($item) use ($today) {
                $tanggalBerakhir = Carbon::parse($item->tanggal_berakhir)->startOfDay();
                $selisih = (int) Carbon::now()->startOfDay()->diffInDays($tanggalBerakhir, false);
                
                // Tentukan status dan badge
                if ($selisih < 30) {
                    $statusLabel = 'Expired';
                    $badgeColor = 'red';
                    $statusText = $selisih < 0 ? 'Expired' : "{$selisih} hari lagi";
                } elseif ($selisih >= 30 && $selisih <= 90) {
                    $statusLabel = 'Warning';
                    $badgeColor = 'yellow';
                    $statusText = "{$selisih} hari lagi";
                } else {
                    $statusLabel = 'Active';
                    $badgeColor = 'green';
                    $statusText = "{$selisih} hari lagi";
                }

                return [
                    'monitoring_id'         => $item->monitoring_id,
                    'apd_nama'              => optional($item->apd)->nama_apd ?? '-',
                    'apd_detail_nama'       => optional($item->apdDetail)->nama_detail ?? '-',
                    'apd_detail_gambar'     => $item->apdDetail && $item->apdDetail->gambar
                                               ? asset('storage/' . $item->apdDetail->gambar)
                                               : null,
                    'lokasi_nama'           => optional($item->lokasi)->nama_lokasi ?? '-',
                    'gardu_nama'            => optional($item->garduInduk)->nama_gardu_induk ?? '-',
                    'tanggal_distribusi'    => $item->tanggal_distribusi,
                    'tanggal_berakhir'      => $item->tanggal_berakhir,
                    'kondisi'               => $item->kondisi,
                    'catatan'               => $item->catatan,
                    'status_notifikasi'     => $statusLabel,
                    'badge_color'           => $badgeColor,
                    'status_text'           => $statusText,
                    'hari_tersisa'          => $selisih,
                    'standar'               => optional($item->apdDetail)->standar ?? '-',
                    'created_at'            => $item->created_at->diffForHumans(),
                ];
            })
            ->appends($request->all());

        // 📤 Kirim data ke React (Inertia)
        return Inertia::render('Notifikasi/Index', [
            'notifications' => $notifications,
            'statistics' => [
                'expired' => $expired,
                'warning' => $warning,
                'active' => $active,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    /**
     * 🔄 Tandai semua notifikasi sebagai dibaca (opsional)
     */
    public function markAllAsRead()
    {
        // Jika Anda ingin menambahkan fitur "tandai dibaca", 
        // Anda perlu menambahkan kolom 'is_read' di tabel monitoring_apds
        
        return redirect()->back()->with('success', 'Semua notifikasi ditandai sebagai dibaca.');
    }

    /**
     * 👁️ Tampilkan detail notifikasi
     */
    public function show($id)
    {
        $monitoring = MonitoringApd::with(['apd', 'apdDetail', 'lokasi', 'garduInduk'])
            ->findOrFail($id);

        $tanggalBerakhir = Carbon::parse($monitoring->tanggal_berakhir)->startOfDay();
        $selisih = (int) Carbon::now()->startOfDay()->diffInDays($tanggalBerakhir, false);
        
        // Tentukan status
        if ($selisih < 30) {
            $statusLabel = 'Expired';
            $badgeColor = 'red';
        } elseif ($selisih >= 30 && $selisih <= 90) {
            $statusLabel = 'Warning';
            $badgeColor = 'yellow';
        } else {
            $statusLabel = 'Active';
            $badgeColor = 'green';
        }

        $notificationDetail = [
            'monitoring_id'         => $monitoring->monitoring_id,
            'apd_nama'              => optional($monitoring->apd)->nama_apd ?? '-',
            'apd_detail_nama'       => optional($monitoring->apdDetail)->nama_detail ?? '-',
            'apd_detail_gambar'     => $monitoring->apdDetail && $monitoring->apdDetail->gambar
                                       ? asset('storage/' . $monitoring->apdDetail->gambar)
                                       : null,
            'lokasi_nama'           => optional($monitoring->lokasi)->nama_lokasi ?? '-',
            'gardu_nama'            => optional($monitoring->garduInduk)->nama_gardu_induk ?? '-',
            'stok'                  => $monitoring->stok,
            'tanggal_distribusi'    => $monitoring->tanggal_distribusi,
            'tanggal_pemeriksaan'   => $monitoring->tanggal_pemeriksaan,
            'tanggal_berakhir'      => $monitoring->tanggal_berakhir,
            'kondisi'               => $monitoring->kondisi,
            'catatan'               => $monitoring->catatan,
            'status_notifikasi'     => $statusLabel,
            'badge_color'           => $badgeColor,
            'hari_tersisa'          => $selisih,
            'standar'               => optional($monitoring->apdDetail)->standar ?? '-',
            'bahan'                 => optional($monitoring->apdDetail)->bahan ?? '-',
            'warna'                 => optional($monitoring->apdDetail)->warna ?? '-',
            'ukuran'                => optional($monitoring->apdDetail)->ukuran ?? '-',
            'fungsi'                => optional($monitoring->apdDetail)->fungsi ?? '-',
        ];

        return Inertia::render('Notifikasi/Show', [
            'notification' => $notificationDetail,
        ]);
    }
}