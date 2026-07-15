<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class PaymentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $payments = Payment::query()
            ->with('order')
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->when($request->filled('payment_method'), fn ($query) => $query->where('payment_method', $request->input('payment_method')))
            ->when($request->filled('date'), fn ($query) => $query->whereDate('created_at', $request->input('date')))
            ->latest()
            ->paginate(20);

        return PaymentResource::collection($payments)->response();
    }

    public function show(Payment $payment): JsonResponse
    {
        return (new PaymentResource($payment->load('order')))->response();
    }

    public function refund(Payment $payment): JsonResponse
    {
        try {
            if ($payment->status !== 'success') {
                return response()->json([
                    'message' => 'Seul un paiement réussi peut être marqué comme à rembourser.',
                ], 422);
            }

            $payment->order->update(['status' => 'refunded']);

            Log::info('Admin\PaymentController::refund : commande marquée à rembourser.', [
                'payment_id' => $payment->id,
                'order_id' => $payment->order_id,
            ]);

            return (new PaymentResource($payment->fresh('order')))->response();
        } catch (Throwable $e) {
            Log::error('Admin\PaymentController::refund a échoué.', [
                'payment_id' => $payment->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Impossible de marquer ce paiement comme remboursé.'], 500);
        }
    }
}
