<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'pemeriksa'])->default('admin')->after('email');
            $table->unsignedBigInteger('gardu_induk_id')->nullable()->after('role');

            $table->foreign('gardu_induk_id')
                  ->references('gardu_induk_id')
                  ->on('gardu_induks')
                  ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['gardu_induk_id']);
            $table->dropColumn(['role', 'gardu_induk_id']);
        });
    }
};
