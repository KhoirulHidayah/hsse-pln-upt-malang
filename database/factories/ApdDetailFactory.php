<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Apd;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApdDetail>
 */
class ApdDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'apd_id'          => Apd::factory(), // otomatis buat 1 data APD baru
            'nama_detail'     => $this->faker->sentence(),
            'kode_detail'     => strtoupper($this->faker->unique()->bothify('APD-###-???')),
            'standar'         => $this->faker->sentence(),
            'bahan'           => $this->faker->sentence(),
            'warna'           => $this->faker->sentence(),
            'ukuran'          => $this->faker->sentence(),
            'kemampuan'       => $this->faker->sentence(),
            'masa_penggunaan' => $this->faker->sentence(),
            'fungsi'          => $this->faker->realText(),
            'keterangan'      => $this->faker->realText(),
            'gambar'          => 'apd/default.png',
            'created_at'      => now(),
            'updated_at'      => now(),
        ];
    }
}
