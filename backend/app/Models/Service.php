<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Service extends Model
{
    use HasFactory;
    use HasTranslations;

    public array $translatable = ['title', 'short_description', 'long_description', 'features'];

    protected $fillable = [
        'title',
        'slug',
        'category',
        'short_description',
        'long_description',
        'icon',
        'cover_image',
        'features',
        'starting_price',
        'is_active',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'starting_price' => 'decimal:2',
            'is_active' => 'boolean',
            'order' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
