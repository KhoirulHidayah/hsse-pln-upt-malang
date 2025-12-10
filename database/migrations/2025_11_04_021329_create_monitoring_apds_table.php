<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migration.
     */
    public function up(): void
    {
        Schema::create('monitoring_apds', function (Blueprint $table) {
            $table->id('monitoring_id');

            // 🔗 Relasi utama
            $table->unsignedBigInteger('apd_id')->nullable();           // FK ke apds
            $table->unsignedBigInteger('user_id')->nullable();          // pemakai/pegawai
            $table->unsignedBigInteger('lokasi_id')->nullable();        // FK ke m_lokasi
            $table->unsignedBigInteger('gardu_induk_id')->nullable();   // FK ke m_gardu_induk

            // 📦 Data stok & monitoring
            $table->integer('stok')->default(0);
            $table->date('tanggal_distribusi')->nullable();
            $table->date('tanggal_pemeriksaan')->nullable();
            $table->date('tanggal_berakhir')->nullable();
            $table->enum('kondisi', ['Baik', 'Rusak', 'Perlu Diganti'])->default('Baik');
            $table->text('catatan')->nullable();
            $table->boolean('is_read')->default(false);

            // 🔗 Relasi antar tabel
            $table->foreign('apd_id')->references('id')->on('apds')->onDelete('cascade');
            $table->foreign('lokasi_id')->references('lokasi_id')->on('lokasis')->onDelete('set null');
            $table->foreign('gardu_induk_id')->references('gardu_induk_id')->on('gardu_induks')->onDelete('set null');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Rollback migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('monitoring_apds');
    }
};