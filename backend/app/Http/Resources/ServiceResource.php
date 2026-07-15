<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'category' => $this->category,
            'short_description' => $this->short_description,
            'long_description' => $this->long_description,
            'icon' => $this->icon,
            'cover_image' => $this->cover_image,
            'features' => $this->features,
            'starting_price' => $this->starting_price !== null ? (float) $this->starting_price : null,
            'is_active' => (bool) $this->is_active,
            'order' => $this->order,
        ];
    }
}
