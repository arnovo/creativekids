<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sketch extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'difficulty',
        'thumbnail_path',
        'total_steps',
        'user_data',
    ];

    protected $casts = [
        'user_data' => 'array',
    ];

    // ─── Relationships ────────────────────────────────────
    public function steps(): HasMany
    {
        return $this->hasMany(SketchStep::class)->orderBy('step_number');
    }

    // ─── Accessors ────────────────────────────────────────
    protected function thumbnailUrl(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => $this->thumbnail_path
                ? asset('storage/' . $this->thumbnail_path)
                : null,
        );
    }

    protected $appends = ['thumbnail_url'];
}
