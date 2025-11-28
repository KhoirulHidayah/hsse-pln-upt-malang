<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreApdRequest extends FormRequest
{
    /**
     * Tentukan apakah user diizinkan membuat permintaan ini.
     */
    public function authorize(): bool
    {
        // Diatur ke true agar user yang login dapat menyimpan data APD
        return true;
    }

    /**
     * Aturan validasi untuk menyimpan data APD baru.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'jenis_id'  => ['required', 'integer', 'exists:jenis_apds,id'],
            'nama_apd'  => ['required', 'string', 'max:255'],
            'kode_apd'  => ['required', 'string', 'max:100', 'unique:apds,kode_apd'],
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
            'kode_apd.unique'   => 'Kode APD sudah digunakan.',
        ];
    }
}
