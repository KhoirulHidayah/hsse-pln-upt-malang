<?php

namespace App\Http\Controllers;

use App\Models\ApdDetail;
use App\Models\Apd;
use App\Http\Requests\StoreApdDetailRequest;
use App\Http\Requests\UpdateApdDetailRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ApdDetailController extends Controller
{
    /**
     * 🧾 Tampilkan daftar detail APD (dapat difilter berdasarkan APD).
     */
    public function index(Request $request)
    {
        $query = ApdDetail::with('apd');

        // 🔍 Filter pencarian
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_detail', 'like', "%{$search}%")
                    ->orWhere('kode_detail', 'like', "%{$search}%");
            });
        }

        // 🎯 Filter berdasarkan APD
        if ($request->filled('apd_id')) {
            $query->where('apd_id', $request->apd_id);
        }

        // 🔁 Sorting
        $sortField = $request->get('sortField', 'id');
        $sortDirection = $request->get('sortDirection', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // 📄 Pagination
        $details = $query->paginate(10)
            ->onEachSide(1)
            ->withQueryString()
            ->through(fn($d) => [
                'id'              => $d->id,
                'apd_nama'        => $d->apd?->nama_apd,
                'nama_detail'     => $d->nama_detail,
                'kode_detail'     => $d->kode_detail,
                'standar'         => $d->standar,
                'bahan'           => $d->bahan,
                'warna'           => $d->warna,
                'ukuran'          => $d->ukuran,
                'masa_penggunaan' => $d->masa_penggunaan,
                'image_path'      => $d->gambar ? Storage::url($d->gambar) : null,
                'created_at'      => optional($d->created_at)->format('Y-m-d'),
                'updated_at'      => optional($d->updated_at)->format('Y-m-d'),
            ]);

        return inertia('ApdDetail/Index', [
            'details' => $details,
            'apds' => Apd::select('id', 'nama_apd')->get(),
            'filters' => $request->only(['search', 'apd_id', 'sortField', 'sortDirection']),
        ]);
    }

    /**
     * 🧩 Form tambah detail APD.
     */
    public function create()
    {
        return inertia('ApdDetail/Create', [
            'apds' => Apd::select('id', 'nama_apd')->get(),
        ]);
    }

    /**
     * 💾 Simpan data detail APD baru.
     */
    public function store(StoreApdDetailRequest $request)
    {
        $data = $request->validated();

        // ✅ Upload gambar (jika ada)
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('apd', 'public');
        }

        ApdDetail::create($data);

        return to_route('detail.index')->with('success', 'Detail APD berhasil ditambahkan.');
    }

    /**
     * 🔍 Tampilkan detail spesifik APD Detail.
     */
    public function show(ApdDetail $detail)
    {
        return inertia('ApdDetail/Show', [
            'detail' => [
                'id'              => $detail->id,
                'apd_nama'        => $detail->apd?->nama_apd,
                'nama_detail'     => $detail->nama_detail,
                'kode_detail'     => $detail->kode_detail,
                'standar'         => $detail->standar,
                'bahan'           => $detail->bahan,
                'warna'           => $detail->warna,
                'ukuran'          => $detail->ukuran,
                'kemampuan'       => $detail->kemampuan,
                'masa_penggunaan' => $detail->masa_penggunaan,
                'fungsi'          => $detail->fungsi,
                'keterangan'      => $detail->keterangan,
                'gambar'          => $detail->gambar ? Storage::url($detail->gambar) : null,
                'created_at'      => optional($detail->created_at)->format('Y-m-d'),
                'updated_at'      => optional($detail->updated_at)->format('Y-m-d'),
            ]
        ]);
    }

    /**
     * ✏️ Form edit detail APD.
     */
    public function edit(ApdDetail $detail)
    {
        return inertia('ApdDetail/Edit', [
            'detail' => [
                'id'              => $detail->id,
                'apd_id'          => $detail->apd_id,
                'nama_detail'     => $detail->nama_detail,
                'kode_detail'     => $detail->kode_detail,
                'standar'         => $detail->standar,
                'bahan'           => $detail->bahan,
                'warna'           => $detail->warna,
                'ukuran'          => $detail->ukuran,
                'kemampuan'       => $detail->kemampuan,
                'masa_penggunaan' => $detail->masa_penggunaan,
                'fungsi'          => $detail->fungsi,
                'keterangan'      => $detail->keterangan,
                'gambar'          => $detail->gambar ? Storage::url($detail->gambar) : null,
            ],
            'apds' => Apd::select('id', 'nama_apd')->get(),
        ]);
    }

    /**
     * 🔄 Update data detail APD.
     */
    public function update(UpdateApdDetailRequest $request, ApdDetail $detail)
    {
        $data = $request->validated();

        // ✅ Jika ada file gambar baru
        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika ada dan file-nya masih ada di storage
            if ($detail->gambar && Storage::disk('public')->exists($detail->gambar)) {
                Storage::disk('public')->delete($detail->gambar);
            }

            // Simpan gambar baru ke folder 'apd'
            $data['gambar'] = $request->file('gambar')->store('app', 'public');
        } else {
            // ✅ Jika tidak ada file baru, gunakan gambar lama
            $data['gambar'] = $detail->gambar;
        }

        // Update semua data detail APD
        $detail->update($data);

        return to_route('detail.index')->with('success', 'Detail APD berhasil diperbarui.');
    }

    /**
     * 🗑️ Hapus detail APD beserta gambarnya.
     */
    public function destroy(ApdDetail $detail)
    {
        if ($detail->gambar && Storage::disk('public')->exists($detail->gambar)) {
            Storage::disk('public')->delete($detail->gambar);
        }

        $nama = $detail->nama_detail;
        $detail->delete();

        return to_route('detail.index')->with('success', "Detail APD \"$nama\" berhasil dihapus.");
    }
}
