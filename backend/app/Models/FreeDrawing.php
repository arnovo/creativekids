<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreeDrawing extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'background_color', 'thumbnail_path', 'strokes'];

    protected $casts = [
        'strokes' => 'array',
    ];
}
