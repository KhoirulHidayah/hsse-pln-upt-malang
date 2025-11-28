<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('apd_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('apd_id')->constrained('apds')->onDelete('cascade');

            // Detail spesifikasi APD
            $table->string('nama_detail', 100);
            $table->string('kode_detail', 50)->nullable();
            $table->text('standar')->nullable();
            $table->string('bahan', 100)->nullable();
            $table->string('warna', 50)->nullable();
            $table->string('ukuran', 50)->nullable();
            $table->string('kemampuan', 100)->nullable(); // contoh: tahan listrik 20.000 V
            $table->string('masa_penggunaan', 50)->nullable(); // contoh: 4 tahun
            $table->text('fungsi')->nullable();
            $table->text('keterangan')->nullable();
            $table->string('gambar')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('apd_details');
    }
};
