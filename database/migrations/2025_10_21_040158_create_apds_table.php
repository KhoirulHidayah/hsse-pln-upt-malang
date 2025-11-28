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
            
            $table->string('nama_apd', 100);
            $table->string('kode_apd', 50)->unique();
            $table->text('deskripsi')->nullable(); // deskripsi APD spesifik

            // User pembuat dan pengubah
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
