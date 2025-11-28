<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class ApdDetailResource extends JsonResource
{
    public static $wrap = false;

    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'apd_id'           => $this->apd_id,
            'nama_detail'      => $this->nama_detail,
            'kode_detail'      => $this->kode_detail,
            'standar'          => $this->standar,
            'bahan'            => $this->bahan,
            'warna'            => $this->warna,
            'ukuran'           => $this->ukuran,
            'kemampuan'        => $this->kemampuan,
            'masa_penggunaan'  => $this->masa_penggunaan,
            'fungsi'           => $this->fungsi,
            'keterangan'       => $this->keterangan,

            // ✅ Versi aman dan fleksibel untuk URL gambar
            'image_path'  => $this->gambar
                ? Storage::url(str_replace('storage/', '', $this->gambar))
                : null,

            'created_at'   => Carbon::parse($this->created_at)->format('Y-m-d'),
            'updated_at'   => Carbon::parse($this->updated_at)->format('Y-m-d'),
        ];
    } 
}
