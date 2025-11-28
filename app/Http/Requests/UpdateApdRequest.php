<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApdRequest extends FormRequest
{
    /**
     * Tentukan apakah user diizinkan untuk melakukan request ini.
     */
    public function authorize(): bool
    {
        // Izinkan semua user yang login melakukan update
        return true;
    }

    /**
     * Aturan validasi untuk memperbarui data APD.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'jenis_id' => ['required', 'integer', 'exists:jenis_apds,id'],
            'nama_apd' => ['required', 'string', 'max:255'],
            'kode_apd' => [
                'required',
                'string',
                'max:100',
                // Abaikan validasi unik untuk record yang sedang diedit
                Rule::unique('apds', 'kode_apd')->ignore($this->apd),
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
            'jenis_id.required' => 'Jenis APD wajib dipilih.',
            'jenis_id.exists'   => 'Jenis APD yang dipilih tidak valid.',
            'nama_apd.required' => 'Nama APD wajib diisi.',
            'kode_apd.required' => 'Kode APD wajib diisi.',
            'kode_apd.unique'   => 'Kode APD sudah digunakan oleh data lain.',
        ];
    }
}
