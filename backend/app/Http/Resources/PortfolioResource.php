<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PortfolioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'description' => $this->description,
            'media_type' => $this->media_type,
            'media_url' => $this->media_url,
            'thumbnail_url' => $this->thumbnail_url,
            'client_name' => $this->client_name,
            'project_url' => $this->project_url,
            'completion_date' => $this->completion_date?->toDateString(),
            'is_featured' => $this->is_featured,
            'tags' => $this->tags,
        ];
    }
}
