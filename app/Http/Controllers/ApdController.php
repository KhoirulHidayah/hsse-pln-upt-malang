<?php

namespace App\Http\Controllers;

use App\Models\Apd;
use App\Models\JenisApd;
use App\Http\Requests\StoreApdRequest;
use App\Http\Requests\UpdateApdRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ApdController extends Controller
{
    /**
     * LIST APD
     */
    public function index(Request $request)
    {
        $query = Apd::with(['jenis', 'createdBy', 'updatedBy']);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_apd', 'like', "%{$search}%")
                    ->orWhere('kode_apd', 'like', "%{$search}%")
                    ->orWhere('bahan', 'like', "%{$search}%")
                    ->orWhere('warna', 'like', "%{$search}%")
                    ->orWhereHas('jenis', function ($q2) use ($search) {
                        $q2->where('nama_jenis', 'like', "%{$search}%");
                    });
            });
        }

        // Filter jenis
        if ($request->filled('jenis_id')) {
            $query->where('jenis_id', $request->jenis_id);
        }

        // Sorting
        $sortField = $request->get('sortField', 'id');
        $sortDirection = $request->get('sortDirection', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
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
                    'bahan' => $apd->bahan,
                    'warna' => $apd->warna,
                    'ukuran' => $apd->ukuran,
                    'kemampuan' => $apd->kemampuan,
                    'standar' => $apd->standar,
                    'masa_penggunaan' => $apd->masa_penggunaan,
                    'gambar' => $apd->gambar ? Storage::url($apd->gambar) : null,
                    'created_by' => $apd->createdBy?->name,
                    'updated_by' => $apd->updatedBy?->name,
                    'created_at' => optional($apd->created_at)->format('Y-m-d'),
                    'updated_at' => optional($apd->updated_at)->format('Y-m-d'),
                ];
            });

        return inertia("Apd/Index", [
            'apds' => $apds,
            'jenisApds' => JenisApd::select('id', 'nama_jenis')->get(),
            'filters' => $request->only(['search', 'jenis_id', 'sortField', 'sortDirection']),
        ]);
    }

    /**
     * FORM CREATE APD
     */
    public function create()
    {
        return inertia("Apd/Create", [
            'jenisApds' => JenisApd::select('id', 'nama_jenis')->get(),
        ]);
    }

    /**
     * STORE APD BARU
     */
    public function store(StoreApdRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        // Upload gambar
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('apd', 'public');
        }

        Apd::create($data);

        return to_route('apd.index')->with('success', 'Data APD berhasil ditambahkan.');
    }

    /**
     * SHOW APD
     */
    public function show(Request $request, Apd $apd)
    {
        $apd->load('jenis', 'createdBy', 'updatedBy');

        return inertia('Apd/Show', [
            'apd' => [
                'id' => $apd->id,
                'jenis_apd' => $apd->jenis?->nama_jenis,
                'nama_apd' => $apd->nama_apd,
                'kode_apd' => $apd->kode_apd,
                'deskripsi' => $apd->deskripsi,
                'bahan' => $apd->bahan,
                'warna' => $apd->warna,
                'ukuran' => $apd->ukuran,
                'kemampuan' => $apd->kemampuan,
                'fungsi' => $apd->fungsi,
                'standar' => $apd->standar,
                'masa_penggunaan' => $apd->masa_penggunaan,
                'gambar' => $apd->gambar ? Storage::url($apd->gambar) : null,
                'createdBy' => [
                    'name' => $apd->createdBy?->name
                ],
                'updatedBy' => [
                    'name' => $apd->updatedBy?->name
                ],
                'created_at' => optional($apd->created_at)->format('Y-m-d'),
                'updated_at' => optional($apd->updated_at)->format('Y-m-d'),
            ],
        ]);
    }

    /**
     * EDIT APD
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
                'bahan' => $apd->bahan,
                'warna' => $apd->warna,
                'ukuran' => $apd->ukuran,
                'kemampuan' => $apd->kemampuan,
                'fungsi' => $apd->fungsi,
                'standar' => $apd->standar,
                'masa_penggunaan' => $apd->masa_penggunaan,
                'gambar' => $apd->gambar ? Storage::url($apd->gambar) : null,
            ],
            'jenisApds' => JenisApd::select('id', 'nama_jenis')->get(),
        ]);
    }

    /**
     * UPDATE APD
     */
    public function update(UpdateApdRequest $request, Apd $apd)
    {
        $data = $request->validated();
        $data['updated_by'] = Auth::id();

        // Jika upload gambar baru
        if ($request->hasFile('gambar')) {

            // Hapus gambar lama
            if ($apd->gambar && Storage::disk('public')->exists($apd->gambar)) {
                Storage::disk('public')->delete($apd->gambar);
            }

            // Simpan gambar baru
            $data['gambar'] = $request->file('gambar')->store('apd', 'public');
        } else {
            // Jangan hapus gambar lama, jangan ubah field gambar
            unset($data['gambar']);
        }

        $apd->update($data);

        return to_route('apd.index')->with('success', "Data APD \"{$apd->nama_apd}\" berhasil diperbarui.");
    }

    /**
     * DELETE APD
     */
    public function destroy(Apd $apd)
    {
        if ($apd->gambar && Storage::disk('public')->exists($apd->gambar)) {
            Storage::disk('public')->delete($apd->gambar);
        }

        $name = $apd->nama_apd;
        $apd->delete();

        return to_route('apd.index')->with('success', "Data APD \"$name\" berhasil dihapus.");
    }
}