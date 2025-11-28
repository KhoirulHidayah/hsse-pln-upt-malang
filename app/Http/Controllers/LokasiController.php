<?php

namespace App\Http\Controllers;

use App\Models\Lokasi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LokasiController extends Controller
{
    /**
     * 🧾 Tampilkan daftar lokasi dengan fitur search, sort, dan pagination.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sortField = $request->input('sortField', 'created_at');
        $sortDirection = $request->input('sortDirection', 'desc');

        // 🔹 Ambil semua lokasi + jumlah gardu induk terkait
        $query = Lokasi::withCount('garduInduk');

        // 🔍 Filter pencarian berdasarkan nama lokasi
        if ($search) {
            $query->where('nama_lokasi', 'like', "%{$search}%");
        }

        // 🔁 Sorting
        if ($sortField === 'jumlah_gardu_induk' || $sortField === 'gardu_induk_count') {
            $query->orderBy('gardu_induk_count', $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        // 📄 Pagination
        $lokasis = $query->paginate(10)->withQueryString();

        return Inertia::render('Lokasi/Index', [
            'lokasis' => $lokasis,
            'filters' => $request->only(['search', 'sortField', 'sortDirection']),
        ]);
    }

    /**
     * 🧩 Form tambah lokasi baru.
     */
    public function create()
    {
        return Inertia::render('Lokasi/Create');
    }

    /**
     * 💾 Simpan data lokasi baru.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_lokasi' => 'required|string|max:255',
        ]);

        Lokasi::create($request->only('nama_lokasi'));

        return redirect()->route('lokasi.index')
            ->with('success', 'Data lokasi berhasil ditambahkan.');
    }

    /**
     * 🔍 Tampilkan detail lokasi tertentu.
     */
    public function show(Lokasi $lokasi)
    {
        // Hitung jumlah gardu induk terkait
        $lokasi->loadCount('garduInduk');

        return Inertia::render('Lokasi/Show', [
            'lokasi' => [
                'lokasi_id' => $lokasi->lokasi_id,
                'nama_lokasi' => $lokasi->nama_lokasi,
                'gardu_induk_count' => $lokasi->gardu_induk_count,
                'created_at' => optional($lokasi->created_at)->format('Y-m-d H:i:s'),
                'updated_at' => optional($lokasi->updated_at)->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * ✏️ Form edit lokasi.
     */
    public function edit(Lokasi $lokasi)
    {
        return Inertia::render('Lokasi/Edit', ['lokasi' => $lokasi]);
    }

    /**
     * 🔄 Update data lokasi.
     */
    public function update(Request $request, Lokasi $lokasi)
    {
        $request->validate([
            'nama_lokasi' => 'required|string|max:255',
        ]);

        $lokasi->update($request->only('nama_lokasi'));

        return redirect()->route('lokasi.index')
            ->with('success', 'Data lokasi berhasil diperbarui.');
    }

    /**
     * 🗑️ Hapus data lokasi.
     */
    public function destroy(Lokasi $lokasi)
    {
        $lokasi->delete();

        return redirect()->route('lokasi.index')
            ->with('success', 'Data lokasi berhasil dihapus.');
    }
}
