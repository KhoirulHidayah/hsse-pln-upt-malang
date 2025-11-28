<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApdDetailRequest extends FormRequest
{
    /**
     * Menentukan apakah user berhak melakukan request ini.
     */
    public function authorize(): bool
    {
        return true; // ✅ izinkan semua user yang terautentikasi
    }

    /**
     * Aturan validasi untuk penyimpanan data Detail APD.
     */
    public function rules(): array
    {
        return [
            'apd_id'           => 'required|exists:apds,id',
            'nama_detail'      => 'required|string|max:100',
            'kode_detail'      => 'nullable|string|max:50',
            'standar'          => 'nullable|string',
            'bahan'            => 'nullable|string|max:100',
            'warna'            => 'nullable|string|max:50',
            'ukuran'           => 'nullable|string|max:50',
            'kemampuan'        => 'nullable|string|max:100',
            'masa_penggunaan'  => 'nullable|string|max:50',
            'fungsi'           => 'nullable|string',
            'keterangan'       => 'nullable|string',
            'gambar'           => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048', // ✅ max 2MB
        ];
    }

    /**
     * Pesan error kustom agar lebih informatif.
     */
    public function messages(): array
    {
        return [
            'apd_id.required'      => 'Silakan pilih APD terkait.',
            'apd_id.exists'        => 'APD yang dipilih tidak valid.',
            'nama_detail.required' => 'Nama detail wajib diisi.',
            'nama_detail.max'      => 'Nama detail maksimal 100 karakter.',
            'gambar.image'         => 'File harus berupa gambar.',
            'gambar.mimes'         => 'Format gambar harus jpeg, png, jpg, atau webp.',
            'gambar.max'           => 'Ukuran gambar maksimal 2MB.',
        ];
    }
}
