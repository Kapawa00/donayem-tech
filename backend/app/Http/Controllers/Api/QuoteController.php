<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuoteRequest;
use App\Mail\NewQuoteNotification;
use App\Mail\QuoteConfirmation;
use App\Models\Quote;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class QuoteController extends Controller
{
    public function store(StoreQuoteRequest $request): JsonResponse
    {
        $quote = Quote::create($request->validated());

        try {
            Mail::to($quote->client_email)->send(new QuoteConfirmation($quote));
            Mail::to('contact@donayemtech.com')->send(new NewQuoteNotification($quote));
        } catch (TransportExceptionInterface $e) {
            Log::error('Failed to send quote notification emails', [
                'quote_id' => $quote->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Votre demande de devis a été envoyée avec succès.',
            'quote_reference' => $quote->reference,
        ], 201);
    }
}
