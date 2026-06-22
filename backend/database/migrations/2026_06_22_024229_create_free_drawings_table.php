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
        Schema::create('free_drawings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Dibujo sin título');
            $table->string('background_color')->default('#ffffff');
            $table->string('thumbnail_path')->nullable();
            $table->json('strokes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('free_drawings');
    }
};
