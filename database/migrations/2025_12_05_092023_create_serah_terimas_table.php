<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel serah terima utama
        Schema::create('t_serah_terimas', function (Blueprint $table) {
            $table->bigIncrements('serah_terima_id');
            
            // Nomor seri/urut yang unik untuk setiap transaksi (auto-generate atau manual)
            $table->string('no_seri')->unique()->comment('Nomor unik serah terima');
            
            // Data dokumen - bisa override dari default config
            $table->string('no_dokumen')->nullable()->comment('Jika null, ambil dari config');
            $table->enum('status_dokumen', ['MASTER', 'COPY'])->nullable()->comment('Status dokumen bisa kosong');
            $table->string('copy_no')->nullable();
            $table->string('nomor_revisi')->nullable()->comment('Jika null, ambil dari config');
            $table->string('nomor_edisi')->nullable()->comment('Jika null, ambil dari config');
            $table->date('tanggal_efektif')->nullable();
            
            // Data transaksi
            $table->date('tanggal');
            $table->string('nama_penerima');
            $table->string('jabatan_pengirim');
            $table->string('nama_pengirim');
            
            // Lokasi
            $table->string('lokasi')->default('Malang');
            
            $table->timestamps();
            
            // Index untuk pencarian
            $table->index(['tanggal', 'no_dokumen']);
            $table->index('no_seri');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_serah_terimas');
    }
};