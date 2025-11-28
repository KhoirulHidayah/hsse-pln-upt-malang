<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMonitoringApdRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna diizinkan untuk melakukan request ini.
     */
    public function authorize(): bool
    {
        // ✅ Izinkan semua user yang sudah login melakukan update
        return true;
    }

    /**
     * Aturan validasi untuk update Monitoring APD.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'apd_id'             => 'required|exists:apds,id',
            'apd_detail_id'      => 'required|exists:apd_details,id',
            'lokasi_id'          => 'required|exists:lokasis,lokasi_id',
            'gardu_induk_id'     => 'required|exists:gardu_induks,gardu_induk_id',
            'stok'               => 'required|integer|min:1',
            'tanggal_distribusi' => 'required|date',
            'tanggal_pemeriksaan'=> 'required|date',
            'tanggal_berakhir'   => 'required|date|after_or_equal:tanggal_distribusi',
            'kondisi'            => 'required|string|in:Baik,Rusak,Perlu Diganti',
            'catatan'            => 'nullable|string|max:1000',
        ];
    }

    /**
     * Pesan error kustom untuk validasi.
     */
    public function messages(): array
    {
        return [
            'apd_id.required'              => 'Nama APD wajib dipilih.',
            'apd_detail_id.required'       => 'Detail APD wajib dipilih.',
            'lokasi_id.required'           => 'Lokasi wajib dipilih.',
            'gardu_induk_id.required'      => 'Gardu Induk wajib dipilih.',
            'stok.required'                => 'Jumlah stok wajib diisi.',
            'stok.integer'                 => 'Jumlah stok harus berupa angka.',
            'tanggal_distribusi.required'  => 'Tanggal distribusi wajib diisi.',
            'tanggal_pemeriksaan.required' => 'Tanggal pemeriksaan wajib diisi.',
            'tanggal_berakhir.required'    => 'Tanggal berakhir wajib diisi.',
            'tanggal_berakhir.after_or_equal' => 'Tanggal berakhir tidak boleh sebelum tanggal distribusi.',
            'kondisi.required'             => 'Kondisi wajib dipilih.',
            'catatan.max'                  => 'Catatan maksimal 1000 karakter.',
        ];
    }
}
