<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sketch;
use Illuminate\Http\Request;

class SketchController extends Controller
{
    public function index()
    {
        return response()->json(Sketch::all());
    }

    public function show(Sketch $sketch)
    {
        return response()->json($sketch->load('steps'));
    }

    public function saveProgress(Request $request, Sketch $sketch)
    {
        $request->validate([
            'user_data' => 'nullable|array'
        ]);

        $sketch->user_data = $request->user_data;
        $sketch->save();

        return response()->json($sketch);
    }
}
