<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes — CreativaKids
|--------------------------------------------------------------------------
|
| Todas las rutas aquí están prefijadas con /api automáticamente.
| Nginx redirige /api/* a PHP-FPM (Laravel).
|
*/

// ─── Health Check ─────────────────────────────────────────
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        $dbStatus = 'connected';
    } catch (\Exception $e) {
        $dbStatus = 'disconnected: ' . $e->getMessage();
    }

    return response()->json([
        'status'   => 'ok',
        'app'      => config('app.name'),
        'php'      => PHP_VERSION,
        'laravel'  => app()->version(),
        'database' => $dbStatus,
        'timestamp' => now()->toIso8601String(),
    ]);
});

// ─── Fase 2: Rutas de módulos ───────────────────────────────
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SketchController;
use App\Http\Controllers\Api\ColoringPageController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\FreeDrawingController;

Route::apiResource('categories', CategoryController::class);
Route::apiResource('sketches', SketchController::class);
Route::post('sketches/{sketch}/progress', [SketchController::class, 'saveProgress']);

Route::apiResource('coloring-pages', ColoringPageController::class);
Route::post('coloring-pages/{coloring_page}/progress', [ColoringPageController::class, 'saveProgress']);

Route::apiResource('notes', NoteController::class);
Route::apiResource('free-drawings', FreeDrawingController::class);
