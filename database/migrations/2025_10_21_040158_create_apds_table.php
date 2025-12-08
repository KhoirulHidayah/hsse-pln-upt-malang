<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('apds', function (Blueprint $table) {
            $table->id();

            // Relasi ke jenis_apds
            $table->foreignId('jenis_id')->constrained('jenis_apds')->onDelete('cascade');
            
            // Informasi dasar
            $table->string('nama_apd', 100);
            $table->string('kode_apd', 50)->unique();
            $table->text('deskripsi')->nullable();
            $table->string('gambar')->nullable();

            // Spesifikasi APD
            $table->string('bahan', 100)->nullable();
            $table->string('warna', 50)->nullable();
            $table->string('ukuran', 50)->nullable();
            $table->string('kemampuan', 100)->nullable();
            $table->text('fungsi')->nullable();

            // Standar dan penggunaan
            $table->text('standar')->nullable();               // Contoh: SPLN, K3, ISO
            $table->string('masa_penggunaan', 50)->nullable(); // Contoh: 4 tahun, 36 bulan

            // User pembuat & pengubah
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->constrained('users');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('apds');
    }
};