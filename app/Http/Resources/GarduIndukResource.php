<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class GarduIndukResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'gardu_induk_id'   => $this->gardu_induk_id,
            'lokasi_id'        => $this->lokasi_id,
            'nama_gardu_induk' => $this->nama_gardu_induk,

            // ✅ Relasi ke tabel lokasi (bisa di-load dengan with('lokasi'))
            'lokasi' => new LokasiResource($this->whenLoaded('lokasi')),

            // ✅ Format tanggal hanya tahun-bulan-tanggal
            'created_at' => $this->created_at ? Carbon::parse($this->created_at)->format('Y-m-d') : null,
            'updated_at' => $this->updated_at ? Carbon::parse($this->updated_at)->format('Y-m-d') : null,
        ];
    }
}
