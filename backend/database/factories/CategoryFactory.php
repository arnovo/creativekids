<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    private static int $sortCounter = 0;

    public function definition(): array
    {
        $categories = [
            ['name' => 'Personal',  'color' => '#a0c4ff', 'icon' => 'account-circle'],
            ['name' => 'Dibujos',   'color' => '#b2f2bb', 'icon' => 'palette'],
            ['name' => 'Ideas',     'color' => '#eeb3c2', 'icon' => 'lightbulb'],
            ['name' => 'Escuela',   'color' => '#d5e3ff', 'icon' => 'school'],
            ['name' => 'Favoritos', 'color' => '#ffecb3', 'icon' => 'star'],
        ];

        $cat = $this->faker->randomElement($categories);

        return [
            'name'       => $cat['name'],
            'color'      => $cat['color'],
            'icon'       => $cat['icon'],
            'sort_order' => self::$sortCounter++,
        ];
    }
}
