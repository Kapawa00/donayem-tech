<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'client_name' => $this->client_name,
            'client_company' => $this->client_company,
            'client_photo' => $this->client_photo,
            'content' => $this->content,
            'rating' => $this->rating,
            'service_category' => $this->service_category,
        ];
    }
}
