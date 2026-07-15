<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'client_name',
        'client_email',
        'client_phone',
        'client_company',
        'service_category',
        'services_requested',
        'project_description',
        'budget_range',
        'deadline',
        'status',
        'admin_notes',
        'total_amount',
    ];

    protected function casts(): array
    {
        return [
            'services_requested' => 'array',
            'deadline' => 'date',
            'total_amount' => 'decimal:2',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $quote) {
            if (empty($quote->reference)) {
                $quote->reference = static::generateReference();
            }
        });
    }

    protected static function generateReference(): string
    {
        do {
            $reference = 'DEVIS-'.now()->format('Ymd').'-'.str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (static::where('reference', $reference)->exists());

        return $reference;
    }

    public function order(): HasOne
    {
        return $this->hasOne(Order::class);
    }

    public function getStatusLabelAttribute(): string
    {
        return match ($this->status) {
            'reviewing' => 'En cours',
            'accepted' => 'Accepté',
            'rejected' => 'Refusé',
            'paid' => 'Payé',
            default => 'Nouveau',
        };
    }
}
