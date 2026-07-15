<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->getTranslations('title'),
            'slug' => $this->slug,
            'excerpt' => $this->getTranslations('excerpt'),
            'content' => $this->getTranslations('content'),
            'cover_image' => $this->cover_image,
            'category' => $this->category,
            'tags' => $this->whenNotNull($this->tags),
            'status' => $this->status,
            'author' => $this->whenLoaded('author', fn () => $this->author->name),
            'published_at' => $this->published_at?->toIso8601String(),
            'meta_title' => $this->getTranslations('meta_title'),
            'meta_description' => $this->getTranslations('meta_description'),
        ];
    }
}
