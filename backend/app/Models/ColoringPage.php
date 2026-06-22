<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ColoringPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'svg_path',
        'thumbnail_path',
        'category_name',
        'difficulty',
        'user_data',
    ];

    protected $casts = [
        'user_data' => 'array',
    ];

    // ─── Accessors ────────────────────────────────────────
    protected function svgUrl(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => $this->svg_path
                ? asset('storage/' . $this->svg_path)
                : null,
        );
    }

    protected function thumbnailUrl(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => $this->thumbnail_path
                ? asset('storage/' . $this->thumbnail_path)
                : null,
        );
    }

    protected $appends = ['svg_url', 'thumbnail_url'];
}
