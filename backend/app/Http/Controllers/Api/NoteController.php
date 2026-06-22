<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $query = Note::query();
        
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }
        
        if ($request->has('is_pinned')) {
            $query->where('is_pinned', filter_var($request->is_pinned, FILTER_VALIDATE_BOOLEAN));
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'content'     => 'nullable|string',
            'strokes'     => 'nullable|array',
            'category_id' => 'nullable|exists:categories,id',
            'color'       => 'nullable|string|max:7',
            'is_pinned'   => 'boolean',
            'text_style'  => 'nullable|array',
        ]);

        $note = Note::create($validated);
        return response()->json($note, 201);
    }

    public function show(Note $note)
    {
        return response()->json($note);
    }

    public function update(Request $request, Note $note)
    {
        $validated = $request->validate([
            'title'       => 'string|max:255',
            'content'     => 'nullable|string',
            'strokes'     => 'nullable|array',
            'category_id' => 'nullable|exists:categories,id',
            'color'       => 'nullable|string|max:7',
            'is_pinned'   => 'boolean',
            'text_style'  => 'nullable|array',
        ]);

        $note->update($validated);
        return response()->json($note);
    }

    public function destroy(Note $note)
    {
        $note->delete();
        return response()->noContent();
    }
}
