<?php

namespace App\Services;

use App\Models\Order;
use App\Models\PortfolioItem;
use App\Models\Quote;
use App\Models\Testimonial;
use Carbon\Carbon;

class HomeStatsService
{
    public function compute(): array
    {
        return [
            'clients_count' => $this->clientsCount(),
            'projects_count' => PortfolioItem::count(),
            'years_experience' => $this->yearsExperience(),
            'satisfaction_rate' => $this->satisfactionRate(),
        ];
    }

    private function clientsCount(): int
    {
        $identities = collect()
            ->merge(Quote::pluck('client_email'))
            ->merge(Order::pluck('client_email'))
            ->merge(PortfolioItem::pluck('client_name'))
            ->filter()
            ->map(fn (string $identity) => strtolower(trim($identity)));

        return $identities->unique()->count();
    }

    private function yearsExperience(): int
    {
        $foundedAt = Carbon::parse(config('app.founded_at'));

        return max(1, (int) $foundedAt->diffInYears(now()));
    }

    private function satisfactionRate(): int
    {
        $average = Testimonial::where('is_active', true)->avg('rating');

        return $average ? (int) round(($average / 5) * 100) : 100;
    }
}
