<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreApdRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'jenis_id'         => ['required', 'integer', 'exists:jenis_apds,id'],
            'nama_apd'         => ['required', 'string', 'max:100'],
            'kode_apd'         => ['required', 'string', 'max:50', 'unique:apds,kode_apd'],
            'deskripsi'        => ['nullable', 'string'],
            'gambar'           => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:2048'],

            // Spesifikasi APD
            'bahan'            => ['nullable', 'string', 'max:100'],
            'warna'            => ['nullable', 'string', 'max:50'],
            'ukuran'           => ['nullable', 'string', 'max:50'],
            'kemampuan'        => ['nullable', 'string', 'max:100'],
            'fungsi'           => ['nullable', 'string'],

            // Standar dan penggunaan
            'standar'          => ['nullable', 'string'],
            'masa_penggunaan'  => ['nullable', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'jenis_id.required' => 'Jenis APD wajib dipilih.',
            'jenis_id.exists'   => 'Jenis APD tidak valid.',
            'nama_apd.required' => 'Nama APD wajib diisi.',
            'kode_apd.required' => 'Kode APD wajib diisi.',
            'kode_apd.unique'   => 'Kode APD sudah digunakan.',
            'gambar.image'      => 'File gambar tidak valid.',
            'gambar.mimes'      => 'Format gambar harus jpeg, jpg, png, atau webp.',
            'gambar.max'        => 'Ukuran gambar maksimal 2MB.',
        ];
    }
}