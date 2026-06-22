<?php

namespace Database\Factories;

use App\Models\Sketch;
use Illuminate\Database\Eloquent\Factories\Factory;

class SketchFactory extends Factory
{
    protected $model = Sketch::class;

    public function definition(): array
    {
        $sketches = [
            ['title' => 'Ojo Anime Básico',           'desc' => 'Aprende a dibujar un ojo estilo anime paso a paso.',         'diff' => 'fácil',   'steps' => 6],
            ['title' => 'Rostro Chibi',                'desc' => 'Crea un adorable personaje chibi con expresiones.',          'diff' => 'fácil',   'steps' => 8],
            ['title' => 'Gatito Kawaii',               'desc' => 'Dibuja un gatito al estilo kawaii japonés.',                 'diff' => 'fácil',   'steps' => 5],
            ['title' => 'Cabello Anime Femenino',      'desc' => 'Técnicas para dibujar cabello con movimiento.',             'diff' => 'medio',   'steps' => 10],
            ['title' => 'Manos y Poses',               'desc' => 'Guía para dibujar manos en diferentes posiciones.',         'diff' => 'difícil', 'steps' => 12],
            ['title' => 'Dragón de Fantasía',          'desc' => 'Un dragón épico con alas y escamas detalladas.',            'diff' => 'difícil', 'steps' => 15],
        ];

        $sketch = $this->faker->randomElement($sketches);

        return [
            'title'          => $sketch['title'],
            'description'    => $sketch['desc'],
            'difficulty'     => $sketch['diff'],
            'thumbnail_path' => null,
            'total_steps'    => $sketch['steps'],
        ];
    }
}
