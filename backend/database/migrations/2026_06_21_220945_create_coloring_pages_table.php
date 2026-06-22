<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coloring_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('svg_path');                        // Path to the SVG vector file
            $table->string('thumbnail_path')->nullable();      // Preview image
            $table->string('category_name')->nullable();       // Grouping label (animals, flowers, etc.)
            $table->enum('difficulty', ['fácil', 'medio', 'difícil'])->default('fácil');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coloring_pages');
    }
};
