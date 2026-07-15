<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'client_name' => $this->client_name,
            'client_email' => $this->client_email,
            'client_phone' => $this->client_phone,
            'client_company' => $this->client_company,
            'service_category' => $this->service_category,
            'services_requested' => $this->services_requested,
            'project_description' => $this->project_description,
            'budget_range' => $this->budget_range,
            'deadline' => $this->deadline?->toDateString(),
            'status' => $this->status,
            'status_label' => $this->status_label,
            'admin_notes' => $this->admin_notes,
            'total_amount' => $this->total_amount !== null ? (float) $this->total_amount : null,
            'has_order' => $this->relationLoaded('order') ? $this->order !== null : false,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
