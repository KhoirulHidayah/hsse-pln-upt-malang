<?php

namespace App\Http\Controllers;

use App\Models\SerahTerima;
use App\Models\SerahTerimaDetail;
use App\Models\DokumenConfig;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Http\Requests\StoreSerahTerimaRequest;
use App\Http\Requests\UpdateSerahTerimaRequest;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class SerahTerimaController extends Controller
{
    public function index(Request $request)
    {
        $query = SerahTerima::query()->with('details');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('no_seri', 'like', "%{$search}%")
                  ->orWhere('no_dokumen', 'like', "%{$search}%")
                  ->orWhere('nama_penerima', 'like', "%{$search}%")
                  ->orWhere('nama_pengirim', 'like', "%{$search}%");
            });
        }

        $sortField = $request->get('sortField', 'tanggal');
        $sortDirection = $request->get('sortDirection', 'desc');

        $query->orderBy($sortField, $sortDirection);

        $data = $query->paginate(10)
            ->withQueryString()
            ->through(fn($row) => [
                'id'                  => $row->serah_terima_id,
                'no_seri'             => $row->no_seri,
                'no_dokumen'          => $row->no_dokumen,
                'tanggal'             => $row->tanggal->format('Y-m-d'),
                'nama_penerima'       => $row->nama_penerima,
                'nama_pengirim'       => $row->nama_pengirim,
                'status_dokumen'      => $row->status_dokumen_display, 
                'lokasi'              => $row->lokasi,
                'total_item'          => $row->details->count(),
            ]);

        return inertia('SerahTerima/Index', [
            'data'    => $data,
            'filters' => $request->only(['search', 'sortField', 'sortDirection']),
        ]);
    }

    public function create()
    {
        $configs = [
            'no_dokumen_default' => DokumenConfig::getValue('no_dokumen_default'),
            'nomor_revisi_default' => DokumenConfig::getValue('nomor_revisi_default'),
            'nomor_edisi_default' => DokumenConfig::getValue('nomor_edisi_default'),
            'unit_induk' => DokumenConfig::getValue('unit_induk'),
            'unit_pelaksana' => DokumenConfig::getValue('unit_pelaksana'),
            'no_seri_suggestion' => SerahTerima::generateNoSeri(),
            'tanggal_efektif_default' => '2019-02-15',
        ];

        return inertia('SerahTerima/Create', [
            'configs' => $configs
        ]);
    }

    public function store(StoreSerahTerimaRequest $request)
    {
        DB::beginTransaction();

        try {
            $serah = SerahTerima::create([
                'no_seri'           => $request->no_seri ?? SerahTerima::generateNoSeri(), 
                'no_dokumen'        => $request->no_dokumen,
                'status_dokumen'    => $request->status_dokumen,
                'copy_no'           => $request->copy_no,
                'nomor_revisi'      => $request->nomor_revisi,
                'nomor_edisi'       => $request->nomor_edisi,
                'tanggal_efektif'   => $request->tanggal_efektif,
                'tanggal'           => $request->tanggal,
                'nama_penerima'     => $request->nama_penerima,
                'jabatan_pengirim'  => $request->jabatan_pengirim,
                'nama_pengirim'     => $request->nama_pengirim,
                'lokasi'            => $request->lokasi ?? 'Malang',
            ]);

            foreach ($request->items as $item) {
                SerahTerimaDetail::create([
                    'serah_terima_id' => $serah->serah_terima_id,
                    'item_nama'       => $item['item_nama'],
                    'item_merk'       => $item['item_merk'] ?? null,
                    'jumlah'          => $item['jumlah'],
                    'keadaan'         => $item['keadaan'] ?? null,
                    'cek'             => $item['cek'] ?? true,
                ]);
            }

            DB::commit();
            return to_route('serah-terima.index')->with('success', 'Transaksi berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function show($id)
    {
        $row = SerahTerima::with('details')->findOrFail($id);

        return inertia('SerahTerima/Show', [
            'data' => [
                'id'                  => $row->serah_terima_id,
                'no_seri'             => $row->no_seri,
                'no_dokumen'          => $row->no_dokumen,
                'status_dokumen'      => $row->status_dokumen,
                'status_dokumen_display' => $row->status_dokumen_display,
                'copy_no'             => $row->copy_no,
                'nomor_revisi'        => $row->nomor_revisi,
                'nomor_edisi'         => $row->nomor_edisi,
                'tanggal_efektif'     => $row->tanggal_efektif?->format('Y-m-d'),
                'tanggal'             => $row->tanggal->format('Y-m-d'),
                'nama_penerima'       => $row->nama_penerima,
                'jabatan_pengirim'    => $row->jabatan_pengirim,
                'nama_pengirim'       => $row->nama_pengirim,
                'lokasi'              => $row->lokasi,
                'created_at'          => $row->created_at?->format('Y-m-d H:i:s'),
                'updated_at'          => $row->updated_at?->format('Y-m-d H:i:s'),
                'items'               => $row->details->map(fn($i) => [
                    'id'         => $i->detail_id,
                    'item_nama'  => $i->item_nama,
                    'item_merk'  => $i->item_merk,
                    'jumlah'     => $i->jumlah,
                    'keadaan'    => $i->keadaan,
                    'cek'        => (bool) $i->cek,
                ]),
            ],
        ]);
    }

    public function edit($id)
    {
        $row = SerahTerima::with('details')->findOrFail($id);

        return inertia('SerahTerima/Edit', [
            'data' => [
                'id'                  => $row->serah_terima_id,
                'no_seri'             => $row->no_seri,
                'no_dokumen'          => $row->no_dokumen,
                'status_dokumen'      => $row->status_dokumen,
                'copy_no'             => $row->copy_no,
                'nomor_revisi'        => $row->nomor_revisi,
                'nomor_edisi'         => $row->nomor_edisi,
                'tanggal_efektif'     => $row->tanggal_efektif?->format('Y-m-d'),
                'tanggal'             => $row->tanggal->format('Y-m-d'),
                'nama_penerima'       => $row->nama_penerima,
                'jabatan_pengirim'    => $row->jabatan_pengirim,
                'nama_pengirim'       => $row->nama_pengirim,
                'lokasi'              => $row->lokasi,
                'items'               => $row->details->map(fn($i) => [
                    'id'         => $i->detail_id,
                    'item_nama'  => $i->item_nama,
                    'item_merk'  => $i->item_merk,
                    'jumlah'     => $i->jumlah,
                    'keadaan'    => $i->keadaan,
                    'cek'        => (bool) $i->cek,
                ]),
            ],
        ]);
    }

    public function update(UpdateSerahTerimaRequest $request, $id)
    {
        DB::beginTransaction();

        try {
            $row = SerahTerima::findOrFail($id);

            $row->update([
                'no_seri'           => $request->no_seri,
                'no_dokumen'        => $request->no_dokumen,
                'status_dokumen'    => $request->status_dokumen,
                'copy_no'           => $request->copy_no,
                'nomor_revisi'      => $request->nomor_revisi,
                'nomor_edisi'       => $request->nomor_edisi,
                'tanggal_efektif'   => $request->tanggal_efektif,
                'tanggal'           => $request->tanggal,
                'nama_penerima'     => $request->nama_penerima,
                'jabatan_pengirim'  => $request->jabatan_pengirim,
                'nama_pengirim'     => $request->nama_pengirim,
                'lokasi'            => $request->lokasi,
            ]);

            // Delete existing details and recreate
            SerahTerimaDetail::where('serah_terima_id', $id)->delete();

            foreach ($request->items as $item) {
                SerahTerimaDetail::create([
                    'serah_terima_id' => $row->serah_terima_id,
                    'item_nama'       => $item['item_nama'],
                    'item_merk'       => $item['item_merk'] ?? null,
                    'jumlah'          => $item['jumlah'],
                    'keadaan'         => $item['keadaan'] ?? null,
                    'cek'             => $item['cek'] ?? true,
                ]);
            }

            DB::commit();
            return to_route('serah-terima.index')->with('success', 'Data berhasil diperbarui.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function previewPdf($id)
    {
        $row = SerahTerima::with('details')->findOrFail($id);
        
        $configs = [
            'unit_induk' => DokumenConfig::getValue('unit_induk'),
            'unit_pelaksana' => DokumenConfig::getValue('unit_pelaksana'),
        ];

        // Render view
        $html = view('pdf.serah-terima', [
            'data' => $row,
            'configs' => $configs
        ])->render();

        // Load ke PDF dengan options lengkap
        $pdf = Pdf::loadHTML($html)
            ->setPaper('A4', 'portrait')
            ->setOptions([
                'defaultFont' => 'Arial',
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'chroot' => public_path(),
                'enable_php' => false,
                'dpi' => 96,
            ]);

        // Stream PDF untuk preview di browser (inline)
        $clean = preg_replace('/[^\w\d\-]/', '-', $row->no_seri);
        return $pdf->stream("Preview-Serah-Terima-{$clean}.pdf");
    }


public function exportPdf($id)
{
    $row = SerahTerima::with('details')->findOrFail($id);

    $configs = [
        'unit_induk' => DokumenConfig::getValue('unit_induk'),
        'unit_pelaksana' => DokumenConfig::getValue('unit_pelaksana'),
    ];

    $pdf = Pdf::loadView('pdf.serah-terima', [
            'data' => $row,
            'configs' => $configs
        ])
        ->setPaper('A4', 'portrait')
        ->setOptions([
            'defaultFont' => 'Arial',
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true,
            'chroot' => public_path(), // ⬅️ PENTING
            'dpi' => 96,
        ]);

    $clean = preg_replace('/[^\w\d\-]/', '-', $row->no_seri);

    return $pdf->download("Serah-Terima-{$clean}.pdf");
}

}