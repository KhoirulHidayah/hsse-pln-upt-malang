<?php

namespace App\Http\Controllers;

use App\Models\GarduInduk;
use App\Models\Lokasi;
use App\Models\MonitoringApd;
use App\Http\Requests\StoreGarduIndukRequest;
use App\Http\Requests\UpdateGarduIndukRequest;
use Illuminate\Http\Request;

class GarduIndukController extends Controller
{
    /**
     * 📋 Tampilkan daftar Gardu Induk (dapat difilter berdasarkan lokasi).
     */
    public function index(Request $request)
    {
        $query = GarduInduk::with('lokasi');

        // 🔍 Filter pencarian
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('nama_gardu_induk', 'like', "%{$search}%");
        }

        // 🎯 Filter berdasarkan lokasi
        if ($request->filled('lokasi_id')) {
            $query->where('lokasi_id', $request->lokasi_id);
        }

        // 🔀 Sorting
        $sortField = $request->get('sortField', 'gardu_induk_id');
        $sortDirection = $request->get('sortDirection', 'asc');
        
        if ($sortField !== 'monitoring_apd_count') {
            $query->orderBy($sortField, $sortDirection);
        }

        // 📄 Pagination + format data
        $garduInduks = $query->paginate(10)
            ->onEachSide(1)
            ->withQueryString()
            ->through(function($g) {
                // Hitung jumlah monitoring APD untuk gardu induk ini
                $monitoringCount = MonitoringApd::where('gardu_induk_id', $g->gardu_induk_id)->count();
                
                return [
                    'gardu_induk_id' => $g->gardu_induk_id,
                    'lokasi_id'      => $g->lokasi_id,
                    'lokasi_nama'    => $g->lokasi?->nama_lokasi,
                    'nama_gardu_induk' => $g->nama_gardu_induk,
                    'monitoring_apd_count' => $monitoringCount,
                    'created_at'     => optional($g->created_at)->format('Y-m-d'),
                    'updated_at'     => optional($g->updated_at)->format('Y-m-d'),
                ];
            });

        // 📊 Jika sorting berdasarkan monitoring_apd_count
        if ($sortField === 'monitoring_apd_count') {
            $sortedData = $garduInduks->getCollection()->sortBy(function ($gardu) {
                return $gardu['monitoring_apd_count'];
            }, SORT_REGULAR, $sortDirection === 'desc');
            
            $garduInduks->setCollection($sortedData->values());
        }

        return inertia('GarduInduk/Index', [
            'garduInduks' => $garduInduks,
            'lokasis' => Lokasi::select('lokasi_id', 'nama_lokasi')->get(),
            'filters' => $request->only(['search', 'lokasi_id', 'sortField', 'sortDirection']),
        ]);
    }

    /**
     * 🧩 Form tambah Gardu Induk.
     */
    public function create()
    {
        return inertia('GarduInduk/Create', [
            'lokasis' => Lokasi::select('lokasi_id', 'nama_lokasi')->get(),
        ]);
    }

    /**
     * 💾 Simpan data Gardu Induk baru.
     */
    public function store(StoreGarduIndukRequest $request)
    {
        GarduInduk::create($request->validated());

        return to_route('gardu-induk.index')->with('success', 'Gardu Induk berhasil ditambahkan.');
    }

    /**
     * 📄 Tampilkan detail Gardu Induk.
     */
    public function show(GarduInduk $garduInduk)
    {
        // Hitung jumlah monitoring APD
        $monitoringCount = MonitoringApd::where('gardu_induk_id', $garduInduk->gardu_induk_id)->count();

        return inertia('GarduInduk/Show', [
            'garduInduk' => [
                'gardu_induk_id'   => $garduInduk->gardu_induk_id,
                'lokasi_id'        => $garduInduk->lokasi_id,
                'nama_gardu_induk' => $garduInduk->nama_gardu_induk,
                'lokasi_nama'      => $garduInduk->lokasi?->nama_lokasi,
                'monitoring_apd_count' => $monitoringCount,
                'created_at'       => optional($garduInduk->created_at)->format('Y-m-d'),
                'updated_at'       => optional($garduInduk->updated_at)->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * ✏️ Form edit Gardu Induk.
     */
    public function edit(GarduInduk $garduInduk)
    {
        return inertia('GarduInduk/Edit', [
            'garduInduk' => [
                'gardu_induk_id'   => $garduInduk->gardu_induk_id,
                'lokasi_id'        => $garduInduk->lokasi_id,
                'nama_gardu_induk' => $garduInduk->nama_gardu_induk,
            ],
            'lokasis' => Lokasi::select('lokasi_id', 'nama_lokasi')->get(),
        ]);
    }

    /**
     * 🔄 Update data Gardu Induk.
     */
    public function update(UpdateGarduIndukRequest $request, GarduInduk $garduInduk)
    {
        $garduInduk->update($request->validated());

        return to_route('gardu-induk.index')->with('success', 'Gardu Induk berhasil diperbarui.');
    }

    /**
     * 🗑️ Hapus data Gardu Induk.
     */
    public function destroy(GarduInduk $garduInduk)
    {
        $nama = $garduInduk->nama_gardu_induk;
        $garduInduk->delete();

        return to_route('gardu-induk.index')->with('success', "Gardu Induk \"$nama\" berhasil dihapus.");
    }
}