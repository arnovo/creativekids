<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class NoteFactory extends Factory
{
    protected $model = Note::class;

    public function definition(): array
    {
        $notes = [
            ['title' => 'Mis ideas brillantes 🌟',           'content' => "Hoy es un gran día para empezar algo nuevo.\n\nPodemos dibujar un dragón que vuela por el espacio o diseñar una casa en un árbol gigante.\n\nRecuerda siempre usar muchos colores y divertirte."],
            ['title' => 'Lista de dibujos pendientes 🎨',    'content' => "- Dragón de fuego\n- Princesa guerrera\n- Robot espacial\n- Unicornio mágico\n- Castillo en las nubes"],
            ['title' => 'Colores favoritos 🌈',               'content' => "Rosa pastel: para fondos suaves\nAzul cielo: para el mar y el cielo\nVerde menta: para la naturaleza\nAmarillo sol: para cosas alegres"],
            ['title' => 'Recetas de pintura casera 🧪',       'content' => "Mezcla rojo + blanco = Rosa\nMezcla azul + amarillo = Verde\nMezcla rojo + azul = Morado\n\n¡Experimenta con tus propias mezclas!"],
            ['title' => 'Cosas que aprendí hoy 📝',           'content' => "1. Los ojos anime son más grandes que los reales\n2. Las sombras van al lado contrario de la luz\n3. Los personajes chibi tienen la cabeza más grande"],
        ];

        $note = $this->faker->randomElement($notes);

        return [
            'title'       => $note['title'],
            'content'     => $note['content'],
            'strokes'     => null,
            'category_id' => Category::factory(),
            'color'       => $this->faker->randomElement(['#ffffff', '#fff4cc', '#d5e3ff', '#d3f9d8', '#fce4ec']),
            'is_pinned'   => $this->faker->boolean(20),
        ];
    }
}
