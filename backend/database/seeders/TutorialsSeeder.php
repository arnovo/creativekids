<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sketch;
use App\Models\SketchStep;

class TutorialsSeeder extends Seeder
{
    public function run(): void
    {
        $tutorials = [
            'dog' => [
                'title' => 'Perrito Shiba Inu',
                'description' => 'Un cachorro muy amigable, realista y detallado.',
                'difficulty' => 'fácil',
                'steps' => [
                    'Dibuja los círculos y óvalos base para la cabeza y el cuerpo usando el Lápiz Azul.',
                    'Añade las orejitas triangulares en la parte superior.',
                    'Sitúa los ojos, la nariz y las mejillas.',
                    'Boceta las patas delanteras y la barriga.',
                    'Añade la característica cola enroscada.',
                    'Usa el Rotulador Negro para repasar el dibujo limpio, y luego borra el boceto con la varita mágica.'
                ]
            ],
            'bear' => [
                'title' => 'Osito Kawaii',
                'description' => 'Dibuja un tierno osito regordete.',
                'difficulty' => 'fácil',
                'steps' => [
                    'Comienza con dos círculos suaves para la cabeza y el hocico.',
                    'Traza la cabeza y añádele dos orejitas redondas.',
                    'Ponle los ojos oscuros y la nariz.',
                    'Dibuja el óvalo del cuerpo.',
                    'Añade las patitas y garras.',
                    'Repasa la línea final en negro y limpia las guías.'
                ]
            ],
            'penguin' => [
                'title' => 'Pingüino Pingüi',
                'description' => 'Un divertido pingüinito patoso.',
                'difficulty' => 'fácil',
                'steps' => [
                    'Haz un óvalo grande para el cuerpo huevito.',
                    'Dibuja las dos aletas a los lados.',
                    'Traza la silueta de la zona blanca de su barriga.',
                    'Añade el pico y los ojitos.',
                    'Ponle las patitas en la base.',
                    'Haz el entintado final y borra el lápiz azul.'
                ]
            ],
            'bunny' => [
                'title' => 'Conejito Orejotas',
                'description' => 'Un conejito saltarín muy adorable.',
                'difficulty' => 'fácil',
                'steps' => [
                    'Dibuja el círculo suave de la carita.',
                    'Haz sus largas orejas de conejo.',
                    'Ponle una boquita curiosa y sus ojos.',
                    'Añade los bigotes laterales.',
                    'Dibuja el cuerpecito y las patas.',
                    'Trazo final limpio. ¡Listo para colorear!'
                ]
            ],
            'anime_face' => [
                'title' => 'Cara Estilo Manga',
                'description' => 'Aprende las proporciones de una cara Anime.',
                'difficulty' => 'medio',
                'steps' => [
                    'Haz el círculo y la cruz guía.',
                    'Traza la barbilla afilada clásica del anime.',
                    'Dibuja unos grandes ojos expresivos.',
                    'Añade la nariz pequeña y la boca.',
                    'Enmarca la cara con el flequillo y el pelo.',
                    'Entinta el diseño final y elimina todas las líneas guía.'
                ]
            ],
            'chibi' => [
                'title' => 'Personaje Chibi',
                'description' => 'Dibuja un personaje cabezón y adorable.',
                'difficulty' => 'medio',
                'steps' => [
                    'Las proporciones Chibi: cabeza grande, cuerpo pequeño.',
                    'Haz las guías de brazos y piernas.',
                    'Boceta la forma de la ropa y el vestido.',
                    'Detalla los grandes ojos y la cara.',
                    'Añade el peinado, coletas y lazos.',
                    'Línea limpia definitiva. Usa la goma mágica para borrar el esqueleto base.'
                ]
            ]
        ];

        // Borrar los tutoriales anteriores generados por este seeder para evitar duplicados
        $existingTitles = array_column($tutorials, 'title');
        Sketch::whereIn('title', $existingTitles)->delete();
        // Además, limpiamos los antiguos de 5 pasos si quedan
        Sketch::whereIn('title', ['Osito Kawaii', 'Pingüino Pingüi', 'Conejito Orejotas', 'Perrito Shiba', 'Cara Estilo Manga', 'Personaje Chibi'])->delete();

        foreach ($tutorials as $key => $tut) {
            $sketch = Sketch::create([
                'title' => $tut['title'],
                'description' => $tut['description'],
                'difficulty' => $tut['difficulty'],
                'total_steps' => count($tut['steps'])
            ]);

            foreach ($tut['steps'] as $index => $desc) {
                $stepNum = $index + 1;
                $filename = "ai_{$key}_step_{$stepNum}.png";
                
                SketchStep::create([
                    'sketch_id' => $sketch->id,
                    'step_number' => $stepNum,
                    'image_path' => "sketches/steps/{$filename}",
                    'description' => $desc
                ]);
            }
        }
    }
}
