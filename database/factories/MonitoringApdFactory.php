<?php

namespace Database\Factories;

use App\Models\Apd;
use App\Models\User;
use App\Models\Lokasi;
use App\Models\GarduInduk;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MonitoringApd>
 */
class MonitoringApdFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tanggalDistribusi = $this->faker->dateTimeBetween('-2 years', 'now');
        $tanggalPemeriksaan = Carbon::instance($tanggalDistribusi)->addMonths($this->faker->numberBetween(1, 6));
        
        // Hitung tanggal berakhir berdasarkan masa penggunaan APD (misal 2-4 tahun)
        $tahunMasaPakai = $this->faker->numberBetween(2, 4);
        $tanggalBerakhir = Carbon::instance($tanggalDistribusi)->addYears($tahunMasaPakai);
        
        // Tentukan status notifikasi berdasarkan tanggal berakhir
        $sisaHari = Carbon::now()->diffInDays($tanggalBerakhir, false);
        
        if ($sisaHari < 0) {
            $statusNotifikasi = 'Expired';
        } elseif ($sisaHari <= 90) {
            $statusNotifikasi = 'Warning';
        } else {
            $statusNotifikasi = 'Active';
        }

        return [
            'apd_id'              => Apd::factory(),
            'user_id'             => User::factory(),
            'lokasi_id'           => Lokasi::inRandomOrder()->first()?->lokasi_id ?? null,
            'gardu_induk_id'      => GarduInduk::inRandomOrder()->first()?->gardu_induk_id ?? null,
            'stok'                => $this->faker->numberBetween(1, 100),
            'tanggal_distribusi'  => $tanggalDistribusi,
            'tanggal_pemeriksaan' => $tanggalPemeriksaan,
            'tanggal_berakhir'    => $tanggalBerakhir,
            'kondisi'             => $this->faker->randomElement(['Baik', 'Rusak', 'Perlu Diganti']),
            'catatan'             => $this->faker->optional(0.6)->sentence(),
            'status_notifikasi'   => $statusNotifikasi,
            'created_at'          => now(),
            'updated_at'          => now(),
        ];
    }

    /**
     * State untuk APD dengan kondisi baik
     */
    public function baik(): static
    {
        return $this->state(fn (array $attributes) => [
            'kondisi' => 'Baik',
            'status_notifikasi' => 'Active',
        ]);
    }

    /**
     * State untuk APD yang akan expired
     */
    public function warning(): static
    {
        return $this->state(function (array $attributes) {
            $tanggalBerakhir = Carbon::now()->addDays($this->faker->numberBetween(1, 90));
            
            return [
                'tanggal_berakhir' => $tanggalBerakhir,
                'status_notifikasi' => 'Warning',
                'kondisi' => 'Baik',
            ];
        });
    }

    /**
     * State untuk APD yang sudah expired
     */
    public function expired(): static
    {
        return $this->state(function (array $attributes) {
            $tanggalBerakhir = Carbon::now()->subDays($this->faker->numberBetween(1, 365));
            
            return [
                'tanggal_berakhir' => $tanggalBerakhir,
                'status_notifikasi' => 'Expired',
                'kondisi' => $this->faker->randomElement(['Rusak', 'Perlu Diganti']),
            ];
        });
    }

    /**
     * State untuk APD dengan stok rendah
     */
    public function stokRendah(): static
    {
        return $this->state(fn (array $attributes) => [
            'stok' => $this->faker->numberBetween(1, 10),
        ]);
    }
}