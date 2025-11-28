<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LokasiResource extends JsonResource
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
            'lokasi_id'   => $this->lokasi_id,
            'nama_lokasi' => $this->nama_lokasi,
            'created_at'  => Carbon::parse($this->created_at)->format('Y-m-d'),
            'updated_at'  => Carbon::parse($this->updated_at)->format('Y-m-d'),
            // Jika nanti ada relasi user pembuat atau pengubah data, bisa tambahkan seperti ini:
            // 'createdBy'   => new UserResource($this->whenLoaded('createdBy')),
            // 'updatedBy'   => new UserResource($this->whenLoaded('updatedBy')),
        ];
    }
}
