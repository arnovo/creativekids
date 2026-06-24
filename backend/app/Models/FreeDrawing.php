<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FreeDrawing extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'background_color', 'thumbnail_path', 'strokes', 'user_id'];

    protected $casts = [
        'strokes' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
