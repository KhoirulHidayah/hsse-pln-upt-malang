<?php

namespace App\Http\Controllers;

use App\Models\MonitoringApd;
use App\Models\GarduInduk;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PemeriksaanApdController extends Controller
{
    /**
     * Halaman utama pemeriksaan.
     * - Admin  : pilih gardu induk dari daftar
     * - Pemeriksa : langsung masuk ke gardu miliknya
     */
    public function index()
    {
        // supaya Intelephense mengenali model User
        $user = User::find(auth()->id());

        // Pemeriksa langsung redirect ke gardu miliknya
        if ($user && $user->isPemeriksa()) {

            if (!$user->gardu_induk_id) {
                abort(
                    403,
                    'Akun Anda belum dihubungkan ke gardu induk. Hubungi admin.'
                );
            }

            return redirect()->route(
                'pemeriksaan-apd.show',
                $user->gardu_induk_id
            );
        }

        // Admin: tampilkan semua gardu induk beserta jumlah APD & status
        $garduList = GarduInduk::with([
                'users',
            ])
            ->withCount([

                'monitoringApds as total_apd',

                'monitoringApds as tidak_layak' => function ($q) {
                    $q->whereRaw(
                        "kondisi IN ('Rusak', 'Perlu Diganti')"
                    );
                },

            ])
            ->get()
            ->map(function ($g) {

                return [
                    'gardu_induk_id'   => $g->gardu_induk_id,
                    'nama_gardu_induk' => $g->nama_gardu_induk,
                    'total_apd'        => $g->total_apd,
                    'tidak_layak'      => $g->tidak_layak,
                    'pemeriksa'        => optional(
                        $g->users->first()
                    )->name ?? '-',
                ];
            });

        return Inertia::render('PemeriksaanApd/Index', [
            'garduList' => $garduList,
            'isAdmin'   => true,
        ]);
    }

    /**
     * Halaman checklist APD per gardu induk.
     */
    public function show(Request $request, $garduIndukId)
    {
        // supaya Intelephense mengenali model User
        $user = User::find(auth()->id());

        // Pemeriksa hanya boleh akses gardu miliknya
        if (
            $user &&
            $user->isPemeriksa() &&
            $user->gardu_induk_id != $garduIndukId
        ) {
            abort(
                403,
                'Anda hanya dapat memeriksa APD di gardu induk Anda sendiri.'
            );
        }

        $gardu = GarduInduk::findOrFail($garduIndukId);

        // Ambil filter dari halaman Show
        $search = $request->input('search');
        $kondisi = $request->input('kondisi');
        $statusNotifikasi = $request->input('status_notifikasi');

        $query = MonitoringApd::with(['apd'])
            ->where('gardu_induk_id', $garduIndukId)
            ->when($search, function ($q) use ($search) {
                $q->where(function ($query) use ($search) {
                    $query->where('stok', 'like', "%{$search}%")
                        ->orWhere('catatan', 'like', "%{$search}%")
                        ->orWhereHas('apd', function ($apd) use ($search) {
                            $apd->where('nama_apd', 'like', "%{$search}%")
                                ->orWhere('kode_apd', 'like', "%{$search}%");
                        });
                });
            })
            ->when($kondisi, function ($q) use ($kondisi) {
                $q->where('kondisi', $kondisi);
            });

        // Filter status notifikasi berdasarkan tanggal_berakhir
        if ($statusNotifikasi) {
            if ($statusNotifikasi === 'Expired') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) < 30');
            } elseif ($statusNotifikasi === 'Warning') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) BETWEEN 30 AND 90');
            } elseif ($statusNotifikasi === 'Active') {
                $query->whereNotNull('tanggal_berakhir')
                    ->whereRaw('DATEDIFF(tanggal_berakhir, CURDATE()) > 90');
            }
        }

        $apds = $query->get()
            ->map(function ($item) {

                return [
                    'monitoring_id'       => $item->monitoring_id,
                    'nama_apd'            => optional($item->apd)->nama_apd ?? '-',
                    'kode_apd'            => optional($item->apd)->kode_apd ?? '-',
                    'kondisi'             => $item->kondisi,
                    'stok'                => $item->stok,
                    'tanggal_berakhir'    => optional(
                        $item->tanggal_berakhir
                    )?->format('Y-m-d'),

                    'tanggal_pemeriksaan' => optional(
                        $item->tanggal_pemeriksaan
                    )?->format('Y-m-d'),
                    'tanggal_distribusi'  => $item->tanggal_distribusi
                        ? Carbon::parse($item->tanggal_distribusi)->format('d-m-Y')
                        : '-',
                    'status_notifikasi'   => $item->status_notifikasi_otomatis,
                    'catatan'             => $item->catatan,
                ];
            });

        return Inertia::render('PemeriksaanApd/Show', [

            'gardu' => [
                'gardu_induk_id'   => $gardu->gardu_induk_id,
                'nama_gardu_induk' => $gardu->nama_gardu_induk,
            ],

            'apds' => $apds,

            'filters' => [
                'search'              => $search,
                'kondisi'             => $kondisi,
                'status_notifikasi'   => $statusNotifikasi,
            ],

            'isAdmin' => $user
                ? $user->isAdmin()
                : false,
        ]);
    }

    /**
     * Update kondisi APD.
     */
    public function updateKondisi(Request $request, $monitoringId)
    {
        $request->validate([
            'kondisi' => [
                'required',
                'in:Baik,Perlu Diganti,Rusak',
            ],
        ]);

        $item = MonitoringApd::findOrFail($monitoringId);

        // supaya Intelephense mengenali model User
        $user = User::find(auth()->id());

        // Pemeriksa hanya boleh update APD di gardu miliknya
        if (
            $user &&
            $user->isPemeriksa() &&
            $item->gardu_induk_id != $user->gardu_induk_id
        ) {
            abort(403);
        }

        $item->update([
            'kondisi'             => $request->kondisi,
            'tanggal_pemeriksaan' => now(),
        ]);

        return back()->with(
            'success',
            'Kondisi APD berhasil diperbarui menjadi "' .
            $request->kondisi .
            '".'
        );
    }
}