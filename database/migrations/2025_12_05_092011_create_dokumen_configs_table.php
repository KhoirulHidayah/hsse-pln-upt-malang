<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel konfigurasi dokumen (master data yang bisa diubah dari admin)
        Schema::create('t_dokumen_configs', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value');
            $table->string('description')->nullable();
            $table->timestamps();
        });

        // Insert default config
        DB::table('t_dokumen_configs')->insert([
            ['key' => 'no_dokumen_default', 'value' => 'Fm-SMPNS-UPTMLG-010', 'description' => 'Nomor dokumen standar formulir', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'nomor_revisi_default', 'value' => '00', 'description' => 'Nomor revisi default', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'nomor_edisi_default', 'value' => '01', 'description' => 'Nomor edisi default', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'unit_induk', 'value' => 'UNIT INDUK TRANSMISI JAWA BAGIAN TIMUR DAN BALI', 'description' => 'Nama unit induk', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'unit_pelaksana', 'value' => 'UNIT PELAKSANA TRANSMISI MALANG', 'description' => 'Nama unit pelaksana', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('t_dokumen_configs');
    }
};