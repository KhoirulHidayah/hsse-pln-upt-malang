<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApdResource extends JsonResource
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
            'id'           => $this->id,
            'jenis_id'     => $this->jenis_id,
            'jenis_apd'    => $this->jenis?->nama_jenis, // relasi ke jenis_apds
            'nama_apd'     => $this->nama_apd,
            'kode_apd'     => $this->kode_apd,
            'deskripsi'    => $this->deskripsi,
            'details'      => ApdDetailResource::collection($this->whenLoaded('details')), // relasi ke apd_details
            'created_at'   => Carbon::parse($this->created_at)->format('Y-m-d'),
            'updated_at'   => Carbon::parse($this->updated_at)->format('Y-m-d'),
            'createdBy'    => new UserResource($this->whenLoaded('createdBy')),
            'updatedBy'    => new UserResource($this->whenLoaded('updatedBy')),
        ];
    }
}
