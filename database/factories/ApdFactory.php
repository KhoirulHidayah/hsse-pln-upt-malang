<?php

namespace Database\Factories;

use App\Models\JenisApd;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Apd>
 */
class ApdFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'jenis_id'        => JenisApd::factory(),
            
            // Informasi dasar
            'nama_apd'        => $this->faker->words(3, true),
            'kode_apd'        => strtoupper($this->faker->unique()->bothify('APD-###')),
            'deskripsi'       => $this->faker->paragraph(),
            'gambar'          => 'apd/default.png',
            
            // Spesifikasi APD
            'bahan'           => $this->faker->randomElement(['Karet', 'Plastik', 'Kulit', 'Kain', 'Polyester']),
            'warna'           => $this->faker->randomElement(['Hitam', 'Merah', 'Kuning', 'Biru', 'Hijau', 'Putih']),
            'ukuran'          => $this->faker->randomElement(['S', 'M', 'L', 'XL', 'XXL', 'Free Size']),
            'kemampuan'       => $this->faker->sentence(),
            'fungsi'          => $this->faker->paragraph(),
            
            // Standar dan penggunaan
            'standar'         => $this->faker->randomElement(['SNI', 'ISO 9001', 'ANSI', 'CE', 'K3']),
            'masa_penggunaan' => $this->faker->randomElement(['6 bulan', '1 tahun', '2 tahun', '3 tahun', '4 tahun']),
            
            // Audit trail
            'created_by'      => 1,
            'updated_by'      => 1,
            'created_at'      => now(),
            'updated_at'      => now(),
        ];
    }
}