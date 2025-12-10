<?php

namespace App\Http\Controllers;

use App\Models\Apd;
use App\Models\MonitoringApd;
use App\Models\Lokasi;
use App\Models\GarduInduk;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Total APD dan Monitoring
        $totalApd = Apd::count();
        $totalMonitoring = MonitoringApd::count();

        // ✅ PERBAIKAN: 2. Status Notifikasi Counts - Menggunakan Query DINAMIS
        $today = Carbon::now()->startOfDay();
        
        $statusCounts = [
            'active' => MonitoringApd::whereNotNull('tanggal_berakhir')
                ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) > 90')
                ->count(),
            
            'warning' => MonitoringApd::whereNotNull('tanggal_berakhir')
                ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90')
                ->count(),
            
            'expired' => MonitoringApd::whereNotNull('tanggal_berakhir')
                ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) < 30')
                ->count(),
        ];

        // 3. Kondisi APD Counts
        $kondisiCounts = [
            'baik' => MonitoringApd::where('kondisi', 'Baik')->count(),
            'perlu_diganti' => MonitoringApd::where('kondisi', 'Perlu Diganti')->count(),
            'rusak' => MonitoringApd::where('kondisi', 'Rusak')->count(),
        ];

        // 4. Ringkasan per Lokasi (dengan jumlah gardu dan monitoring)
        $lokasiSummary = Lokasi::select('lokasi_id', 'nama_lokasi')
            ->withCount(['garduInduk'])
            ->get()
            ->map(function ($lokasi) {
                // Hitung monitoring APD per lokasi
                $monitoringCount = MonitoringApd::where('lokasi_id', $lokasi->lokasi_id)->count();
                
                return [
                    'lokasi_id' => $lokasi->lokasi_id,
                    'nama_lokasi' => $lokasi->nama_lokasi,
                    'gardu_count' => $lokasi->gardu_induk_count,
                    'monitoring_count' => $monitoringCount,
                ];
            })
            ->sortByDesc('monitoring_count')
            ->take(10)
            ->values();

        // 5. Ringkasan per Gardu Induk (top 10)
        $garduSummary = GarduInduk::select('gardu_induk_id', 'nama_gardu_induk', 'lokasi_id')
            ->with('lokasi:lokasi_id,nama_lokasi')
            ->get()
            ->map(function ($gardu) {
                $monitoringCount = MonitoringApd::where('gardu_induk_id', $gardu->gardu_induk_id)->count();
                
                return [
                    'gardu_induk_id' => $gardu->gardu_induk_id,
                    'nama_gardu_induk' => $gardu->nama_gardu_induk,
                    'nama_lokasi' => $gardu->lokasi->nama_lokasi ?? '-',
                    'monitoring_count' => $monitoringCount,
                ];
            })
            ->sortByDesc('monitoring_count')
            ->take(10)
            ->values();

        // ✅ PERBAIKAN: 6. APD yang akan segera expired - Query DINAMIS
        $apdExpiringSoon = MonitoringApd::select(
                'monitoring_apds.monitoring_id',
                'monitoring_apds.tanggal_berakhir',
                'monitoring_apds.apd_id',
                'monitoring_apds.lokasi_id',
                'monitoring_apds.gardu_induk_id'
            )
            ->whereNotNull('monitoring_apds.tanggal_berakhir')
            ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) < 30') // Hanya < 30 hari (Expired)
            ->with([
                'apd:id,nama_apd,gambar',
                'lokasi:lokasi_id,nama_lokasi',
                'garduInduk:gardu_induk_id,nama_gardu_induk'
            ])
            ->orderBy('monitoring_apds.tanggal_berakhir', 'asc')
            ->limit(10)
            ->get()
            ->map(function ($item) use ($today) {
                // Hitung status dinamis
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
                    'monitoring_id' => $item->monitoring_id,
                    'apd_nama' => $item->apd->nama_apd ?? '-',
                    'apd_gambar' => $item->apd && $item->apd->gambar 
                        ? asset('storage/' . $item->apd->gambar) 
                        : null,
                    'lokasi_nama' => $item->lokasi->nama_lokasi ?? '-',
                    'gardu_nama' => $item->garduInduk->nama_gardu_induk ?? '-',
                    'tanggal_berakhir' => $item->tanggal_berakhir->format('Y-m-d'),
                    'status_notifikasi' => $statusNotifikasi,
                ];
            });

        // ✅ PERBAIKAN: 7. Recent Monitoring (10 terakhir) - Dengan status dinamis
        $recentMonitoring = MonitoringApd::select(
                'monitoring_apds.monitoring_id',
                'monitoring_apds.tanggal_pemeriksaan',
                'monitoring_apds.tanggal_berakhir',
                'monitoring_apds.kondisi',
                'monitoring_apds.apd_id',
                'monitoring_apds.lokasi_id'
            )
            ->with([
                'apd:id,nama_apd,gambar',
                'lokasi:lokasi_id,nama_lokasi'
            ])
            ->orderBy('monitoring_apds.created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($item) use ($today) {
                // Hitung status dinamis
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
                    'monitoring_id' => $item->monitoring_id,
                    'apd_nama' => $item->apd->nama_apd ?? '-',
                    'apd_gambar' => $item->apd && $item->apd->gambar 
                        ? asset('storage/' . $item->apd->gambar) 
                        : null,
                    'lokasi_nama' => $item->lokasi->nama_lokasi ?? '-',
                    'tanggal_pemeriksaan' => $item->tanggal_pemeriksaan?->format('Y-m-d'),
                    'kondisi' => $item->kondisi,
                    'status_notifikasi' => $statusNotifikasi,
                ];
            });

        // 8. Trends (perbandingan bulan ini vs bulan lalu)
        $thisMonth = MonitoringApd::whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();

        $lastMonth = MonitoringApd::whereYear('created_at', Carbon::now()->subMonth()->year)
            ->whereMonth('created_at', Carbon::now()->subMonth()->month)
            ->count();

        $percentageChange = 0;
        if ($lastMonth > 0) {
            $percentageChange = (($thisMonth - $lastMonth) / $lastMonth) * 100;
        }

        $trends = [
            'this_month' => $thisMonth,
            'last_month' => $lastMonth,
            'percentage_change' => round($percentageChange, 1),
        ];

        // Compile all statistics
        $statistics = [
            'total_apd' => $totalApd,
            'total_monitoring' => $totalMonitoring,
            'status_counts' => $statusCounts,
            'kondisi_counts' => $kondisiCounts,
            'lokasi_summary' => $lokasiSummary,
            'gardu_summary' => $garduSummary,
            'apd_expiring_soon' => $apdExpiringSoon,
            'recent_monitoring' => $recentMonitoring,
            'trends' => $trends,
        ];

        return Inertia::render('Dashboard', [
            'statistics' => $statistics,
        ]);
    }
}