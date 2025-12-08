<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSerahTerimaRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Data Serah Terima Utama (t_serah_terimas)
            'no_seri'           => ['required', 'string', 'max:255', 'unique:t_serah_terimas,no_seri'], // Baru: Wajib unik
            'no_dokumen'        => ['nullable', 'string', 'max:255'], // Diubah menjadi nullable
            'status_dokumen'    => ['nullable', 'string', Rule::in(['MASTER', 'COPY'])], // Baru
            'copy_no'           => ['nullable', 'string', 'max:255'], // Baru
            'nomor_revisi'      => ['nullable', 'string', 'max:255'], // Baru
            'nomor_edisi'       => ['nullable', 'string', 'max:255'], // Baru
            'tanggal_efektif'   => ['nullable', 'date'], // Baru

            'tanggal'           => ['required', 'date'],
            'nama_penerima'     => ['required', 'string', 'max:255'],
            'jabatan_pengirim'  => ['required', 'string', 'max:255'],
            'nama_pengirim'     => ['required', 'string', 'max:255'],
            'lokasi'            => ['nullable', 'string', 'max:255'], // Baru

            // Detail Item (t_serah_terima_details)
            'items'                       => ['required', 'array', 'min:1'],
            'items.*.item_nama'           => ['required', 'string', 'max:255'],
            'items.*.item_merk'           => ['nullable', 'string', 'max:255'],
            'items.*.jumlah'              => ['required', 'string', 'max:255'],
            'items.*.keadaan'             => ['required', 'string', 'max:255'], // Diperluas
            'items.*.cek'                 => ['nullable', 'boolean'], // Baru
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'no_seri.required'          => 'Nomor seri wajib diisi.',
            'no_seri.unique'            => 'Nomor seri sudah digunakan.',
            'status_dokumen.in'         => 'Status dokumen harus MASTER atau COPY.',
            'tanggal.required'          => 'Tanggal wajib diisi.',
            'nama_penerima.required'    => 'Nama penerima wajib diisi.',
            'jabatan_pengirim.required' => 'Jabatan penerima wajib diisi.',
            'nama_pengirim.required'    => 'Nama pengirim wajib diisi.',

            'items.required'            => 'Minimal 1 item barang harus ditambahkan.',
            'items.*.item_nama.required' => 'Nama item wajib diisi.',
            'items.*.jumlah.min'         => 'Jumlah item harus diisi.',
            'items.*.keadaan.in'         => 'Keadaan harus diisi.',
            'items.*.cek.boolean'       => 'Cek harus berupa nilai boolean (true/false).',
        ];
    }
}