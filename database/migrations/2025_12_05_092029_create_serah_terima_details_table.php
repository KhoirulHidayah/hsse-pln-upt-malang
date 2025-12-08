<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel detail barang
        Schema::create('t_serah_terima_details', function (Blueprint $table) {
            $table->bigIncrements('detail_id');
            $table->unsignedBigInteger('serah_terima_id');
            $table->string('item_nama');
            $table->string('item_merk')->nullable();
            $table->string('jumlah');
            $table->string('keadaan')->nullable();
            $table->boolean('cek')->default(true);
            $table->timestamps();

            $table->foreign('serah_terima_id')
                  ->references('serah_terima_id')
                  ->on('t_serah_terimas')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_serah_terima_details');
    }
};