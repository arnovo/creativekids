<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FreeDrawing;
use Illuminate\Http\Request;

class FreeDrawingController extends Controller
{
    public function index(Request $request)
    {
        // Return latest drawings first, scoped to user
        return response()->json($request->user()->freeDrawings()->orderBy('updated_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'background_color' => 'nullable|string',
            'strokes' => 'nullable|array',
        ]);

        $validated['user_id'] = $request->user()->id;

        $drawing = FreeDrawing::create($validated);
        return response()->json($drawing, 201);
    }

    public function show(Request $request, FreeDrawing $freeDrawing)
    {
        $userDrawing = $request->user()->freeDrawings()->findOrFail($freeDrawing->id);
        return response()->json($userDrawing);
    }

    public function update(Request $request, FreeDrawing $freeDrawing)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'background_color' => 'nullable|string',
            'strokes' => 'nullable|array',
        ]);

        $userDrawing = $request->user()->freeDrawings()->findOrFail($freeDrawing->id);
        $userDrawing->update($validated);
        
        return response()->json($userDrawing);
    }

    public function destroy(Request $request, FreeDrawing $freeDrawing)
    {
        $userDrawing = $request->user()->freeDrawings()->findOrFail($freeDrawing->id);
        $userDrawing->delete();
        
        return response()->json(null, 204);
    }
}
