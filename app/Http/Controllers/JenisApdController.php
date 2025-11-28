<?php

namespace App\Http\Controllers;

use App\Models\JenisApd;
use App\Http\Requests\StoreJenisApdRequest;
use App\Http\Requests\UpdateJenisApdRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JenisApdController extends Controller
{
    /**
     * Tampilkan daftar Jenis APD dengan fitur search, sort, dan pagination.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sortField = $request->input('sortField', 'created_at');
        $sortDirection = $request->input('sortDirection', 'desc');

        // Ambil semua jenis APD + jumlah APD terkait
        $query = JenisApd::withCount('apds'); // menambahkan kolom apds_count

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_jenis', 'like', "%{$search}%")
                  ->orWhere('deskripsi', 'like', "%{$search}%");
            });
        }

        // Sorting
        if ($sortField === 'jumlah_apd' || $sortField === 'apds_count') {
            $query->orderBy('apds_count', $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        $jenisApds = $query->paginate(10)->withQueryString();

        return inertia('JenisApd/Index', [
            'jenisApds' => $jenisApds,
            'filters' => $request->only(['search', 'sortField', 'sortDirection']),
        ]);
    }

    public function create()
    {
        return Inertia::render('JenisApd/Create');
    }

    public function store(StoreJenisApdRequest $request)
    {
        JenisApd::create($request->validated());
        return redirect()->route('jenis-apd.index')
            ->with('success', 'Jenis APD berhasil ditambahkan.');
    }

    public function show(JenisApd $jenisApd)
    {
        return Inertia::render('JenisApd/Show', [
            'jenisApd' => [
                'id' => $jenisApd->id,
                'nama_jenis' => $jenisApd->nama_jenis,
                'deskripsi' => $jenisApd->deskripsi,
                'apds_count' => $jenisApd->apds()->count(), 
                'created_at' => $jenisApd->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $jenisApd->updated_at?->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    public function edit(JenisApd $jenisApd)
    {
        return Inertia::render('JenisApd/Edit', ['jenisApd' => $jenisApd]);
    }

    public function update(UpdateJenisApdRequest $request, JenisApd $jenisApd)
    {
        $jenisApd->update($request->validated());
        return redirect()->route('jenis-apd.index')
            ->with('success', 'Jenis APD berhasil diperbarui.');
    }

    public function destroy(JenisApd $jenisApd)
    {
        $jenisApd->delete();
        return redirect()->route('jenis-apd.index')
            ->with('success', 'Jenis APD berhasil dihapus.');
    }
}
