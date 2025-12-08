<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApdRequest extends FormRequest
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
            'kode_apd'         => [
                'required',
                'string',
                'max:50',
                Rule::unique('apds', 'kode_apd')->ignore($this->apd),
            ],
            'deskripsi'        => ['nullable', 'string'],
            'gambar'           => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp', 'max:2048'],

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
            'jenis_id.exists'   => 'Jenis APD yang dipilih tidak valid.',
            'nama_apd.required' => 'Nama APD wajib diisi.',
            'kode_apd.required' => 'Kode APD wajib diisi.',
            'kode_apd.unique'   => 'Kode APD sudah digunakan.',
            'gambar.image'      => 'File gambar tidak valid.',
            'gambar.mimes'      => 'Gambar harus berformat jpeg, jpg, png, atau webp.',
            'gambar.max'        => 'Ukuran gambar maksimal 2MB.',
        ];
    }
}