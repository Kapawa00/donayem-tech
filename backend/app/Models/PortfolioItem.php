<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class PortfolioItem extends Model
{
    use HasFactory;
    use HasTranslations;

    public array $translatable = ['title', 'description'];

    protected $fillable = [
        'title',
        'category',
        'description',
        'media_type',
        'media_url',
        'thumbnail_url',
        'client_name',
        'completion_date',
        'is_featured',
        'tags',
    ];

    protected function casts(): array
    {
        return [
            'completion_date' => 'date',
            'is_featured' => 'boolean',
            'tags' => 'array',
        ];
    }
}
