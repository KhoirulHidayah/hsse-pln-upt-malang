<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGarduIndukRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna diizinkan membuat data baru.
     */
    public function authorize(): bool
    {
        // ✅ Ubah ke true agar request ini bisa dijalankan
        return true;
    }

    /**
     * Aturan validasi untuk penyimpanan data Gardu Induk baru.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'lokasi_id' => 'required|exists:lokasis,lokasi_id',
            'nama_gardu_induk' => 'required|string|max:100',
        ];
    }

    /**
     * Pesan kesalahan kustom untuk validasi.
     */
    public function messages(): array
    {
        return [
            'lokasi_id.required' => 'Lokasi harus dipilih.',
            'lokasi_id.exists' => 'Lokasi yang dipilih tidak valid.',
            'nama_gardu_induk.required' => 'Nama Gardu Induk wajib diisi.',
            'nama_gardu_induk.max' => 'Nama Gardu Induk tidak boleh lebih dari 100 karakter.',
        ];
    }
}
