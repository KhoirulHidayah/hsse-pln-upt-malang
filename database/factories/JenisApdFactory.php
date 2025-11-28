<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\JenisApd>
 */
class JenisApdFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama_jenis' => $this->faker->sentence(),
            'deskripsi'  =>$this->faker->realText(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
