<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jenis_apds', function (Blueprint $table) {
            $table->id();
            $table->string('nama_jenis', 100)->unique(); // Contoh: Alat Pelindung Kepala
            $table->text('deskripsi')->nullable(); // Penjelasan jenis APD
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jenis_apds');
    }
};
