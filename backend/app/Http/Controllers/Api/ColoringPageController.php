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

        $pages = $query->get();
        $user = \Illuminate\Support\Facades\Auth::guard('sanctum')->user();

        if ($user) {
            // Obtener el progreso de colorear del usuario de forma masiva si está autenticado
            $progressMap = \App\Models\ColoringProgress::where('user_id', $user->id)
                ->pluck('user_data', 'coloring_page_id');

            foreach ($pages as $page) {
                $page->user_data = $progressMap->get($page->id);
            }
        }

        return response()->json($pages);
    }

    public function show(Request $request, ColoringPage $coloringPage)
    {
        $user = \Illuminate\Support\Facades\Auth::guard('sanctum')->user();
        
        if ($user) {
            $progress = \App\Models\ColoringProgress::where('user_id', $user->id)
                ->where('coloring_page_id', $coloringPage->id)
                ->first();

            $coloringPage->user_data = $progress ? $progress->user_data : null;
        }

        return response()->json($coloringPage);
    }

    public function saveProgress(Request $request, ColoringPage $coloringPage)
    {
        $request->validate([
            'user_data' => 'nullable|array'
        ]);

        $user = $request->user();

        $progress = \App\Models\ColoringProgress::updateOrCreate(
            ['user_id' => $user->id, 'coloring_page_id' => $coloringPage->id],
            ['user_data' => $request->user_data]
        );

        $coloringPage->user_data = $progress->user_data;

        return response()->json($coloringPage);
    }
}
