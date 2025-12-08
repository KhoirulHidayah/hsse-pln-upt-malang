<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SerahTerimaDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->detail_id,
            'item_nama'  => $this->item_nama,
            'item_merk'  => $this->item_merk,
            'jumlah'     => $this->jumlah,
            'keadaan'    => $this->keadaan,
            'cek'        => (bool) $this->cek, // Kolom baru, dikonversi ke boolean
            'created_at' => optional($this->created_at)->format('Y-m-d H:i:s'), // Format diperluas
            'updated_at' => optional($this->updated_at)->format('Y-m-d H:i:s'), // Format diperluas
        ];
    }
}