<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ApdResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'jenis_id'        => $this->jenis_id,
            'jenis_apd'       => $this->jenis?->nama_jenis,

            // Informasi dasar
            'nama_apd'        => $this->nama_apd,
            'kode_apd'        => $this->kode_apd,
            'deskripsi'       => $this->deskripsi,
            'gambar'          => $this->gambar 
                ? Storage::url($this->gambar)
                : null,

            // Spesifikasi APD
            'bahan'           => $this->bahan,
            'warna'           => $this->warna,
            'ukuran'          => $this->ukuran,
            'kemampuan'       => $this->kemampuan,
            'fungsi'          => $this->fungsi,

            // Standar dan penggunaan
            'standar'         => $this->standar,
            'masa_penggunaan' => $this->masa_penggunaan,

            // Relasi
            'createdBy'       => new UserResource($this->whenLoaded('createdBy')),
            'updatedBy'       => new UserResource($this->whenLoaded('updatedBy')),

            // Tanggal
            'created_at'      => Carbon::parse($this->created_at)->format('Y-m-d'),
            'updated_at'      => Carbon::parse($this->updated_at)->format('Y-m-d'),
        ];
    }
}