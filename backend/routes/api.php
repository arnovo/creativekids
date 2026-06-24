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

// ─── Autenticación (Pública) ─────────────────────────────────
use App\Http\Controllers\Api\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ─── Rutas Públicas (Lectura libre) ──────────────────────────
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\SketchController;
use App\Http\Controllers\Api\ColoringPageController;

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/sketches', [SketchController::class, 'index']);
Route::get('/sketches/{sketch}', [SketchController::class, 'show']);
Route::get('/coloring-pages', [ColoringPageController::class, 'index']);
Route::get('/coloring-pages/{coloring_page}', [ColoringPageController::class, 'show']);

// ─── Rutas Protegidas (Escritura y datos personales) ─────────
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\FreeDrawingController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::post('/categories', [CategoryController::class, 'store']);

    Route::post('sketches/{sketch}/progress', [SketchController::class, 'saveProgress']);
    Route::post('coloring-pages/{coloring_page}/progress', [ColoringPageController::class, 'saveProgress']);

    Route::apiResource('notes', NoteController::class);
    Route::apiResource('free-drawings', FreeDrawingController::class);
});
