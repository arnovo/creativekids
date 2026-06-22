<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Sketch;
use App\Models\Note;
use App\Models\ColoringPage;
use App\Models\SketchStep;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create categories
        $categories = Category::factory(5)->create();

        // 2. Create notes assigned to categories
        Note::factory(15)->recycle($categories)->create();

        // 3. Create standalone notes
        Note::factory(5)->create(['category_id' => null]);

        // 4. Create explicit "Gatito Kawaii" sketch with real SVG steps
        $gatito = Sketch::create([
            'title' => 'Gatito Kawaii',
            'description' => 'Aprende a dibujar paso a paso un gatito estilo japonés.',
            'difficulty' => 'fácil',
            'total_steps' => 5
        ]);

        $gatitoSteps = [
            'Dibuja el contorno básico de la cabeza.',
            'Añade la base plana y las dos orejas puntiagudas.',
            'Ponle dos ojitos redondos y una pequeña nariz triangular.',
            'Dibuja sus patitas y los bigotes.',
            'Añade la colita y unos brillos en los ojos para hacerlo más tierno.'
        ];

        foreach ($gatitoSteps as $index => $desc) {
            SketchStep::create([
                'sketch_id' => $gatito->id,
                'step_number' => $index + 1,
                'image_path' => 'sketches/steps/gatito_step_' . ($index + 1) . '.svg',
                'description' => $desc
            ]);
        }

        // 5. Create explicit Coloring Pages for the SVGs we have
        $coloringPages = [
            ['title' => 'Lindo Gatito', 'difficulty' => 'fácil', 'image' => 'coloring/lindo_gatito.svg'],
            ['title' => 'Girasol Feliz', 'difficulty' => 'fácil', 'image' => 'coloring/girasol_feliz.svg'],
            ['title' => 'Robot Amigo', 'difficulty' => 'medio', 'image' => 'coloring/robot_amigo.svg'],
            ['title' => 'Estrella Marina', 'difficulty' => 'fácil', 'image' => 'coloring/estrella_marina.svg'],
            ['title' => 'Mariposa Mágica', 'difficulty' => 'medio', 'image' => 'coloring/mariposa_mágica.svg']
        ];

        foreach ($coloringPages as $page) {
            ColoringPage::create([
                'title' => $page['title'],
                'svg_path' => $page['image'],
                'difficulty' => $page['difficulty']
            ]);
        }

        // 6. Call the auto-generated TutorialsSeeder for the new animals and anime
        $this->call(TutorialsSeeder::class);
    }
}
