<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApdDetailRequest extends FormRequest
{
    /**
     * Tentukan apakah user diizinkan melakukan request ini.
     */
    public function authorize(): bool
    {
        // Mengizinkan semua user yang terautentikasi
        return true;
    }

    /**
     * Aturan validasi untuk update detail APD.
     */
    public function rules(): array
    {
        return [
            'apd_id' => ['required', 'exists:apds,id'],
            'nama_detail' => ['required', 'string', 'max:100'],
            'kode_detail' => ['nullable', 'string', 'max:50'],
            'standar' => ['nullable', 'string'],
            'bahan' => ['nullable', 'string', 'max:100'],
            'warna' => ['nullable', 'string', 'max:50'],
            'ukuran' => ['nullable', 'string', 'max:50'],
            'kemampuan' => ['nullable', 'string', 'max:100'],
            'masa_penggunaan' => ['nullable', 'string', 'max:50'],
            'fungsi' => ['nullable', 'string'],
            'keterangan' => ['nullable', 'string'],
            'gambar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'], // max 2MB
        ];
    }

    /**
     * Pesan error kustom agar lebih informatif.
     */
    public function messages(): array
    {
        return [
            'apd_id.required' => 'Nama APD wajib dipilih.',
            'apd_id.exists' => 'Data APD tidak valid.',
            'nama_detail.required' => 'Nama detail wajib diisi.',
            'gambar.image' => 'File yang diunggah harus berupa gambar.',
            'gambar.mimes' => 'Format gambar harus jpg, jpeg, png, atau webp.',
            'gambar.max' => 'Ukuran gambar maksimal 2MB.',
        ];
    }
}
