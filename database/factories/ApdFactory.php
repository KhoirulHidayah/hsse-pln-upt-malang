<?php

namespace Database\Factories;

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
            'nama_apd'   => $this->faker->sentence(),
            'kode_apd' => strtoupper($this->faker->unique()->bothify('APD-###')),
            'deskripsi'  => $this->faker->realText(),
            'created_by' => 1, // pastikan user id 1 ada
            'updated_by' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
