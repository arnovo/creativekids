<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'strokes',
        'category_id',
        'color',
        'is_pinned',
        'text_style',
    ];

    protected function casts(): array
    {
        return [
            'strokes'    => 'array',
            'is_pinned'  => 'boolean',
            'text_style' => 'array',
        ];
    }

    // ─── Relationships ────────────────────────────────────
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // ─── Scopes ───────────────────────────────────────────
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }
}
