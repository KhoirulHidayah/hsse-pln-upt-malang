<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SerahTerimaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->serah_terima_id,
            'no_seri'          => $this->no_seri, // Kolom baru
            'no_dokumen'       => $this->no_dokumen,
            'status_dokumen'   => $this->status_dokumen, // Kolom baru
            'copy_no'          => $this->copy_no, // Kolom baru
            'nomor_revisi'     => $this->nomor_revisi, // Kolom baru
            'nomor_edisi'      => $this->nomor_edisi, // Kolom baru
            'tanggal_efektif'  => $this->tanggal_efektif, // Kolom baru
            'tanggal'          => $this->tanggal,
            'nama_penerima'    => $this->nama_penerima,
            'jabatan_pengirim' => $this->jabatan_pengirim,
            'nama_pengirim'    => $this->nama_pengirim,
            'lokasi'           => $this->lokasi, // Kolom baru
            'created_at'       => optional($this->created_at)->format('Y-m-d H:i:s'), // Format diperluas
            'updated_at'       => optional($this->updated_at)->format('Y-m-d H:i:s'), // Format diperluas

            // Relasi: Menampilkan semua detail item (menggunakan `details` relasi)
            'items' => SerahTerimaDetailResource::collection($this->whenLoaded('details')),
        ];
    }
}