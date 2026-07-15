<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'transaction_id' => $this->transaction_id,
            'payment_method' => $this->payment_method,
            'payment_method_label' => $this->payment_method_label,
            'amount' => (float) $this->amount,
            'currency' => $this->currency,
            'status' => $this->status,
            'status_label' => $this->status_label,
            'cinetpay_data' => $this->whenNotNull($this->cinetpay_data),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'order' => $this->whenLoaded('order', fn () => [
                'id' => $this->order->id,
                'reference' => $this->order->reference,
                'client_name' => $this->order->client_name,
                'status' => $this->order->status,
            ]),
        ];
    }
}
