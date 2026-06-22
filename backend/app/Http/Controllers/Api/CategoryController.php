<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(Category::ordered()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'color'      => 'nullable|string|max:7',
            'icon'       => 'nullable|string|max:255',
            'sort_order' => 'integer|default:0',
        ]);

        $category = Category::create($validated);
        return response()->json($category, 201);
    }

    public function show(Category $category)
    {
        return response()->json($category->load('notes'));
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name'       => 'string|max:255',
            'color'      => 'string|max:7',
            'icon'       => 'string|max:255',
            'sort_order' => 'integer',
        ]);

        $category->update($validated);
        return response()->json($category);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return response()->noContent();
    }
}
