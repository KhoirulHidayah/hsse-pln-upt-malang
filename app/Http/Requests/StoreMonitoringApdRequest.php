<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMonitoringApdRequest extends FormRequest
{
    /**
     * Menentukan apakah user diizinkan melakukan request ini.
     */
    public function authorize(): bool
    {
        return true; // ✅ ubah ke true agar request bisa dijalankan
    }

    /**
     * Aturan validasi untuk penyimpanan Monitoring APD.
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
            'tanggal_berakhir'   => 'required|date|after_or_equal:tanggal_pemeriksaan',
            'kondisi'            => 'required|string|in:Baik,Rusak,Perlu Diganti',
            'catatan'            => 'nullable|string|max:255',
        ];
    }

    /**
     * Pesan error yang lebih mudah dipahami.
     */
    public function messages(): array
    {
        return [
            'apd_id.required' => 'Nama APD wajib dipilih.',
            'apd_detail_id.required' => 'Detail APD wajib dipilih.',
            'lokasi_id.required' => 'Lokasi wajib dipilih.',
            'gardu_induk_id.required' => 'Gardu Induk wajib dipilih.',
            'stok.required' => 'Jumlah stok wajib diisi.',
            'stok.integer' => 'Jumlah stok harus berupa angka.',
            'tanggal_distribusi.required' => 'Tanggal distribusi wajib diisi.',
            'tanggal_pemeriksaan.required' => 'Tanggal pemeriksaan wajib diisi.',
            'tanggal_berakhir.required' => 'Tanggal berakhir wajib diisi.',
            'tanggal_berakhir.after_or_equal' => 'Tanggal berakhir harus setelah atau sama dengan tanggal pemeriksaan.',
            'kondisi.required' => 'Kondisi wajib dipilih.',
        ];
    }
}
