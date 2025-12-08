<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // seed 1 user khusus
        User::factory()->create([
            'name' => 'KhoirulHidayah',
            'email' => 'rullhida23@gmail.com',
            'password' => bcrypt('12345678'),
            'email_verified_at' => now()
        ]);

        // jalankan Seeder
        $this->call(JenisApdSeeder::class);
        $this->call(ApdSeeder::class);
        $this->call(LokasiSeeder::class);
        $this->call(GarduIndukSeeder::class);
        $this->call(MonitoringApdSeeder::class);
    }
}
