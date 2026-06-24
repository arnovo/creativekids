<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ColoringProgress extends Model
{
    use HasFactory;

    protected $table = 'coloring_progress';

    protected $fillable = [
        'user_id',
        'coloring_page_id',
        'user_data',
    ];

    protected $casts = [
        'user_data' => 'array',
    ];

    // ─── Relationships ────────────────────────────────────
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function coloringPage(): BelongsTo
    {
        return $this->belongsTo(ColoringPage::class);
    }
}
