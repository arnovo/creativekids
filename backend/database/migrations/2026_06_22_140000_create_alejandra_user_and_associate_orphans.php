<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Crear o buscar al usuario propietario de los datos huérfanos
        $userEmail = env('SEED_USER_EMAIL', '86.alejandro@gmail.com');
        $userId = DB::table('users')->where('email', $userEmail)->value('id');

        if (!$userId) {
            $userId = DB::table('users')->insertGetId([
                'name'       => env('SEED_USER_NAME', 'alejandra'),
                'email'      => $userEmail,
                'password'   => Hash::make(env('SEED_USER_PASSWORD', 'changeme_on_deploy')),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Asociar notas huérfanas
        DB::table('notes')->whereNull('user_id')->update([
            'user_id' => $userId,
            'updated_at' => now(),
        ]);

        // 3. Asociar dibujos libres huérfanos
        DB::table('free_drawings')->whereNull('user_id')->update([
            'user_id' => $userId,
            'updated_at' => now(),
        ]);

        // 4. Migrar progreso global de bocetos a la tabla pivot sketch_progress
        $sketches = DB::table('sketches')->whereNotNull('user_data')->get();
        foreach ($sketches as $sketch) {
            $exists = DB::table('sketch_progress')
                ->where('user_id', $userId)
                ->where('sketch_id', $sketch->id)
                ->exists();

            if (!$exists) {
                DB::table('sketch_progress')->insert([
                    'user_id' => $userId,
                    'sketch_id' => $sketch->id,
                    'user_data' => $sketch->user_data,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 5. Migrar progreso global de coloreables a la tabla pivot coloring_progress
        $coloringPages = DB::table('coloring_pages')->whereNotNull('user_data')->get();
        foreach ($coloringPages as $page) {
            $exists = DB::table('coloring_progress')
                ->where('user_id', $userId)
                ->where('coloring_page_id', $page->id)
                ->exists();

            if (!$exists) {
                DB::table('coloring_progress')->insert([
                    'user_id' => $userId,
                    'coloring_page_id' => $page->id,
                    'user_data' => $page->user_data,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No revert actions needed for data association
    }
};
