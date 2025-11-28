<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateJenisApdRequest extends FormRequest
{
    /**
     * Tentukan apakah user diizinkan melakukan request ini.
     */
    public function authorize(): bool
    {
        // Izinkan semua user yang login untuk mengupdate data
        return true;
    }

    /**
     * Aturan validasi untuk memperbarui data jenis APD.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_jenis' => [
                'required',
                'string',
                'max:255',
                Rule::unique('jenis_apds', 'nama_jenis')->ignore($this->jenis_apd),
            ],
            'deskripsi' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Pesan error kustom untuk validasi.
     */
    public function messages(): array
    {
        return [
            'nama_jenis.required' => 'Nama jenis APD wajib diisi.',
            'nama_jenis.unique'   => 'Nama jenis APD sudah digunakan oleh data lain.',
            'nama_jenis.max'      => 'Nama jenis APD maksimal 255 karakter.',
            'deskripsi.max'       => 'Deskripsi maksimal 1000 karakter.',
        ];
    }
}
