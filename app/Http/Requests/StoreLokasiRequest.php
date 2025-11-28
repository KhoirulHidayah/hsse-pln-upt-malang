<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLokasiRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna diizinkan membuat permintaan ini.
     */
    public function authorize(): bool
    {
        // ✅ Izinkan semua user yang terautentikasi
        return true;
    }

    /**
     * Aturan validasi untuk menyimpan data lokasi.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'nama_lokasi' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * Pesan error kustom untuk validasi.
     */
    public function messages(): array
    {
        return [
            'nama_lokasi.required' => 'Nama lokasi wajib diisi.',
            'nama_lokasi.string'   => 'Nama lokasi harus berupa teks.',
            'nama_lokasi.max'      => 'Nama lokasi tidak boleh lebih dari 255 karakter.',
        ];
    }
}
