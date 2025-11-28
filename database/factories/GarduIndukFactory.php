<?php

namespace Database\Factories;

use App\Models\Lokasi;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GarduInduk>
 */
class GarduIndukFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // pastikan minimal 1 lokasi sudah ada
            'lokasi_id'        => Lokasi::factory(), // otomatis buat 1 data Lokasi baru
            'alamat'           => $this->faker->address(),
            'deskripsi'        => $this->faker->realText(50),
            'created_at'       => now(),
            'updated_at'       => now(),
        ];
    }
}
