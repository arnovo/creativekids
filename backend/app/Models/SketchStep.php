<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SketchStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'sketch_id',
        'step_number',
        'image_path',
        'description',
    ];

    // ─── Relationships ────────────────────────────────────
    public function sketch(): BelongsTo
    {
        return $this->belongsTo(Sketch::class);
    }

    // ─── Accessors ────────────────────────────────────────
    protected function imageUrl(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(
            get: fn () => $this->image_path
                ? asset('storage/' . $this->image_path)
                : null,
        );
    }

    protected $appends = ['image_url'];
}
