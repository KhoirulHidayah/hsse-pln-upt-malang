<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGarduIndukRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna berwenang melakukan permintaan ini.
     */
    public function authorize(): bool
    {
        // ✅ Izinkan semua pengguna yang terautentikasi melakukan update
        return true;
    }

    /**
     * Aturan validasi untuk pembaruan Gardu Induk.
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
     * Pesan error kustom untuk validasi.
     */
    public function messages(): array
    {
        return [
            'lokasi_id.required' => 'Lokasi harus dipilih.',
            'lokasi_id.exists' => 'Lokasi yang dipilih tidak valid.',
            'nama_gardu_induk.required' => 'Nama Gardu Induk wajib diisi.',
            'nama_gardu_induk.max' => 'Nama Gardu Induk maksimal 100 karakter.',
        ];
    }
}
