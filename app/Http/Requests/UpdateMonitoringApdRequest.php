<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMonitoringApdRequest extends FormRequest
{
    /**
     * Tentukan apakah pengguna diizinkan untuk melakukan request ini.
     */
    public function authorize(): bool
    {
        // ✅ Izinkan semua user yang sudah login melakukan update
        return true;
    }

    /**
     * Aturan validasi untuk update Monitoring APD.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Relasi utama
            'apd_id'             => 'required|exists:apds,id',
            'user_id'            => 'nullable|exists:users,id',
            'lokasi_id'          => 'required|exists:lokasis,lokasi_id',
            'gardu_induk_id'     => 'required|exists:gardu_induks,gardu_induk_id',
            
            // Data monitoring
            'stok'               => 'required|integer|min:1',
            'tanggal_distribusi' => 'required|date|before_or_equal:today',
            'tanggal_pemeriksaan'=> 'required|date|before_or_equal:today',
            'tanggal_berakhir'   => 'required|date|after:tanggal_distribusi',
            'kondisi'            => 'required|string|in:Baik,Rusak,Perlu Diganti',
            'catatan'            => 'nullable|string|max:1000',
            
            // status_notifikasi akan di-update otomatis oleh Model boot()
        ];
    }

    /**
     * Pesan error kustom untuk validasi.
     */
    public function messages(): array
    {
        return [
            // Validasi APD
            'apd_id.required'              => 'APD wajib dipilih.',
            'apd_id.exists'                => 'APD yang dipilih tidak valid atau sudah dihapus.',
            
            // Validasi User (opsional)
            'user_id.exists'               => 'User yang dipilih tidak valid.',
            
            // Validasi Lokasi
            'lokasi_id.required'           => 'Lokasi wajib dipilih.',
            'lokasi_id.exists'             => 'Lokasi yang dipilih tidak valid atau sudah dihapus.',
            
            // Validasi Gardu Induk
            'gardu_induk_id.required'      => 'Gardu Induk wajib dipilih.',
            'gardu_induk_id.exists'        => 'Gardu Induk yang dipilih tidak valid atau sudah dihapus.',
            
            // Validasi Stok
            'stok.required'                => 'Jumlah stok wajib diisi.',
            'stok.integer'                 => 'Jumlah stok harus berupa angka.',
            'stok.min'                     => 'Jumlah stok minimal 1.',
            
            // Validasi Tanggal Distribusi
            'tanggal_distribusi.required'  => 'Tanggal distribusi wajib diisi.',
            'tanggal_distribusi.date'      => 'Format tanggal distribusi tidak valid.',
            'tanggal_distribusi.before_or_equal' => 'Tanggal distribusi tidak boleh di masa depan.',
            
            // Validasi Tanggal Pemeriksaan
            'tanggal_pemeriksaan.required' => 'Tanggal pemeriksaan wajib diisi.',
            'tanggal_pemeriksaan.date'     => 'Format tanggal pemeriksaan tidak valid.',
            'tanggal_pemeriksaan.before_or_equal' => 'Tanggal pemeriksaan tidak boleh di masa depan.',
            
            // Validasi Tanggal Berakhir
            'tanggal_berakhir.required'    => 'Tanggal berakhir wajib diisi.',
            'tanggal_berakhir.date'        => 'Format tanggal berakhir tidak valid.',
            'tanggal_berakhir.after'       => 'Tanggal berakhir harus setelah tanggal distribusi.',
            
            // Validasi Kondisi
            'kondisi.required'             => 'Kondisi APD wajib dipilih.',
            'kondisi.in'                   => 'Kondisi harus salah satu dari: Baik, Rusak, atau Perlu Diganti.',
            
            // Validasi Catatan
            'catatan.max'                  => 'Catatan maksimal 1000 karakter.',
        ];
    }

    /**
     * Custom attributes untuk pesan error yang lebih readable
     */
    public function attributes(): array
    {
        return [
            'apd_id'             => 'APD',
            'user_id'            => 'Pengguna',
            'lokasi_id'          => 'Lokasi',
            'gardu_induk_id'     => 'Gardu Induk',
            'stok'               => 'Stok',
            'tanggal_distribusi' => 'Tanggal Distribusi',
            'tanggal_pemeriksaan'=> 'Tanggal Pemeriksaan',
            'tanggal_berakhir'   => 'Tanggal Berakhir',
            'kondisi'            => 'Kondisi',
            'catatan'            => 'Catatan',
        ];
    }

    /**
     * Prepare data untuk validasi (optional: untuk cleaning data sebelum validasi)
     */
    protected function prepareForValidation(): void
    {
        // Trim whitespace dari catatan
        if ($this->has('catatan')) {
            $this->merge([
                'catatan' => trim($this->catatan),
            ]);
        }
    }
}