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
        $status = $request->input('status', 'Semua');
        $readStatus = $request->input('read_status', 'Semua');

        // 📊 Hitung statistik DINAMIS berdasarkan tanggal real-time
        $today = Carbon::now()->startOfDay();
        
        $expired = MonitoringApd::whereNotNull('tanggal_berakhir')
            ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) < 30')
            ->count();
            
        $warning = MonitoringApd::whereNotNull('tanggal_berakhir')
            ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90')
            ->count();
            
        $active = MonitoringApd::whereNotNull('tanggal_berakhir')
            ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) > 90')
            ->count();
        
        // ✅ Hitung SEMUA notifikasi belum dibaca (termasuk Active)
        $unread = MonitoringApd::unread()->count();

        // 🔎 Query data dengan filter
        $query = MonitoringApd::with(['apd', 'lokasi', 'garduInduk', 'user'])
            ->when($search, function ($q) use ($search) {
                $q->where(function($query) use ($search) {
                    $query->where('kondisi', 'like', "%{$search}%")
                        ->orWhere('catatan', 'like', "%{$search}%")
                        ->orWhereHas('apd', fn($a) => $a->where('nama_apd', 'like', "%{$search}%"))
                        ->orWhereHas('lokasi', fn($l) => $l->where('nama_lokasi', 'like', "%{$search}%"))
                        ->orWhereHas('garduInduk', fn($g) => $g->where('nama_gardu_induk', 'like', "%{$search}%"));
                });
            });

        // ✅ PERBAIKAN: Filter berdasarkan status notifikasi DINAMIS
        if ($status !== 'Semua') {
            if ($status === 'Merah') {
                // Expired: < 30 hari
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) < 30');
            } elseif ($status === 'Kuning') {
                // Warning: 30-90 hari
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90');
            } elseif ($status === 'Hijau') {
                // Active: > 90 hari
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) > 90');
            }
        }

        // Filter berdasarkan status baca
        if ($readStatus === 'Belum Dibaca') {
            $query->unread();
        } elseif ($readStatus === 'Sudah Dibaca') {
            $query->read();
        }

        // 🔄 Pagination dengan prioritas yang lebih kompleks
        $notifications = $query
            ->orderByRaw("CASE 
                WHEN is_read = 0 AND DATEDIFF(tanggal_berakhir, CURDATE()) < 30 THEN 1
                WHEN is_read = 0 AND DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90 THEN 2
                WHEN is_read = 0 AND DATEDIFF(tanggal_berakhir, CURDATE()) > 90 THEN 3
                WHEN is_read = 1 AND DATEDIFF(tanggal_berakhir, CURDATE()) < 30 THEN 4
                WHEN is_read = 1 AND DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90 THEN 5
                WHEN is_read = 1 AND DATEDIFF(tanggal_berakhir, CURDATE()) > 90 THEN 6
                ELSE 7
            END")
            ->orderBy('tanggal_berakhir', 'asc')
            ->paginate(10)
            ->through(function ($item) {
                $today = Carbon::now()->startOfDay();
                $tanggalBerakhir = $item->tanggal_berakhir 
                    ? Carbon::parse($item->tanggal_berakhir)->startOfDay() 
                    : null;
                
                $selisih = $tanggalBerakhir 
                    ? (int) $today->diffInDays($tanggalBerakhir, false) 
                    : null;
                
                // ✅ HITUNG STATUS DINAMIS berdasarkan hari tersisa
                $statusNotifikasi = 'Active';
                $badgeColor = 'green';
                $priority = 'low';
                
                if ($selisih !== null) {
                    if ($selisih < 30) {
                        $statusNotifikasi = 'Expired';
                        $badgeColor = 'red';
                        $priority = 'high';
                    } elseif ($selisih >= 30 && $selisih <= 90) {
                        $statusNotifikasi = 'Warning';
                        $badgeColor = 'yellow';
                        $priority = 'medium';
                    } else {
                        $statusNotifikasi = 'Active';
                        $badgeColor = 'green';
                        $priority = 'low';
                    }
                }

                $statusText = $selisih !== null 
                    ? ($selisih < 0 ? 'Sudah Expired' : "{$selisih} hari lagi")
                    : '-';

                return [
                    'monitoring_id'         => $item->monitoring_id,
                    'apd_nama'              => $item->apd?->nama_apd ?? '-',
                    'apd_kode'              => $item->apd?->kode_apd ?? '-',
                    'apd_gambar'            => $item->apd?->gambar
                                               ? asset('storage/' . $item->apd->gambar)
                                               : null,
                    'lokasi_nama'           => $item->lokasi?->nama_lokasi ?? '-',
                    'gardu_nama'            => $item->garduInduk?->nama_gardu_induk ?? '-',
                    'user_nama'             => $item->user?->name ?? '-',
                    'stok'                  => $item->stok,
                    'tanggal_distribusi'    => $item->tanggal_distribusi?->format('Y-m-d'),
                    'tanggal_berakhir'      => $item->tanggal_berakhir?->format('Y-m-d'),
                    'kondisi'               => $item->kondisi,
                    'catatan'               => $item->catatan,
                    'status_notifikasi'     => $statusNotifikasi,
                    'badge_color'           => $badgeColor,
                    'status_text'           => $statusText,
                    'hari_tersisa'          => $selisih,
                    'priority'              => $priority,
                    'is_read'               => $item->is_read,
                    'standar'               => $item->apd?->standar ?? '-',
                    'masa_penggunaan'       => $item->apd?->masa_penggunaan ?? '-',
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
                'unread' => $unread,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'read_status' => $readStatus,
            ],
        ]);
    }

    /**
     * 🔔 Ambil preview notifikasi untuk navbar dropdown (5 terbaru)
     */
    public function preview()
    {
        $today = Carbon::now()->startOfDay();
        
        $notifications = MonitoringApd::with(['apd'])
            ->whereNotNull('tanggal_berakhir')
            ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) <= 90') // Hanya Expired & Warning
            ->orderBy('is_read', 'asc')
            ->orderByRaw("CASE 
                WHEN DATEDIFF(tanggal_berakhir, CURDATE()) < 30 THEN 1
                WHEN DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90 THEN 2
                ELSE 3
            END")
            ->orderBy('tanggal_berakhir', 'asc')
            ->limit(5)
            ->get()
            ->map(function ($item) use ($today) {
                $tanggalBerakhir = $item->tanggal_berakhir 
                    ? Carbon::parse($item->tanggal_berakhir)->startOfDay() 
                    : null;
                
                $selisih = $tanggalBerakhir 
                    ? (int) $today->diffInDays($tanggalBerakhir, false) 
                    : null;
                
                // Hitung status dinamis
                $badgeColor = ($selisih !== null && $selisih < 30) ? 'red' : 'yellow';
                $statusText = $selisih !== null 
                    ? ($selisih < 0 ? 'Sudah Expired' : "{$selisih} hari lagi")
                    : '-';

                return [
                    'monitoring_id' => $item->monitoring_id,
                    'apd_nama' => $item->apd?->nama_apd ?? '-',
                    'apd_kode' => $item->apd?->kode_apd ?? '-',
                    'badge_color' => $badgeColor,
                    'status_text' => $statusText,
                    'masa_penggunaan' => $item->apd?->masa_penggunaan ?? null,
                    'standar' => $item->apd?->standar ?? null,
                    'is_read' => $item->is_read,
                    'created_at' => $item->created_at->diffForHumans(),
                ];
            });

        // Hitung unread count SEMUA status
        $unreadCount = MonitoringApd::unread()->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * ✅ Tandai satu notifikasi sebagai dibaca
     */
    public function markAsRead($id)
    {
        $monitoring = MonitoringApd::findOrFail($id);
        $monitoring->markAsRead();

        return redirect()->back()->with('success', 'Notifikasi ditandai sebagai dibaca.');
    }

    /**
     * 🔄 Tandai semua notifikasi sebagai dibaca
     */
    public function markAllAsRead()
    {
        // ✅ Tandai SEMUA notifikasi belum dibaca
        MonitoringApd::unread()->update(['is_read' => true]);
        
        return redirect()->back()->with('success', 'Semua notifikasi ditandai sebagai dibaca.');
    }

    /**
     * 👁️ Tampilkan detail notifikasi dan tandai sebagai dibaca
     */
    public function show($id)
    {
        $monitoring = MonitoringApd::with(['apd', 'lokasi', 'garduInduk', 'user'])
            ->findOrFail($id);

        // Tandai sebagai dibaca
        if (!$monitoring->is_read) {
            $monitoring->markAsRead();
        }

        $today = Carbon::now()->startOfDay();
        $tanggalBerakhir = $monitoring->tanggal_berakhir 
            ? Carbon::parse($monitoring->tanggal_berakhir)->startOfDay() 
            : null;
        
        $selisih = $tanggalBerakhir 
            ? (int) $today->diffInDays($tanggalBerakhir, false) 
            : null;
        
        // ✅ Hitung status dinamis
        $statusNotifikasi = 'Active';
        $badgeColor = 'green';
        
        if ($selisih !== null) {
            if ($selisih < 30) {
                $statusNotifikasi = 'Expired';
                $badgeColor = 'red';
            } elseif ($selisih >= 30 && $selisih <= 90) {
                $statusNotifikasi = 'Warning';
                $badgeColor = 'yellow';
            } else {
                $statusNotifikasi = 'Active';
                $badgeColor = 'green';
            }
        }

        $notificationDetail = [
            'monitoring_id'         => $monitoring->monitoring_id,
            'apd_nama'              => $monitoring->apd?->nama_apd ?? '-',
            'apd_kode'              => $monitoring->apd?->kode_apd ?? '-',
            'apd_gambar'            => $monitoring->apd?->gambar
                                       ? asset('storage/' . $monitoring->apd->gambar)
                                       : null,
            'apd_deskripsi'         => $monitoring->apd?->deskripsi ?? '-',
            'lokasi_nama'           => $monitoring->lokasi?->nama_lokasi ?? '-',
            'lokasi_kode'           => $monitoring->lokasi?->kode_lokasi ?? '-',
            'gardu_nama'            => $monitoring->garduInduk?->nama_gardu_induk ?? '-',
            'user_nama'             => $monitoring->user?->name ?? '-',
            'user_email'            => $monitoring->user?->email ?? '-',
            'stok'                  => $monitoring->stok,
            'tanggal_distribusi'    => $monitoring->tanggal_distribusi?->format('Y-m-d'),
            'tanggal_pemeriksaan'   => $monitoring->tanggal_pemeriksaan?->format('Y-m-d'),
            'tanggal_berakhir'      => $monitoring->tanggal_berakhir?->format('Y-m-d'),
            'kondisi'               => $monitoring->kondisi,
            'catatan'               => $monitoring->catatan,
            'status_notifikasi'     => $statusNotifikasi,
            'badge_color'           => $badgeColor,
            'hari_tersisa'          => $selisih,
            'is_read'               => $monitoring->is_read,
            'standar'               => $monitoring->apd?->standar ?? '-',
            'masa_penggunaan'       => $monitoring->apd?->masa_penggunaan ?? '-',
            'created_at'            => $monitoring->created_at->format('Y-m-d H:i:s'),
            'updated_at'            => $monitoring->updated_at->format('Y-m-d H:i:s'),
        ];

        return Inertia::render('Notifikasi/Show', [
            'notification' => $notificationDetail,
        ]);
    }
}