<?php

namespace App\Http\Controllers;

use App\Models\Apd;
use App\Models\JenisApd;
use App\Http\Requests\StoreApdRequest;
use App\Http\Requests\UpdateApdRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class ApdController extends Controller
{
    /**
     * 🧾 Tampilkan daftar data APD dengan fitur:
     * - Pencarian (nama, kode, jenis)
     * - Filter jenis APD
     * - Sorting
     * - Pagination yang mempertahankan query string
     * - Menampilkan jumlah detail (withCount)
     */
    public function index(Request $request)
    {
        $query = Apd::with(['jenis', 'createdBy', 'updatedBy'])
            ->withCount('details'); // ✅ Tambahkan ini di sini

        // 🔍 Filter pencarian (nama_apd, kode_apd, jenis_apd)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_apd', 'like', "%{$search}%")
                    ->orWhere('kode_apd', 'like', "%{$search}%")
                    ->orWhereHas('jenis', function ($q2) use ($search) {
                        $q2->where('nama_jenis', 'like', "%{$search}%");
                    });
            });
        }

        // 🎯 Filter berdasarkan jenis_id
        if ($request->filled('jenis_id')) {
            $query->where('jenis_id', $request->jenis_id);
        }

        // 🔁 Sorting
        $sortField = $request->get('sortField', 'id');
        $sortDirection = $request->get('sortDirection', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // 📄 Pagination (10 data per halaman) + Query string agar tidak hilang
        $apds = $query->paginate(10)
            ->onEachSide(1)
            ->withQueryString()
            ->through(function ($apd) {
                return [
                    'id' => $apd->id,
                    'jenis_apd' => $apd->jenis?->nama_jenis,
                    'nama_apd' => $apd->nama_apd,
                    'kode_apd' => $apd->kode_apd,
                    'deskripsi' => $apd->deskripsi,
                    'details_count' => $apd->details_count, // ✅ jumlah detail
                    'created_by' => $apd->createdBy?->name,
                    'updated_by' => $apd->updatedBy?->name,
                    'created_at' => optional($apd->created_at)->format('Y-m-d'),
                    'updated_at' => optional($apd->updated_at)->format('Y-m-d'),
                ];
            });

        // 🔹 Kirim ke Inertia + data filter aktif
        return inertia("Apd/Index", [
            'apds' => $apds,
            'jenisApds' => JenisApd::select('id', 'nama_jenis')->get(),
            'filters' => $request->only(['search', 'jenis_id', 'sortField', 'sortDirection']),
        ]);
    }

    /**
     * 🧩 Form tambah APD baru.
     */
    public function create()
    {
        return inertia("Apd/Create", [
            'jenisApds' => JenisApd::select('id', 'nama_jenis')->get(),
        ]);
    }

    /**
     * 💾 Simpan data APD baru.
     */
    public function store(StoreApdRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        Apd::create($data);

        return to_route('apd.index')->with('success', 'Data APD berhasil ditambahkan.');
    }

    /**
     * 🔍 Tampilkan detail APD.
     */
    public function show(Request $request, Apd $apd)
    {
        $apd->load('jenis', 'createdBy', 'updatedBy');

        // 📋 Query detail yang berelasi dengan APD ini
        $query = $apd->details();

        // 🔍 Pencarian berdasarkan nama/kode detail
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_detail', 'like', "%{$search}%")
                ->orWhere('kode_detail', 'like', "%{$search}%");
            });
        }

        // 🔁 Sorting
        $sortField = $request->get('sortField', 'id');
        $sortDirection = $request->get('sortDirection', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // 📄 Pagination
        $details = $query->paginate(10)
            ->onEachSide(1)
            ->withQueryString()
            ->through(fn($detail) => [
                'id' => $detail->id,
                'nama_detail' => $detail->nama_detail,
                'kode_detail' => $detail->kode_detail,
                'bahan' => $detail->bahan,
                'warna' => $detail->warna,
                'ukuran' => $detail->ukuran,
                'masa_penggunaan' => $detail->masa_penggunaan,
                'image_path' => $detail->image_path ? asset('storage/' . $detail->image_path) : null,
                'created_at' => optional($detail->created_at)->format('Y-m-d'),
            ]);

        return inertia('Apd/Show', [
            'apd' => [
                'id' => $apd->id,
                'jenis_apd' => $apd->jenis?->nama_jenis,
                'nama_apd' => $apd->nama_apd,
                'kode_apd' => $apd->kode_apd,
                'deskripsi' => $apd->deskripsi,
                'details_count' => $apd->details()->count(),
                'created_by' => $apd->createdBy?->name,
                'updated_by' => $apd->updatedBy?->name,
                'created_at' => optional($apd->created_at)->format('Y-m-d'),
                'updated_at' => optional($apd->updated_at)->format('Y-m-d'),
            ],
            'details' => $details,
            'filters' => $request->only(['search', 'sortField', 'sortDirection']),
        ]);
    }

    /**
     * ✏️ Form edit APD.
     */
    public function edit(Apd $apd)
    {
        return inertia('Apd/Edit', [
            'apd' => [
                'id' => $apd->id,
                'jenis_id' => $apd->jenis_id,
                'nama_apd' => $apd->nama_apd,
                'kode_apd' => $apd->kode_apd,
                'deskripsi' => $apd->deskripsi,
            ],
            'jenisApds' => JenisApd::select('id', 'nama_jenis')->get(),
        ]);
    }

    /**
     * 🔄 Update data APD.
     */
    public function update(UpdateApdRequest $request, Apd $apd)
    {
        $data = $request->validated();
        $data['updated_by'] = Auth::id();

        $apd->update($data);

        return to_route('apd.index')->with('success', "Data APD \"{$apd->nama_apd}\" berhasil diperbarui.");
    }

    /**
     * 🗑️ Hapus data APD.
     */
    public function destroy(Apd $apd)
    {
        $name = $apd->nama_apd;
        $apd->delete();

        return to_route('apd.index')->with('success', "Data APD \"$name\" berhasil dihapus.");
    }
}
