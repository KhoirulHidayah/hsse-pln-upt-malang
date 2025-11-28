<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migration untuk tabel gardu_induks.
     */
    public function up(): void
    {
        Schema::create('gardu_induks', function (Blueprint $table) {
            $table->id('gardu_induk_id');
            $table->foreignId('lokasi_id')
                  ->constrained('lokasis', 'lokasi_id') // ✅ sesuaikan FK ke lokasi_id
                  ->onDelete('cascade');
            $table->string('nama_gardu_induk', 100);
            $table->timestamps();
        });
    }

    /**
     * Batalkan migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('gardu_induks');
    }
};
