<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sketch;
use Illuminate\Http\Request;

class SketchController extends Controller
{
    public function index(Request $request)
    {
        $sketches = Sketch::all();
        $user = \Illuminate\Support\Facades\Auth::guard('sanctum')->user();

        if ($user) {
            // Obtener el progreso del usuario si está autenticado
            $progressMap = \App\Models\SketchProgress::where('user_id', $user->id)
                ->pluck('user_data', 'sketch_id');

            foreach ($sketches as $sketch) {
                $sketch->user_data = $progressMap->get($sketch->id);
            }
        }

        return response()->json($sketches);
    }

    public function show(Request $request, Sketch $sketch)
    {
        $sketch->load('steps');
        $user = \Illuminate\Support\Facades\Auth::guard('sanctum')->user();

        if ($user) {
            $progress = \App\Models\SketchProgress::where('user_id', $user->id)
                ->where('sketch_id', $sketch->id)
                ->first();

            $sketch->user_data = $progress ? $progress->user_data : null;
        }

        return response()->json($sketch);
    }

    public function saveProgress(Request $request, Sketch $sketch)
    {
        $request->validate([
            'user_data' => 'nullable|array'
        ]);

        $user = $request->user();

        $progress = \App\Models\SketchProgress::updateOrCreate(
            ['user_id' => $user->id, 'sketch_id' => $sketch->id],
            ['user_data' => $request->user_data]
        );

        $sketch->user_data = $progress->user_data;

        return response()->json($sketch);
    }
}
