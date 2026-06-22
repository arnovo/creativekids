<?php

namespace Database\Factories;

use App\Models\SketchStep;
use App\Models\Sketch;
use Illuminate\Database\Eloquent\Factories\Factory;

class SketchStepFactory extends Factory
{
    protected $model = SketchStep::class;

    public function definition(): array
    {
        $descriptions = [
            'Dibuja el contorno básico con líneas suaves.',
            'Añade los detalles principales de la forma.',
            'Refina las líneas y añade profundidad.',
            'Agrega los detalles finos y texturas.',
            'Limpia el dibujo y marca las líneas finales.',
            'Añade sombras suaves para dar volumen.',
        ];

        return [
            'sketch_id'   => Sketch::factory(),
            'step_number' => 1, // Will be overridden by sequence in Seeder
            'image_path'  => 'sketches/steps/placeholder.png',
            'description' => $this->faker->randomElement($descriptions),
        ];
    }
}
