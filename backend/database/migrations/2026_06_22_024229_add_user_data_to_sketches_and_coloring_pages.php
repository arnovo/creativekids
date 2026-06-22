<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sketches', function (Blueprint $table) {
            $table->json('user_data')->nullable()->after('total_steps');
        });

        Schema::table('coloring_pages', function (Blueprint $table) {
            $table->json('user_data')->nullable()->after('difficulty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sketches_and_coloring_pages', function (Blueprint $table) {
            //
        });
    }
};
