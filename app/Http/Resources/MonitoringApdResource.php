<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MonitoringApdResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'monitoring_id'       => $this->monitoring_id,
            'apd_id'              => $this->apd_id,
            'apd_nama'            => $this->apd?->nama_apd,
            'apd_detail_id'       => $this->apd_detail_id,
            'apd_detail_nama'     => $this->apdDetail?->nama_detail,
            'user_id'             => $this->user_id,
            'nama_user'           => $this->user?->name,
            'lokasi_id'           => $this->lokasi_id,
            'nama_lokasi'         => $this->lokasi?->nama_lokasi,
            'gardu_induk_id'      => $this->gardu_induk_id,
            'nama_gardu_induk'    => $this->garduInduk?->nama_gardu_induk,
            'stok'                => $this->stok,
            'tanggal_distribusi'  => $this->tanggal_distribusi,
            'tanggal_pemeriksaan' => $this->tanggal_pemeriksaan,
            'tanggal_berakhir'    => $this->tanggal_berakhir,
            'kondisi'             => $this->kondisi,
            'catatan'             => $this->catatan,
            'status_notifikasi'   => $this->status_notifikasi_otomatis,

            // opsional untuk debugging atau kebutuhan frontend
            'created_at'          => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'          => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
