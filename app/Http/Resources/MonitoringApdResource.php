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
            // ID Utama
            'monitoring_id'       => $this->monitoring_id,
            
            // Data APD (hanya dari 1 tabel apds)
            'apd_id'              => $this->apd_id,
            'nama_apd'            => $this->apd?->nama_apd,
            'kode_apd'            => $this->apd?->kode_apd,
            'gambar_apd'          => $this->apd?->gambar 
                                     ? asset('storage/' . $this->apd->gambar) 
                                     : null,
            'deskripsi_apd'       => $this->apd?->deskripsi,
            'standar_apd'         => $this->apd?->standar,
            'masa_penggunaan'     => $this->apd?->masa_penggunaan,
            
            // Data User/Pemakai
            'user_id'             => $this->user_id,
            'nama_user'           => $this->user?->name,
            'email_user'          => $this->user?->email,
            
            // Data Lokasi
            'lokasi_id'           => $this->lokasi_id,
            'nama_lokasi'         => $this->lokasi?->nama_lokasi,
            'kode_lokasi'         => $this->lokasi?->kode_lokasi,
            
            // Data Gardu Induk
            'gardu_induk_id'      => $this->gardu_induk_id,
            'nama_gardu_induk'    => $this->garduInduk?->nama_gardu_induk,
            
            // Data Monitoring
            'stok'                => $this->stok,
            'tanggal_distribusi'  => $this->tanggal_distribusi,
            'tanggal_pemeriksaan' => $this->tanggal_pemeriksaan,
            'tanggal_berakhir'    => $this->tanggal_berakhir,
            'kondisi'             => $this->kondisi,
            'catatan'             => $this->catatan,
            
            // Status Notifikasi (dari database dan kalkulasi otomatis)
            'status_notifikasi'           => $this->status_notifikasi,
            'status_notifikasi_otomatis'  => $this->status_notifikasi_otomatis,
            'status_color'                => $this->status_color ?? $this->getStatusColor(),
            
            // Metadata
            'created_at'          => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'          => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }

    /**
     * Helper untuk mendapatkan warna status
     */
    private function getStatusColor(): string
    {
        $status = $this->status_notifikasi ?? $this->status_notifikasi_otomatis;
        
        return match($status) {
            'Active' => 'success',
            'Warning' => 'warning',
            'Expired' => 'danger',
            default => 'secondary'
        };
    }
}