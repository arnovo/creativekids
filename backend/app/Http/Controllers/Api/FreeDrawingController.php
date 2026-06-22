<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FreeDrawing;
use Illuminate\Http\Request;

class FreeDrawingController extends Controller
{
    public function index()
    {
        // Return latest drawings first
        return response()->json(FreeDrawing::orderBy('updated_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string',
            'background_color' => 'nullable|string',
            'strokes' => 'nullable|array',
        ]);

        $drawing = FreeDrawing::create($request->all());
        return response()->json($drawing, 201);
    }

    public function show(FreeDrawing $freeDrawing)
    {
        return response()->json($freeDrawing);
    }

    public function update(Request $request, FreeDrawing $freeDrawing)
    {
        $request->validate([
            'title' => 'nullable|string',
            'background_color' => 'nullable|string',
            'strokes' => 'nullable|array',
        ]);

        $freeDrawing->update($request->all());
        return response()->json($freeDrawing);
    }

    public function destroy(FreeDrawing $freeDrawing)
    {
        $freeDrawing->delete();
        return response()->json(null, 204);
    }
}
