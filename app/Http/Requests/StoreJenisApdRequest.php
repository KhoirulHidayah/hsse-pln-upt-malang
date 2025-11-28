<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJenisApdRequest extends FormRequest
{
    /**
     * Tentukan apakah user diizinkan membuat permintaan ini.
     */
    public function authorize(): bool
    {
        // Izinkan semua user yang login untuk menyimpan data jenis APD
        return true;
    }

    /**
     * Aturan validasi untuk menyimpan data jenis APD baru.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_jenis' => ['required', 'string', 'max:255', 'unique:jenis_apds,nama_jenis'],
            'deskripsi'  => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Pesan error kustom untuk validasi.
     */
    public function messages(): array
    {
        return [
            'nama_jenis.required' => 'Nama jenis APD wajib diisi.',
            'nama_jenis.unique'   => 'Nama jenis APD sudah digunakan.',
            'nama_jenis.max'      => 'Nama jenis APD maksimal 255 karakter.',
            'deskripsi.max'       => 'Deskripsi maksimal 1000 karakter.',
        ];
    }
}
