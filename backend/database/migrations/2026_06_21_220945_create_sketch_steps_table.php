<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sketch_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sketch_id')->constrained()->cascadeOnDelete();
            $table->integer('step_number');
            $table->string('image_path');                      // PNG with transparent bg
            $table->string('description')->nullable();         // Brief instruction for this step
            $table->timestamps();

            $table->unique(['sketch_id', 'step_number']);      // No duplicate steps
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sketch_steps');
    }
};
