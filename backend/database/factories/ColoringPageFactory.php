<?php

namespace Database\Factories;

use App\Models\ColoringPage;
use Illuminate\Database\Eloquent\Factories\Factory;

class ColoringPageFactory extends Factory
{
    protected $model = ColoringPage::class;

    public function definition(): array
    {
        $pages = [
            ['title' => 'Lindo Gatito',       'cat' => 'Animales',  'diff' => 'fácil'],
            ['title' => 'Girasol Feliz',      'cat' => 'Flores',    'diff' => 'fácil'],
            ['title' => 'Robot Amigo',         'cat' => 'Fantasía',  'diff' => 'medio'],
            ['title' => 'Mariposa Mágica',     'cat' => 'Animales',  'diff' => 'fácil'],
            ['title' => 'Castillo Encantado',  'cat' => 'Fantasía',  'diff' => 'difícil'],
            ['title' => 'Estrella Marina',     'cat' => 'Animales',  'diff' => 'fácil'],
            ['title' => 'Cohete Espacial',     'cat' => 'Fantasía',  'diff' => 'medio'],
            ['title' => 'Arcoíris Brillante',  'cat' => 'Naturaleza','diff' => 'fácil'],
        ];

        $page = $this->faker->randomElement($pages);

        return [
            'title'          => $page['title'],
            'svg_path'       => 'coloring/' . strtolower(str_replace(' ', '_', $page['title'])) . '.svg',
            'thumbnail_path' => null,
            'category_name'  => $page['cat'],
            'difficulty'     => $page['diff'],
        ];
    }
}
