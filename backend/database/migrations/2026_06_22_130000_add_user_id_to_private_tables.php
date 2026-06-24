<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Enlazar notes a users
        Schema::table('notes', function (Blueprint $table) {
            $table->foreignId('user_id')
                  ->nullable() // nullable temporalmente por si hay registros huérfanos, luego se asocian
                  ->constrained('users')
                  ->cascadeOnDelete();
        });

        // Enlazar free_drawings a users
        Schema::table('free_drawings', function (Blueprint $table) {
            $table->foreignId('user_id')
                  ->nullable()
                  ->constrained('users')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('notes', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });

        Schema::table('free_drawings', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
