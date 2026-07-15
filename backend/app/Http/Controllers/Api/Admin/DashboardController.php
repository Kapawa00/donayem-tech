<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\QuoteResource;
use App\Models\ContactMessage;
use App\Models\Payment;
use App\Models\Quote;
use App\Services\HomeStatsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Throwable;

class DashboardController extends Controller
{
    public function __construct(private readonly HomeStatsService $homeStats)
    {
    }

    public function stats(): JsonResponse
    {
        try {
            return response()->json([
                'data' => [
                    'quotes_today' => Quote::whereDate('created_at', today())->count(),
                    'quotes_total' => Quote::count(),
                    'payments_today' => (float) Payment::where('status', 'success')
                        ->whereDate('paid_at', today())
                        ->sum('amount'),
                    'payments_total' => (float) Payment::where('status', 'success')->sum('amount'),
                    'messages_unread' => ContactMessage::where('status', 'new')->count(),
                    'home_stats' => $this->homeStats->compute(),
                    'latest_quotes' => QuoteResource::collection(
                        Quote::with('order')->latest()->take(5)->get()
                    ),
                    'latest_payments' => PaymentResource::collection(
                        Payment::with('order')->latest()->take(5)->get()
                    ),
                ],
            ]);
        } catch (Throwable $e) {
            Log::error('DashboardController::stats a échoué.', ['message' => $e->getMessage()]);

            return response()->json([
                'message' => 'Impossible de charger les statistiques du tableau de bord.',
            ], 500);
        }
    }
}
