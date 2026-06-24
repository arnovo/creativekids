<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Progreso de Bocetos paso a paso por usuario
        Schema::create('sketch_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('sketch_id')->constrained('sketches')->cascadeOnDelete();
            $table->jsonb('user_data')->nullable(); // Almacenará los trazos del lienzo y paso actual
            $table->timestamps();

            // Evitar duplicados: solo un progreso por usuario y boceto
            $table->unique(['user_id', 'sketch_id']);
        });

        // Progreso de Colorear por usuario
        Schema::create('coloring_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('coloring_page_id')->constrained('coloring_pages')->cascadeOnDelete();
            $table->jsonb('user_data')->nullable(); // Almacenará los rellenos/colores del lienzo
            $table->timestamps();

            // Evitar duplicados: solo un progreso por usuario y dibujo de colorear
            $table->unique(['user_id', 'coloring_page_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sketch_progress');
        Schema::dropIfExists('coloring_progress');
    }
};
