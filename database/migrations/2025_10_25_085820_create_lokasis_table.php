<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migration untuk tabel lokasi.
     */
    public function up(): void
    {
        Schema::create('lokasis', function (Blueprint $table) {
            $table->id('lokasi_id');
            $table->string('nama_lokasi', 100);
            $table->timestamps(); // created_at & updated_at otomatis
        });
    }

    /**
     * Batalkan migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('lokasis');
    }
};
