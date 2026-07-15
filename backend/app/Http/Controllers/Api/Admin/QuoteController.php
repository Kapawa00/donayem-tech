<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateQuoteRequest;
use App\Http\Resources\QuoteResource;
use App\Models\Order;
use App\Models\Quote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class QuoteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $quotes = Quote::query()
            ->with('order')
            ->when($request->filled('status'), fn ($query) => $query->where('status', $request->input('status')))
            ->when($request->filled('service_category'), fn ($query) => $query->where('service_category', $request->input('service_category')))
            ->when($request->filled('date'), fn ($query) => $query->whereDate('created_at', $request->input('date')))
            ->latest()
            ->paginate(20);

        return QuoteResource::collection($quotes)->response();
    }

    public function show(Quote $quote): JsonResponse
    {
        return (new QuoteResource($quote->load('order')))->response();
    }

    public function update(UpdateQuoteRequest $request, Quote $quote): JsonResponse
    {
        try {
            $quote->update($request->validated());

            return (new QuoteResource($quote->fresh('order')))->response();
        } catch (Throwable $e) {
            Log::error('Admin\QuoteController::update a échoué.', [
                'quote_id' => $quote->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Impossible de mettre à jour la demande de devis.'], 500);
        }
    }

    public function createOrder(Quote $quote): JsonResponse
    {
        try {
            if ($quote->status !== 'accepted') {
                return response()->json([
                    'message' => 'Seule une demande de devis acceptée peut générer une commande.',
                ], 422);
            }

            if ($quote->total_amount === null) {
                return response()->json([
                    'message' => 'Veuillez renseigner un montant total avant de créer la commande.',
                ], 422);
            }

            if ($quote->order()->exists()) {
                return response()->json([
                    'message' => 'Une commande existe déjà pour cette demande de devis.',
                ], 422);
            }

            $order = Order::create([
                'quote_id' => $quote->id,
                'client_name' => $quote->client_name,
                'client_email' => $quote->client_email,
                'client_phone' => $quote->client_phone,
                'service_description' => $quote->project_description,
                'amount' => $quote->total_amount,
                'currency' => 'XAF',
                'status' => 'pending',
            ]);

            return response()->json(['data' => $order], 201);
        } catch (Throwable $e) {
            Log::error('Admin\QuoteController::createOrder a échoué.', [
                'quote_id' => $quote->id,
                'message' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Impossible de créer la commande.'], 500);
        }
    }
}
