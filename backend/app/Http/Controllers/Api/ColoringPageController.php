<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ColoringPage;
use Illuminate\Http\Request;

class ColoringPageController extends Controller
{
    public function index(Request $request)
    {
        $query = ColoringPage::query();

        if ($request->has('category')) {
            $query->where('category_name', $request->category);
        }

        return response()->json($query->get());
    }

    public function show(ColoringPage $coloringPage)
    {
        return response()->json($coloringPage);
    }

    public function saveProgress(Request $request, ColoringPage $coloringPage)
    {
        $request->validate([
            'user_data' => 'nullable|array'
        ]);

        $coloringPage->user_data = $request->user_data;
        $coloringPage->save();

        return response()->json($coloringPage);
    }
}
